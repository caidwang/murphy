import extractZip from 'extract-zip'
import { mkdtemp, readFile, rm } from 'fs/promises'
import { join, normalize } from 'path'
import { tmpdir } from 'os'

export interface ParsedStudent {
  name: string
  student_number: string
}

export interface ExcelStudentImportPreview {
  filePath: string
  fileName: string
  students: ParsedStudent[]
  totalRows: number
  skippedRows: number
  detectedColumns: {
    name: string
    studentNumber: string
  }
}

interface WorksheetParseResult {
  headers: string[]
  rows: string[][]
  headerRowIndex: number
}

const NAME_HEADER_ALIASES = [
  '姓名',
  '学生姓名',
  '学生名字',
  '名字',
  'name',
  'studentname',
  'fullname'
]
const NUMBER_HEADER_ALIASES = [
  '学号',
  '学生号',
  '学生编号',
  '编号',
  'studentnumber',
  'studentno',
  'studentid',
  'number',
  'no',
  'id'
]

function decodeXml(value: string): string {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_match, code: string) => String.fromCharCode(Number(code)))
    .replace(/&#x([a-fA-F0-9]+);/g, (_match, code: string) =>
      String.fromCharCode(parseInt(code, 16))
    )
}

function getAttribute(source: string, name: string): string | undefined {
  const match = source.match(new RegExp(`${name}="([^"]*)"`, 'i'))
  return match ? decodeXml(match[1]) : undefined
}

function normalizeHeader(value: string): string {
  return value.replace(/[\s:_\-（）()【】[\].。·]/g, '').toLowerCase()
}

function headerScore(header: string, aliases: string[]): number {
  const normalized = normalizeHeader(header)
  let bestScore = 0

  for (const alias of aliases) {
    const normalizedAlias = normalizeHeader(alias)
    if (normalized === normalizedAlias) {
      bestScore = Math.max(bestScore, 4)
    } else if (normalized.includes(normalizedAlias)) {
      bestScore = Math.max(bestScore, 2)
    }
  }

  return bestScore
}

function getColumnIndex(headers: string[], aliases: string[]): number {
  return headers.reduce(
    (best, header, index) => {
      const score = headerScore(header, aliases)
      return score > best.score ? { index, score } : best
    },
    { index: -1, score: 0 }
  ).index
}

function columnLettersToIndex(letters: string): number {
  return letters.split('').reduce((index, letter) => index * 26 + letter.charCodeAt(0) - 64, 0) - 1
}

function normalizeCellValue(value: string): string {
  const trimmed = value.trim()
  return /^\d+\.0$/.test(trimmed) ? trimmed.slice(0, -2) : trimmed
}

function parseSharedStrings(xml: string): string[] {
  const sharedStrings: string[] = []
  const itemRegex = /<si\b[^>]*>([\s\S]*?)<\/si>/g
  let itemMatch: RegExpExecArray | null

  while ((itemMatch = itemRegex.exec(xml))) {
    const itemXml = itemMatch[1]
    const textParts = [...itemXml.matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g)].map((match) =>
      decodeXml(match[1])
    )
    sharedStrings.push(textParts.join(''))
  }

  return sharedStrings
}

function getFirstWorksheetPath(extractDir: string, workbookXml: string, relsXml: string): string {
  const sheetMatch = workbookXml.match(/<sheet\b[^>]*r:id="([^"]+)"[^>]*\/?>/i)
  const relationshipId = sheetMatch ? decodeXml(sheetMatch[1]) : ''
  const relationshipRegex = /<Relationship\b([^>]*)\/?>/g
  let relationshipMatch: RegExpExecArray | null

  while ((relationshipMatch = relationshipRegex.exec(relsXml))) {
    const attributes = relationshipMatch[1]
    if (getAttribute(attributes, 'Id') !== relationshipId) continue

    const target = getAttribute(attributes, 'Target')
    if (!target) break

    const normalizedTarget = target.startsWith('/') ? target.replace(/^\/xl\//, '') : target
    return normalize(join(extractDir, 'xl', normalizedTarget))
  }

  return join(extractDir, 'xl', 'worksheets', 'sheet1.xml')
}

function parseWorksheet(xml: string, sharedStrings: string[]): WorksheetParseResult {
  const rowMap = new Map<number, Map<number, string>>()
  const cellRegex = /<c\b([^>]*)>([\s\S]*?)<\/c>/g
  let cellMatch: RegExpExecArray | null

  while ((cellMatch = cellRegex.exec(xml))) {
    const attributes = cellMatch[1]
    const body = cellMatch[2]
    const reference = getAttribute(attributes, 'r')
    const referenceMatch = reference?.match(/^([A-Z]+)(\d+)$/)
    if (!referenceMatch) continue

    const columnIndex = columnLettersToIndex(referenceMatch[1])
    const rowIndex = Number(referenceMatch[2]) - 1
    const type = getAttribute(attributes, 't')
    const rawValue = body.match(/<v\b[^>]*>([\s\S]*?)<\/v>/)?.[1] ?? ''
    const inlineValue = body.match(/<t\b[^>]*>([\s\S]*?)<\/t>/)?.[1] ?? ''

    let value = ''
    if (type === 's') {
      value = sharedStrings[Number(rawValue)] ?? ''
    } else if (type === 'inlineStr') {
      value = decodeXml(inlineValue)
    } else {
      value = decodeXml(rawValue || inlineValue)
    }

    if (!rowMap.has(rowIndex)) {
      rowMap.set(rowIndex, new Map())
    }
    rowMap.get(rowIndex)?.set(columnIndex, normalizeCellValue(value))
  }

  const sortedRows = [...rowMap.entries()].sort(([left], [right]) => left - right)
  const maxColumnIndex = Math.max(0, ...sortedRows.flatMap(([, row]) => [...row.keys()]))
  const rows = sortedRows.map(([, row]) =>
    Array.from({ length: maxColumnIndex + 1 }, (_value, index) => row.get(index) ?? '')
  )

  const headerRowIndex = rows.findIndex((row) => {
    const nameIndex = getColumnIndex(row, NAME_HEADER_ALIASES)
    const numberIndex = getColumnIndex(row, NUMBER_HEADER_ALIASES)
    return nameIndex >= 0 && numberIndex >= 0 && nameIndex !== numberIndex
  })

  if (headerRowIndex < 0) {
    throw new Error('未能识别姓名和学号列，请确认 Excel 表头包含“姓名”和“学号”。')
  }

  return {
    headers: rows[headerRowIndex],
    rows: rows.slice(headerRowIndex + 1),
    headerRowIndex
  }
}

export async function parseStudentsFromExcel(filePath: string): Promise<ExcelStudentImportPreview> {
  const extractDir = await mkdtemp(join(tmpdir(), 'murphy-excel-'))

  try {
    await extractZip(filePath, { dir: extractDir })

    const sharedStringsPath = join(extractDir, 'xl', 'sharedStrings.xml')
    const workbookPath = join(extractDir, 'xl', 'workbook.xml')
    const workbookRelsPath = join(extractDir, 'xl', '_rels', 'workbook.xml.rels')

    let sharedStrings: string[] = []
    try {
      sharedStrings = parseSharedStrings(await readFile(sharedStringsPath, 'utf-8'))
    } catch {
      sharedStrings = []
    }

    let worksheetPath = join(extractDir, 'xl', 'worksheets', 'sheet1.xml')
    try {
      worksheetPath = getFirstWorksheetPath(
        extractDir,
        await readFile(workbookPath, 'utf-8'),
        await readFile(workbookRelsPath, 'utf-8')
      )
    } catch {
      worksheetPath = join(extractDir, 'xl', 'worksheets', 'sheet1.xml')
    }
    const worksheetXml = await readFile(worksheetPath, 'utf-8')
    const worksheet = parseWorksheet(worksheetXml, sharedStrings)
    const nameColumnIndex = getColumnIndex(worksheet.headers, NAME_HEADER_ALIASES)
    const numberColumnIndex = getColumnIndex(worksheet.headers, NUMBER_HEADER_ALIASES)
    const seenStudentNumbers = new Set<string>()
    let skippedRows = 0

    const students = worksheet.rows.reduce<ParsedStudent[]>((result, row) => {
      const name = normalizeCellValue(row[nameColumnIndex] ?? '')
      const studentNumber = normalizeCellValue(row[numberColumnIndex] ?? '')

      if (!name || !studentNumber || seenStudentNumbers.has(studentNumber)) {
        skippedRows += 1
        return result
      }

      seenStudentNumbers.add(studentNumber)
      result.push({
        name,
        student_number: studentNumber
      })
      return result
    }, [])

    if (students.length === 0) {
      throw new Error('没有解析到有效学生，请确认姓名和学号列下有数据。')
    }

    return {
      filePath,
      fileName: filePath.split(/[\\/]/).pop() ?? filePath,
      students,
      totalRows: worksheet.rows.length,
      skippedRows,
      detectedColumns: {
        name: worksheet.headers[nameColumnIndex],
        studentNumber: worksheet.headers[numberColumnIndex]
      }
    }
  } finally {
    await rm(extractDir, { recursive: true, force: true })
  }
}
