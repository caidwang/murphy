# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project Overview

Murphy is an Electron desktop application with React and TypeScript for classroom and student management. Teachers can create, edit, and delete classrooms, and view/manage students within each classroom.

## Common Commands

```bash
npm run dev        # Start development server with hot reload
npm run build      # Production build
npm run build:mac  # Build macOS app
npm run build:win  # Build Windows app
npm run build:linux  # Build Linux app
npm run lint       # Run ESLint
npm run format     # Run Prettier
npm run typecheck  # Run TypeScript type checking (node + web)
```

## Architecture

### Electron Process Model

```
Main Process (Node.js)          Preload Script           Renderer Process (React)
┌─────────────────────────┐    ┌──────────────┐    ┌──────────────────────┐
│ - Window management      │◄──►│ contextBridge│◄──►│ - UI rendering        │
│ - IPC Handler registry   │    │ (API bridge) │    │ - User interaction    │
│ - Business logic         │    └──────────────┘    └──────────────────────┘
│ - Database access        │
└─────────────────────────┘
```

### Main Process Layers (src/main/)

- **repositories/** - Database access (SQLite via better-sqlite3)
- **services/** - Business logic layer
- **ipc-handlers/** - IPC communication handlers (renderer ↔ main)
- **models/** - Data models (Classroom, Student)

The main process initializes database, repositories, and services at startup (`app.whenReady()`), then registers IPC handlers.

### Renderer Process (src/renderer/src/)

- **pages/** - Route pages (ClassManagementPage, ClassDetailPage, HomePage)
- **components/** - React components
- **lib/** - Utilities (utils.ts with cn() helper)

### Path Aliases

- `@renderer/*` → `src/renderer/src/*`
- `~/components/*` → `src/renderer/src/components/*`
- `~/lib/*` → `src/renderer/src/lib/*`

### Database

SQLite database stored at `{userData}/murphy.db`. Tables:
- **classrooms** - id, name, background_image_path, theme_color, created_at
- **students** - id, name, student_number, avatar_path, classroom_id, created_at

### IPC Channels

| Channel | Direction | Purpose |
|---------|-----------|---------|
| `classrooms:create` | renderer → main | Create classroom |
| `classrooms:getAll` | renderer → main | Get all classrooms |
| `classrooms:findById` | renderer → main | Get classroom by ID |
| `classrooms:delete` | renderer → main | Delete classroom |
| `students:getByClassroomId` | renderer → main | Get students in classroom |

### Known Issues

1. Missing UI components: `Input` and `Label` components are imported in `CreateEditClassDialog` but don't exist at `src/renderer/src/components/ui/`
2. Incomplete student handlers: `studentHandler.ts` only implements `getByClassroomId` - create/update/delete handlers are not yet wired up
3. UI language: Interface text is primarily in Simplified Chinese (班级 = classroom, 学生 = student)

## Tech Stack

- Electron 39 + electron-vite 5 + Vite 7
- React 19 + TypeScript 5
- Tailwind CSS 3 + Radix UI + lucide-react icons
- better-sqlite3 for local database
