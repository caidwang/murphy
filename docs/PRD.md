# Murphy 课堂管理应用 - 产品需求文档 (PRD)

## 文档信息

| 项目 | 内容 |
|------|------|
| 产品名称 | Murphy |
| 产品类型 | Electron 桌面应用 (React + TypeScript + better-sqlite3) |
| 文档版本 | v1.0 |
| 编写日期 | 2026/04/29 |
| 文档语言 | 简体中文 |

---

## 一、产品概述

Murphy 是一款面向教师的课堂和学生管理桌面应用，支持班级管理、学生信息管理以及随机点名等教学互动功能。

### 1.1 核心功能模块

1. **班级管理** - 班级的创建、编辑、删除、查看
2. **学生管理** - 学生的增删改查、批量操作
3. **随机点名** - 滚动抽奖式随机点名
4. **点名反馈** - 点赞/需要改进反馈记录
5. **点名统计** - 历史点名数据统计与分析
6. **点名设置** - 点名规则自定义

---

## 二、UI 设计系统

### 2.1 设计原则

1. **Notion 极简风格** - 简洁、功能性强、阴影淡、边框低对比度
2. **一致的间距** - 8px 基础单位系统 (页面用 p-8, 网格用 gap-6)
3. **功能性配色** - 颜色用于语义目的，而非装饰
4. **字体层次** - 标题、副标题、说明文字清晰区分

### 2.2 颜色系统

**基础色**:
```css
--bg-primary: #FAFAFA;       /* 页面背景 */
--bg-white: #FFFFFF;         /* 卡片/面板背景 */
--text-primary: #37352F;      /* 主要文字 (深灰) */
--text-secondary: #787774;   /* 次要文字 */
--text-tertiary: #9B9A97;    /* 说明文字 (标签、注释) */
--border-color: #E9E9E7;      /* 边框和分隔线 */
--hover-bg: #F7F6F3;         /* 悬停状态背景 */
--selected-bg: #F1F1EF;      /* 选中/激活状态背景 */
--accent-blue: #2383E2;      /* 主要强调色 */
```

**语义色**:
| 用途 | 背景色 | 深色文字/图标 |
|------|--------|---------------|
| 蓝色 (统计) | `#E3F2FD` | `#2383E2` |
| 绿色 (点赞) | `#E8F5E9` | `#0F7B6C` |
| 黄色 (红榜) | `#FFF9E6` | `#D9730D` |
| 橙色 (需要改进) | `#FFF4E6` | `#D9730D` |
| 红色 (黑榜) | `#FFEBEE` | `#E16259` |
| 紫色 | `#F3E5F5` | `#9B59B6` |

### 2.3 字体系统

**字体**: `'Alibaba PuHuiTi', 'PingFang SC', 'Microsoft YaHei', sans-serif`

**字号层级**:
| 样式 | Tailwind 类 | 用途 |
|------|-------------|------|
| 标题 | `text-4xl font-bold` | 页面标题 |
| 副标题 | `text-xl font-semibold` | 区块标题 |
| 正文 | `text-sm` | 主要内容 |
| 说明 | `text-xs` | 标签、注释 |
| 点名显示 | `text-8xl font-bold` | 随机点名大字体 |

### 2.4 间距规范

| 场景 | Tailwind 类 |
|------|-------------|
| 页面内边距 | `p-8` |
| 卡片内边距 | `p-6` 或 `p-5` |
| 区块间距 | `gap-6` 或 `gap-8` |
| 底部间距 | `mb-4`, `mb-6`, `mb-8` |
| 网格列数 | `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4` |
| 侧边栏宽度 | `w-64` (256px) |

### 2.5 组件样式

**卡片阴影**:
```css
.card-shadow {
  background: var(--bg-white);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.card-shadow-hover:hover {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  background: var(--hover-bg);
}
```

**按钮样式**:
| 类型 | Tailwind 类 |
|------|-------------|
| 主要按钮 | `bg-primary text-primary-foreground hover:bg-primary/90` |
| 次要按钮 | `border border-input bg-background hover:bg-accent` |
| 破坏性按钮 | `bg-destructive text-destructive-foreground` |
| 幽灵按钮 | `hover:bg-accent hover:text-accent-foreground` |

**输入框**:
```css
.input-field {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  transition: all 0.2s;
  background: var(--bg-white);
}
.input-field:focus {
  outline: none;
  border-color: var(--accent-blue);
  box-shadow: 0 0 0 2px rgba(35, 131, 226, 0.1);
}
```

**圆角与阴影**:
| 元素 | 圆角 | 阴影 |
|------|------|------|
| 卡片 | `6px` | `0 1px 3px rgba(0,0,0,0.1)` |
| 按钮 | `6px` 或 `rounded-md` | 无 |
| 输入框 | `6px` | 无 (focus 时有 ring) |
| 对话框 | `rounded-lg` | `shadow-lg` |
| 表格 | `rounded-md` | 无 |
| 头像 | `rounded-full` | 无 |

### 2.6 动画规范

| 动画 | 时长 | 缓动 | 触发 |
|------|------|------|------|
| 名字滚动 | 80ms (中), 40ms (快), 150ms (慢) | linear | 点名滚动时 |
| 卡片悬停阴影 | 200ms | ease-in-out | 鼠标进入/离开 |
| 按钮悬停 | 200ms | - | 鼠标进入/离开 |
| 对话框开/关 | 200ms | ease-out | 状态变化 |
| 反馈按钮点击 | 150ms | - | 点击 |
| 内容淡入 | 200ms | ease | 挂载 |

### 2.7 图标使用

- **主要图标库**: Font Awesome 6.4 (`fas`, `fab` 类)
- **React 组件图标**: lucide-react (用于 `X`, `Check`, `ChevronRight`, `Plus` 等)

---

## 三、功能优先级与技术缺口分析

> 注: 功能详细说明已移至附录 A (本文档末尾)

### 功能优先级矩阵

| 优先级 | 功能编号 | 功能名称 | 依赖关系 |
|--------|----------|----------|----------|
| P0 | F1 | 基础 UI 组件补全 | 无，独立 |
| P0 | F2 | 班级管理 CRUD 完善 | F1 |
| P0 | F3 | 学生管理 CRUD | F1, F2 |
| P1 | F4 | 班级学生数量显示 | F3 |
| P1 | F5 | 随机点名核心功能 | F3 |
| P2 | F6 | 点名反馈记录 | F5 |
| P2 | F7 | 点名统计面板 | F6 |
| P2 | F8 | 点名设置 | F5 |

---

## 三、功能需求详细说明

---

### F1: 基础 UI 组件补全 (Input/Label)

#### 1. Feature Overview

| 字段 | 内容 |
|------|------|
| **Feature 名称** | 基础表单组件 Input 和 Label |
| **用户故事** | 作为前端开发者，我需要使用标准化的 Input 和 Label 组件来构建表单界面，以保证 UI 一致性和可维护性。 |
| **功能摘要** | 创建 `@radix-ui/react-label` 和原生 Input 组件的封装，实现与现有 Radix UI 组件风格一致的基础表单组件。 |

#### 2. Functional Requirements

**FR1.1**: Input 组件必须支持以下功能:
- 标准文本输入框
- 通过 `className` 属性支持 Tailwind CSS 自定义样式
- 通过 `id` 属性支持与 Label 的关联
- 支持 `placeholder` 占位符文本
- 支持 `value` 和 `onChange` 受控操作
- 支持 `disabled` 和 `readonly` 状态
- 错误状态样式支持

**FR1.2**: Label 组件必须支持以下功能:
- 通过 `htmlFor` 属性关联 Input
- 支持 `className` 属性自定义样式
- 支持必填标识显示

**FR1.3**: 组件必须与现有 Radix UI 组件保持风格一致:
- 使用相同的 `cn` 工具函数
- 使用相同的 `class-variance-authority` 模式
- 支持暗色模式 (如果未来需要)

#### 3. Technical Requirements

**数据模型**: 无

**API 设计**: 无

**组件设计**:

```
src/renderer/src/components/ui/
├── input.tsx          # Input 组件
└── label.tsx         # Label 组件
```

**Input 组件接口**:
```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // 继承所有 HTML input 属性
}
```

**Label 组件接口**:
```typescript
import * as LabelPrimitive from "@radix-ui/react-label";

interface LabelProps extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
  // 继承 Radix Label 属性
}
```

**依赖**:
- `@radix-ui/react-label` (Label 组件依赖)

#### 4. Acceptance Criteria

| ID | 验收条件 | 验证方式 |
|----|----------|----------|
| AC1.1 | Input 组件可以在 CreateEditClassDialog 中正常渲染和使用 | 手动测试：打开创建班级对话框，输入字段可正常输入 |
| AC1.2 | Input 组件支持 focus、hover、disabled 等状态 | 视觉检查：各状态样式正确 |
| AC1.3 | Label 组件通过 htmlFor 正确关联 Input | 手动测试：点击 Label 聚焦对应的 Input |
| AC1.4 | 组件风格与 button.tsx、dialog.tsx 保持一致 | 视觉检查：配色、圆角、间距等一致 |
| AC1.5 | TypeScript 类型定义完整，无编译错误 | 运行 `npm run typecheck` 无错误 |

---

### F2: 班级管理 CRUD 完善 (修复 update)

#### 1. Feature Overview

| 字段 | 内容 |
|------|------|
| **Feature 名称** | 班级管理完整 CRUD - 修复更新功能 |
| **用户故事** | 作为教师，我需要编辑班级信息（名称、背景图、主题色），以保持班级信息的准确性。 |
| **功能摘要** | 注册 `classrooms:update` IPC handler，连接 Repository 的 update() 方法与前端编辑界面。 |

#### 2. Functional Requirements

**FR2.1**: IPC Handler 注册
- 在 `src/main/ipc-handlers/classroomHandler.ts` 中注册 `classrooms:update` handler
- handler 接收两个参数: `id: number` 和 `data: ClassroomUpdateData`
- 返回更新影响的行数

**FR2.2**: 前端调用
- `CreateEditClassDialog.tsx` 中的更新逻辑调用 `window.electron.ipcRenderer.invoke('classrooms:update', id, data)`
- 更新成功后调用 `onSave()` 回调刷新列表

**FR2.3**: 数据验证
- id 必须是有效的数字
- data 至少包含一个要更新的字段
- 班级名称不能为空

#### 3. Technical Requirements

**数据模型**: 无变更

```typescript
// ClassroomUpdateData 已定义
export type ClassroomUpdateData = Partial<Omit<Classroom, 'id' | 'created_at'>>;
```

**API 设计**:

| IPC 通道 | 方向 | 参数 | 返回值 | 说明 |
|----------|------|------|--------|------|
| `classrooms:update` | Renderer -> Main | `{id: number, data: ClassroomUpdateData}` | `number` | 返回影响行数 |

**组件设计**: 无新组件

**文件变更**:
```
src/main/ipc-handlers/classroomHandler.ts  # 添加 classrooms:update handler
```

#### 4. Acceptance Criteria

| ID | 验收条件 | 验证方式 |
|----|----------|----------|
| AC2.1 | 点击班级卡片菜单的"编辑"按钮可打开编辑对话框 | 手动测试 |
| AC2.2 | 修改班级名称后点击保存，数据正确更新 | 手动测试：编辑班级名称，刷新后查看是否保存 |
| AC2.3 | 修改主题色后点击保存，颜色正确更新 | 手动测试：修改主题色，刷新后查看是否保存 |
| AC2.4 | 更新成功后对话框关闭，列表刷新 | 视觉检查 |
| AC2.5 | 更新失败时显示错误提示 | 模拟错误场景 |
| AC2.6 | 编译无错误，IPC 调用正常 | 运行 `npm run typecheck` |

---

### F3: 学生管理 CRUD (完整)

#### 1. Feature Overview

| 字段 | 内容 |
|------|------|
| **Feature 名称** | 学生管理完整 CRUD |
| **用户故事** | 作为教师，我需要对学生信息进行增删改查操作，包括添加学生、编辑学生信息、删除学生、批量导入和删除。 |
| **功能摘要** | 完整实现学生的创建、读取、更新、删除 IPC handlers，以及对应的 React 组件和页面。 |

#### 2. Functional Requirements

**FR3.1**: 学生创建 (students:create)
- 创建新学生，关联到指定班级
- 必填字段: name, student_number, classroom_id
- 可选字段: avatar_path
- 自动设置 created_at
- 约束: UNIQUE(classroom_id, student_number) - 同一班级内学号唯一

**FR3.2**: 学生更新 (students:update)
- 根据 ID 更新学生信息
- 支持部分更新 (只更新提供的字段)
- 验证学号唯一性约束

**FR3.3**: 学生删除 (students:delete)
- 根据 ID 删除学生
- 支持单个删除

**FR3.4**: 学生查询 (students:getByClassroomId) - 已存在
- 根据 classroom_id 查询所有学生
- 按学号排序返回

**FR3.5**: 学生批量操作
- 批量创建学生 (bulkInsert)
- 批量删除学生 (bulkDelete)

**FR3.6**: 前端 UI
- 班级详情页 (ClassDetailPage) 显示学生列表
- 创建/编辑学生对话框 (CreateEditStudentDialog)
- 删除确认对话框
- 学生表格展示 (基于现有 StudentList 组件)

#### 3. Technical Requirements

**数据模型**: 无变更

**数据库操作**:
```typescript
// StudentCreationData
type StudentCreationData = {
  name: string;
  student_number: string;
  avatar_path?: string;
  classroom_id: number;
};

// StudentUpdateData
type StudentUpdateData = Partial<{
  name: string;
  student_number: string;
  avatar_path: string;
}>;
```

**API 设计**:

| IPC 通道 | 方向 | 参数 | 返回值 | 说明 |
|----------|------|------|--------|------|
| `students:create` | Renderer -> Main | `StudentCreationData` | `number` (新学生ID) | 创建学生 |
| `students:update` | Renderer -> Main | `{id: number, data: StudentUpdateData}` | `number` (影响行数) | 更新学生 |
| `students:delete` | Renderer -> Main | `number` (学生ID) | `number` (影响行数) | 删除学生 |
| `students:getByClassroomId` | Renderer -> Main | `number` (classroomId) | `Student[]` | 获取班级学生 |
| `students:bulkCreate` | Renderer -> Main | `StudentCreationData[]` | `void` | 批量创建 |
| `students:bulkDelete` | Renderer -> Main | `number[]` (学生ID数组) | `void` | 批量删除 |

**Service 层变更**:
```typescript
// StudentService.ts 需添加方法
class StudentService {
  create(data: StudentCreationData): number;
  update(id: number, data: StudentUpdateData): number;
  delete(id: number): number;
  bulkCreate(studentsData: StudentCreationData[]): void;
  bulkDelete(ids: number[]): void;
}
```

**组件设计**:
```
src/renderer/src/components/student/
├── CreateEditStudentDialog.tsx   # 创建/编辑学生对话框
├── StudentList.tsx                # 学生列表 (已存在，需增强)
└── StudentTable.tsx               # 学生表格组件
```

#### 4. Acceptance Criteria

| ID | 验收条件 | 验证方式 |
|----|----------|----------|
| AC3.1 | 可以成功添加学生到指定班级 | 手动测试：输入姓名、学号，保存后列表显示 |
| AC3.2 | 可以编辑现有学生信息 | 手动测试：修改学生信息，刷新后验证 |
| AC3.3 | 可以删除学生，列表正确更新 | 手动测试：删除学生，确认后列表更新 |
| AC3.4 | 同一班级内学号重复时显示错误 | 手动测试：输入重复学号，验证错误提示 |
| AC3.5 | 学生列表按学号排序显示 | 视觉检查 |
| AC3.6 | 批量导入功能正常 | 手动测试：导入多学生，验证是否都创建 |
| AC3.7 | 批量删除功能正常 | 手动测试：选择多个删除，验证结果 |
| AC3.8 | 编译无错误 | 运行 `npm run typecheck` |

---

### F4: 班级学生数量显示 (修复 ClassCard)

#### 1. Feature Overview

| 字段 | 内容 |
|------|------|
| **Feature 名称** | 班级卡片学生数量显示修复 |
| **用户故事** | 作为教师，我希望在班级卡片上看到每个班级实际的学生数量，以便快速了解班级规模。 |
| **功能摘要** | 修复 ClassCard.tsx 中硬编码的 studentCount=0，通过 IPC 获取真实的学生数量。 |

#### 2. Functional Requirements

**FR4.1**: 获取班级学生数量
- 新增 IPC 通道 `students:getCountByClassroomId`
- 返回指定班级的学生总数

**FR4.2**: ClassCard 组件优化
- 接收可选的 `studentCount` prop
- 如果未传入 prop，在组件内部调用 IPC 获取数量
- 显示实际学生数量

**FR4.3**: 性能优化
- 避免在 ClassGrid 中为每个卡片单独发起 IPC 请求
- 在 ClassGrid 层面批量获取所有班级的学生数量
- 通过 props 传递给 ClassCard

#### 3. Technical Requirements

**数据模型**: 无变更

**API 设计**:

| IPC 通道 | 方向 | 参数 | 返回值 | 说明 |
|----------|------|------|--------|------|
| `students:getCountByClassroomId` | Renderer -> Main | `number` (classroomId) | `number` | 获取班级学生数量 |

**组件设计**:

```typescript
// ClassCard props 变更
interface Props {
  classroom: Classroom;
  studentCount?: number;  // 新增可选 prop
  onCardClick: () => void;
  onDeleteClick: () => void;
}

// ClassGrid 变更
// 在加载时获取所有班级的学生数量
interface ClassroomWithCount extends Classroom {
  studentCount: number;
}
```

**文件变更**:
```
src/main/ipc-handlers/studentHandler.ts     # 添加 getCountByClassroomId handler
src/main/services/StudentService.ts        # 添加 getCountByClassroomId 方法
src/renderer/src/components/class/ClassCard.tsx   # 使用真实 studentCount
src/renderer/src/components/class/ClassGrid.tsx  # 批量获取学生数量
```

#### 4. Acceptance Criteria

| ID | 验收条件 | 验证方式 |
|----|----------|----------|
| AC4.1 | ClassCard 显示实际学生数量而非 0 | 视觉检查：对比数据库中的学生数 |
| AC4.2 | 空班级显示 "0名学生" | 视觉检查：创建空班级后查看 |
| AC4.3 | 添加学生后 ClassCard 数量自动更新 | 手动测试：添加学生后返回首页验证 |
| AC4.4 | 删除学生后 ClassCard 数量自动减少 | 手动测试：删除学生后返回首页验证 |
| AC4.5 | 性能良好，无明显加载延迟 | 体验测试 |

---

### F5: 随机点名核心功能

#### 1. Feature Overview

| 字段 | 内容 |
|------|------|
| **Feature 名称** | 随机点名核心功能 |
| **用户故事** | 作为教师，我想使用"欧皇选拔器"随机抽取学生回答问题，使课堂互动更加公平有趣。 |
| **功能摘要** | 实现基于 HTML 原型设计的随机点名功能，包括滚动动画、开始/停止控制、结果展示。 |

#### 2. Functional Requirements

**FR5.1**: 页面结构
- 左侧导航栏 (复用现有 Sidebar)
- 右侧主内容区
- 顶部返回按钮和标题
- 快捷入口：数据统计、设置按钮

**FR5.2**: 名字滚动显示区
- 大号字体显示 (text-8xl)
- 默认显示"点击开始"
- 滚动时显示随机切换的名字
- 停止时高亮显示选中学生

**FR5.3**: 开始/停止控制
- 单个大按钮控制开始和停止
- 开始状态显示停止图标
- 停止状态显示播放图标
- 滚动间隔: 80ms (参考原型)

**FR5.4**: 滚动逻辑
- 从当前班级学生列表中随机选择
- 使用 `Math.random()` 实现随机滚动效果
- 停止时使用 `Math.floor(Math.random() * students.length)` 选择最终结果
- 支持"放回"模式：已点过的学生可以再次被抽中

**FR5.5**: 反馈区域 (隐藏直到抽中)
- 显示"本次抽中：XXX"
- 显示两个反馈按钮：点赞、需要改进
- 点击反馈后区域隐藏

**FR5.6**: 路由和导航
- 新增路由 `/rollcall/:classroomId`
- 从班级详情页可以进入点名页面
- 支持通过设置页面进入点名页面

#### 3. Technical Requirements

**数据模型**: 无新增

**数据库操作**: 读取学生列表 (students:getByClassroomId)

**API 设计**:

| IPC 通道 | 方向 | 参数 | 返回值 | 说明 |
|----------|------|------|--------|------|
| `students:getByClassroomId` | Renderer -> Main | `number` (classroomId) | `Student[]` | 获取班级学生 |

**组件设计**:
```
src/renderer/src/pages/
├── RollcallPage.tsx              # 点名主页面
└── RollcallSettingsPage.tsx      # 点名设置页 (F8)

src/renderer/src/components/rollcall/
├── RollcallDisplay.tsx           # 名字滚动显示组件
├── RollcallControls.tsx          # 开始/停止控制按钮
└── RollcallFeedback.tsx          # 反馈按钮组件
```

**RollcallPage 组件接口**:
```typescript
interface RollcallPageProps {
  classroomId: number;
}

interface RollcallState {
  isRolling: boolean;
  currentStudent: Student | null;
  selectedStudent: Student | null;
  showFeedback: boolean;
}
```

**文件新增**:
```
src/renderer/src/pages/RollcallPage.tsx
src/renderer/src/components/rollcall/
src/renderer/src/App.tsx  # 添加路由
```

#### 4. Acceptance Criteria

| ID | 验收条件 | 验证方式 |
|----|----------|----------|
| AC5.1 | 点名页面正确显示班级所有学生姓名 | 对比数据库验证 |
| AC5.2 | 点击开始后名字快速滚动切换 | 视觉检查：名字以80ms间隔切换 |
| AC5.3 | 点击停止后名字停止滚动 | 视觉检查 |
| AC5.4 | 停止后显示反馈区域 | 视觉检查 |
| AC5.5 | 反馈按钮点击后区域隐藏 | 手动测试 |
| AC5.6 | 空班级进入点名页面显示提示 | 手动测试：无学生班级点击点名 |
| AC5.7 | 页面样式与 HTML 原型一致 | 视觉对比 rollcall.html |
| AC5.8 | 编译无错误 | 运行 `npm run typecheck` |

---

### F6: 点名反馈记录

#### 1. Feature Overview

| 字段 | 内容 |
|------|------|
| **Feature 名称** | 点名反馈记录 |
| **用户故事** | 作为教师，我希望每次点名的反馈（点赞/需要改进）都被记录，以便追踪学生的课堂表现。 |
| **功能摘要** | 创建 rollcall_records 表存储点名记录及反馈数据。 |

#### 2. Functional Requirements

**FR6.1**: 数据模型 - rollcall_records 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PRIMARY KEY | 主键 |
| student_id | INTEGER | 学生ID (外键) |
| classroom_id | INTEGER | 班级ID (外键) |
| feedback | TEXT | 反馈类型: 'like', 'angry', null |
| rolled_at | DATETIME | 点名时间 |

**FR6.2**: IPC Handler 注册
- `rollcall:createRecord` - 创建点名记录
- `rollcall:getRecordsByClassroomId` - 获取班级点名记录
- `rollcall:getRecordsByStudentId` - 获取学生点名记录
- `rollcall:updateFeedback` - 更新反馈

**FR6.3**: Service 层
- `RollcallService` 处理业务逻辑
- 创建记录时自动设置 `rolled_at`
- 支持按时间范围查询

**FR6.4**: 前端集成
- 点名停止后记录自动保存（如果自动保存开启）
- 记录保存成功后触发反馈按钮显示

#### 3. Technical Requirements

**数据模型变更**:

```sql
CREATE TABLE rollcall_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  classroom_id INTEGER NOT NULL,
  feedback TEXT CHECK(feedback IN ('like', 'angry') OR feedback IS NULL),
  rolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (classroom_id) REFERENCES classrooms(id)
);

CREATE INDEX idx_rollcall_classroom ON rollcall_records(classroom_id);
CREATE INDEX idx_rollcall_student ON rollcall_records(student_id);
```

**TypeScript 类型**:
```typescript
interface RollcallRecord {
  id: number;
  student_id: number;
  classroom_id: number;
  feedback: 'like' | 'angry' | null;
  rolled_at: string;
}

type RollcallRecordCreationData = {
  student_id: number;
  classroom_id: number;
  feedback?: 'like' | 'angry';
};
```

**API 设计**:

| IPC 通道 | 方向 | 参数 | 返回值 | 说明 |
|----------|------|------|--------|------|
| `rollcall:createRecord` | Renderer -> Main | `RollcallRecordCreationData` | `number` | 创建记录 |
| `rollcall:getRecordsByClassroomId` | Renderer -> Main | `number` (classroomId) | `RollcallRecord[]` | 获取班级记录 |
| `rollcall:getRecordsByStudentId` | Renderer -> Main | `number` (studentId) | `RollcallRecord[]` | 获取学生记录 |
| `rollcall:updateFeedback` | Renderer -> Main | `{id: number, feedback: 'like' \| 'angry'}` | `number` | 更新反馈 |

**文件新增**:
```
src/main/models/RollcallRecord.ts
src/main/repositories/RollcallRecordRepository.ts
src/main/services/RollcallService.ts
src/main/ipc-handlers/rollcallHandler.ts
```

#### 4. Acceptance Criteria

| ID | 验收条件 | 验证方式 |
|----|----------|----------|
| AC6.1 | 点名停止后自动创建记录 | 数据库查询验证 |
| AC6.2 | 点击点赞按钮，feedback 字段更新为 'like' | 数据库查询验证 |
| AC6.3 | 点击需要改进按钮，feedback 字段更新为 'angry' | 数据库查询验证 |
| AC6.4 | 记录包含正确的 student_id 和 classroom_id | 数据库查询验证 |
| AC6.5 | rolled_at 记录正确的时间戳 | 数据库查询验证 |
| AC6.6 | 自动保存开关生效（开启时不显示反馈按钮直接保存） | 手动测试开关 |
| AC6.7 | 编译无错误 | 运行 `npm run typecheck` |

---

### F7: 点名统计面板

#### 1. Feature Overview

| 字段 | 内容 |
|------|------|
| **Feature 名称** | 点名统计面板 |
| **用户故事** | 作为教师，我希望查看点名的统计数据，了解哪些学生表现好、哪些需要关注，以便调整教学策略。 |
| **功能摘要** | 实现点名数据统计页面，包括总点名次数、红榜（点赞最多）、黑榜（需要改进最多）。 |

#### 2. Functional Requirements

**FR7.1**: 统计概览卡片
- 总点名次数 (蓝色卡片)
- 总点赞数 (绿色卡片)
- 需要改进次数 (橙色卡片)

**FR7.2**: 红榜展示
- 按点赞次数降序排列
- 显示排名、学生姓名、学号
- 显示被点次数、点赞数、改进数
- 前三名使用特殊样式（金色主题）

**FR7.3**: 黑榜展示
- 按需要改进次数降序排列
- 显示排名、学生姓名、学号
- 显示被点次数、点赞数、改进数
- 红色/橙色主题

**FR7.4**: 时间筛选
- 支持按月份筛选统计数据
- 默认显示当月数据

**FR7.5**: 数据来源
- 从 rollcall_records 表聚合统计
- 支持按 classroom_id 筛选

#### 3. Technical Requirements

**数据模型**: 使用 F6 创建的 rollcall_records 表

**数据库聚合查询**:
```sql
-- 获取班级点名统计
SELECT
  student_id,
  COUNT(*) as roll_count,
  SUM(CASE WHEN feedback = 'like' THEN 1 ELSE 0 END) as like_count,
  SUM(CASE WHEN feedback = 'angry' THEN 1 ELSE 0 END) as angry_count
FROM rollcall_records
WHERE classroom_id = ?
GROUP BY student_id;
```

**API 设计**:

| IPC 通道 | 方向 | 参数 | 返回值 | 说明 |
|----------|------|------|--------|------|
| `rollcall:getStats` | Renderer -> Main | `{classroomId: number, month?: string}` | `RollcallStats` | 获取班级统计数据 |

**RollcallStats 类型**:
```typescript
interface RollcallStats {
  totalRolls: number;
  totalLikes: number;
  totalAngry: number;
  redList: StudentStat[];  // 点赞最多的学生
  blackList: StudentStat[]; // 需要改进最多的学生
}

interface StudentStat {
  student: Student;
  rollCount: number;
  likeCount: number;
  angryCount: number;
}
```

**组件设计**:
```
src/renderer/src/pages/RollcallStatsPage.tsx  # 统计页面
src/renderer/src/components/rollcall/
├── StatsOverview.tsx          # 概览卡片
├── RedList.tsx                # 红榜组件
└── BlackList.tsx              # 黑榜组件
```

#### 4. Acceptance Criteria

| ID | 验收条件 | 验证方式 |
|----|----------|----------|
| AC7.1 | 统计概览数据正确（总次数、点赞数、改进数） | 对比数据库验证 |
| AC7.2 | 红榜按点赞数降序排列 | 视觉检查 + 数据验证 |
| AC7.3 | 黑榜按需要改进数降序排列 | 视觉检查 + 数据验证 |
| AC7.4 | 月份筛选功能正确 | 手动测试：选择不同月份 |
| AC7.5 | 空数据时显示友好提示 | 手动测试：无数据班级 |
| AC7.6 | 页面样式与 HTML 原型一致 | 视觉对比 rollcall-stats.html |
| AC7.7 | 编译无错误 | 运行 `npm run typecheck` |

---

### F8: 点名设置

#### 1. Feature Overview

| 字段 | 内容 |
|------|------|
| **Feature 名称** | 点名设置 |
| **用户故事** | 作为教师，我希望自定义点名规则（是否放回、滚动速度等），以适应不同的课堂场景。 |
| **功能摘要** | 实现点名设置页面，保存设置到本地存储并在点名时生效。 |

#### 2. Functional Requirements

**FR8.1**: 放回开关
- 开启后：已点过的学生可以再次被抽中
- 关闭后：已点过的学生不再被抽中
- 默认开启

**FR8.2**: 自动保存开关
- 开启后：点名停止时自动保存记录，不显示反馈按钮
- 关闭后：点名停止时显示反馈按钮，手动选择反馈
- 默认开启

**FR8.3**: 滚动速度设置
- 慢速 (150ms)
- 中速 (80ms) - 默认
- 快速 (40ms)

**FR8.4**: 设置持久化
- 设置保存到 electron-store 或 localStorage
- 跨会话保持
- 支持重置为默认值

**FR8.5**: 设置应用
- 点名页面读取设置并应用
- 设置变更即时生效

#### 3. Technical Requirements

**数据模型**: 使用 electron-store 持久化

**Settings 类型**:
```typescript
interface RollcallSettings {
  allowRepeat: boolean;      // 是否放回
  autoSave: boolean;         // 自动保存反馈
  scrollSpeed: 'slow' | 'medium' | 'fast';  // 滚动速度
}

const DEFAULT_SETTINGS: RollcallSettings = {
  allowRepeat: true,
  autoSave: true,
  scrollSpeed: 'medium',
};

const SCROLL_SPEED_MAP = {
  slow: 150,
  medium: 80,
  fast: 40,
};
```

**API 设计**:

| IPC 通道 | 方向 | 参数 | 返回值 | 说明 |
|----------|------|------|--------|------|
| `settings:getRollcallSettings` | Renderer -> Main | - | `RollcallSettings` | 获取设置 |
| `settings:setRollcallSettings` | Renderer -> Main | `RollcallSettings` | `void` | 保存设置 |

**文件新增**:
```
src/main/services/SettingsService.ts      # 设置服务
src/main/ipc-handlers/settingsHandler.ts   # 设置 IPC handler
src/renderer/src/pages/RollcallSettingsPage.tsx
```

#### 4. Acceptance Criteria

| ID | 验收条件 | 验证方式 |
|----|----------|----------|
| AC8.1 | 放回开关正确保存和加载 | 手动测试：切换开关，刷新页面 |
| AC8.2 | 自动保存开关正确保存和加载 | 手动测试：切换开关，测试点名 |
| AC8.3 | 滚动速度变更即时生效 | 手动测试：切换速度，观察滚动频率 |
| AC8.4 | 设置在重启应用后保持 | 重启应用后验证 |
| AC8.5 | 页面样式与 HTML 原型一致 | 视觉对比 rollcall-settings.html |
| AC8.6 | 重置按钮将设置恢复默认值 | 手动测试 |
| AC8.7 | 编译无错误 | 运行 `npm run typecheck` |

---

## 附录 A: 功能需求详细说明

---

### F1: 基础 UI 组件补全 (Input/Label)

#### Feature Overview

| 字段 | 内容 |
|------|------|
| **Feature 名称** | 基础表单组件 Input 和 Label |
| **用户故事** | 作为前端开发者，我需要使用标准化的 Input 和 Label 组件来构建表单界面，以保证 UI 一致性和可维护性。 |
| **功能摘要** | 创建 `@radix-ui/react-label` 和原生 Input 组件的封装，实现与现有 Radix UI 组件风格一致的基础表单组件。 |

#### Functional Requirements

**FR1.1**: Input 组件必须支持以下功能:
- 标准文本输入框
- 通过 `className` 属性支持 Tailwind CSS 自定义样式
- 通过 `id` 属性支持与 Label 的关联
- 支持 `placeholder` 占位符文本
- 支持 `value` 和 `onChange` 受控操作
- 支持 `disabled` 和 `readonly` 状态
- 错误状态样式支持

**FR1.2**: Label 组件必须支持以下功能:
- 通过 `htmlFor` 属性关联 Input
- 支持 `className` 属性自定义样式
- 支持必填标识显示

**FR1.3**: 组件必须与现有 Radix UI 组件保持风格一致:
- 使用相同的 `cn` 工具函数
- 使用相同的 `class-variance-authority` 模式
- 支持暗色模式 (如果未来需要)

#### Technical Requirements

**组件设计**:

```
src/renderer/src/components/ui/
├── input.tsx          # Input 组件
└── label.tsx         # Label 组件
```

**Input 组件接口**:
```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // 继承所有 HTML input 属性
}
```

**Label 组件接口**:
```typescript
import * as LabelPrimitive from "@radix-ui/react-label";

interface LabelProps extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
  // 继承 Radix Label 属性
}
```

**UI 样式**:
```tsx
// Input 组件样式
<input className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm 
  placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 
  focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />

// Label 组件样式  
<label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" />
```

#### Acceptance Criteria

| ID | 验收条件 | 验证方式 |
|----|----------|----------|
| AC1.1 | Input 组件可以在 CreateEditClassDialog 中正常渲染和使用 | 手动测试 |
| AC1.2 | Input 组件支持 focus、hover、disabled 等状态 | 视觉检查 |
| AC1.3 | Label 组件通过 htmlFor 正确关联 Input | 手动测试 |
| AC1.4 | 组件风格与 button.tsx、dialog.tsx 保持一致 | 视觉检查 |
| AC1.5 | TypeScript 类型定义完整，无编译错误 | `npm run typecheck` |

---

### F2: 班级管理 CRUD 完善 (修复 update)

#### Feature Overview

| 字段 | 内容 |
|------|------|
| **Feature 名称** | 班级管理完整 CRUD - 修复更新功能 |
| **用户故事** | 作为教师，我需要编辑班级信息（名称、背景图、主题色），以保持班级信息的准确性。 |
| **功能摘要** | 注册 `classrooms:update` IPC handler，连接 Repository 的 update() 方法与前端编辑界面。 |

#### Functional Requirements

**FR2.1**: IPC Handler 注册
- 在 `src/main/ipc-handlers/classroomHandler.ts` 中注册 `classrooms:update` handler
- handler 接收两个参数: `id: number` 和 `data: ClassroomUpdateData`
- 返回更新影响的行数

**FR2.2**: 前端调用
- `CreateEditClassDialog.tsx` 中的更新逻辑调用 `window.electron.ipcRenderer.invoke('classrooms:update', id, data)`
- 更新成功后调用 `onSave()` 回调刷新列表

**FR2.3**: 数据验证
- id 必须是有效的数字
- data 至少包含一个要更新的字段
- 班级名称不能为空

#### Acceptance Criteria

| ID | 验收条件 | 验证方式 |
|----|----------|----------|
| AC2.1 | 点击班级卡片菜单的"编辑"按钮可打开编辑对话框 | 手动测试 |
| AC2.2 | 修改班级名称后点击保存，数据正确更新 | 手动测试 |
| AC2.3 | 修改主题色后点击保存，颜色正确更新 | 手动测试 |
| AC2.4 | 更新成功后对话框关闭，列表刷新 | 视觉检查 |
| AC2.5 | 更新失败时显示错误提示 | 模拟错误场景 |
| AC2.6 | 编译无错误，IPC 调用正常 | `npm run typecheck` |

---

### F3: 学生管理 CRUD (完整)

#### Feature Overview

| 字段 | 内容 |
|------|------|
| **Feature 名称** | 学生管理完整 CRUD |
| **用户故事** | 作为教师，我需要对学生信息进行增删改查操作，包括添加学生、编辑学生信息、删除学生、批量导入和删除。 |
| **功能摘要** | 完整实现学生的创建、读取、更新、删除 IPC handlers，以及对应的 React 组件和页面。 |

#### Functional Requirements

**FR3.1-FR3.5**: CRUD 操作定义 (详见原始 PRD)

**FR3.6**: 前端 UI 组件

**CreateEditStudentDialog UI 规格**:

```tsx
<Dialog>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>{initialStudentData ? '编辑学生' : '添加学生'}</DialogTitle>
      <DialogDescription>
        {initialStudentData ? '修改学生信息' : '填写学生信息以添加到班级'}
      </DialogDescription>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      {/* 姓名输入 - 网格布局 4 列 */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">姓名</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} 
               className="col-span-3" placeholder="请输入学生姓名" />
      </div>
      {/* 学号输入 */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="studentNumber" className="text-right">学号</Label>
        <Input id="studentNumber" value={studentNumber} onChange={(e) => setStudentNumber(e.target.value)} 
               className="col-span-3" placeholder="请输入学号" />
      </div>
      {/* 头像 URL (可选) */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="avatarUrl" className="text-right">头像</Label>
        <Input id="avatarUrl" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} 
               className="col-span-3" placeholder="头像URL (可选)" />
      </div>
    </div>
    <DialogFooter>
      <Button variant="outline" onClick={onClose} disabled={isSaving}>取消</Button>
      <Button onClick={handleSubmit} disabled={isSaving || !name || !studentNumber}>
        {isSaving ? '保存中...' : '保存'}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**StudentList 操作菜单 UI**:

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" className="h-8 w-8 p-0">
      <MoreHorizontal className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem onClick={() => onEdit(student)}>编辑</DropdownMenuItem>
    <DropdownMenuItem onClick={() => onDelete(student.id)} className="text-red-600">
      删除
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

#### Acceptance Criteria

| ID | 验收条件 | 验证方式 |
|----|----------|----------|
| AC3.1 | 可以成功添加学生到指定班级 | 手动测试 |
| AC3.2 | 可以编辑现有学生信息 | 手动测试 |
| AC3.3 | 可以删除学生，列表正确更新 | 手动测试 |
| AC3.4 | 同一班级内学号重复时显示错误 | 手动测试 |
| AC3.5 | 学生列表按学号排序显示 | 视觉检查 |
| AC3.6 | 批量导入功能正常 | 手动测试 |
| AC3.7 | 批量删除功能正常 | 手动测试 |
| AC3.8 | 编译无错误 | `npm run typecheck` |

---

### F4: 班级学生数量显示 (修复 ClassCard)

#### Feature Overview

| 字段 | 内容 |
|------|------|
| **Feature 名称** | 班级卡片学生数量显示修复 |
| **用户故事** | 作为教师，我希望在班级卡片上看到每个班级实际的学生数量，以便快速了解班级规模。 |
| **功能摘要** | 修复 ClassCard.tsx 中硬编码的 studentCount=0，通过 IPC 获取真实的学生数量。 |

#### Acceptance Criteria

| ID | 验收条件 | 验证方式 |
|----|----------|----------|
| AC4.1 | ClassCard 显示实际学生数量而非 0 | 视觉检查 |
| AC4.2 | 空班级显示 "0名学生" | 视觉检查 |
| AC4.3 | 添加学生后 ClassCard 数量自动更新 | 手动测试 |
| AC4.4 | 删除学生后 ClassCard 数量自动减少 | 手动测试 |
| AC4.5 | 性能良好，无明显加载延迟 | 体验测试 |

---

### F5: 随机点名核心功能

#### Feature Overview

| 字段 | 内容 |
|------|------|
| **Feature 名称** | 随机点名核心功能 |
| **用户故事** | 作为教师，我想使用"欧皇选拔器"随机抽取学生回答问题，使课堂互动更加公平有趣。 |
| **功能摘要** | 实现基于 HTML 原型设计的随机点名功能，包括滚动动画、开始/停止控制、结果展示。 |

#### UI 设计规格

**页面布局**:
```
┌─────────────────────────────────────────────────────┐
│  [← 返回]  欧皇选拔器            [📊 统计] [⚙ 设置] │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │                                             │   │
│  │              张三 (text-8xl)                │   │
│  │              点击开始                        │   │
│  │                                             │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│                   [ ▶ 开始 ]                        │
│                   (w-20 h-20)                      │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  本次抽中：张三                              │   │
│  │  请对本次回答进行反馈                         │   │
│  │                                             │   │
│  │     [ 👍 点赞 ]      [ 😠 需要改进 ]         │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**名字显示卡片 UI**:

```tsx
<div className="card-shadow p-12 mb-8">
  <div className="text-center">
    <div className="text-8xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
      {currentName}
    </div>
    <div className="text-2xl notion-caption">
      {statusText}
    </div>
  </div>
</div>
```

**开始/停止按钮 UI**:

```tsx
<button 
  className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl transition"
  style={{ background: 'var(--text-primary)' }}
  onMouseOver={(e) => e.target.style.background = '#2E2D29'}
  onMouseOut={(e) => e.target.style.background = 'var(--text-primary)'}
>
  <i className={isRolling ? 'fas fa-stop' : 'fas fa-play'} />
</button>
```

**反馈区域 UI** (初始隐藏):

```tsx
<div className="card-shadow p-6">
  <div className="text-center mb-6">
    <h3 className="text-xl font-semibold mb-2">
      本次抽中：<span style={{ color: 'var(--text-primary)' }}>{selectedName}</span>
    </h3>
    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>请对本次回答进行反馈</p>
  </div>
  <div className="flex justify-center space-x-8">
    {/* 点赞按钮 */}
    <button className="flex flex-col items-center space-y-2 px-8 py-4 rounded transition nav-item">
      <div className="w-16 h-16 rounded-full flex items-center justify-center" 
           style={{ background: 'var(--color-green-dark)' }}>
        <i className="fas fa-thumbs-up text-2xl text-white" />
      </div>
      <span className="text-sm font-medium">点赞</span>
    </button>
    {/* 需要改进按钮 */}
    <button className="flex flex-col items-center space-y-2 px-8 py-4 rounded transition nav-item">
      <div className="w-16 h-16 rounded-full flex items-center justify-center" 
           style={{ background: 'var(--color-orange-dark)' }}>
        <i className="fas fa-angry text-2xl text-white" />
      </div>
      <span className="text-sm font-medium">需要改进</span>
    </button>
  </div>
</div>
```

**快捷入口按钮**:

```tsx
<div className="flex items-center space-x-4">
  <button className="px-4 py-2 text-sm rounded transition nav-item">
    <i className="fas fa-chart-bar mr-2" />
    数据统计
  </button>
  <button className="px-4 py-2 text-sm rounded transition nav-item">
    <i className="fas fa-cog mr-2" />
    设置
  </button>
</div>
```

#### Acceptance Criteria

| ID | 验收条件 | 验证方式 |
|----|----------|----------|
| AC5.1 | 点名页面正确显示班级所有学生姓名 | 对比数据库验证 |
| AC5.2 | 点击开始后名字快速滚动切换 | 视觉检查：80ms 间隔 |
| AC5.3 | 点击停止后名字停止滚动 | 视觉检查 |
| AC5.4 | 停止后显示反馈区域 | 视觉检查 |
| AC5.5 | 反馈按钮点击后区域隐藏 | 手动测试 |
| AC5.6 | 空班级进入点名页面显示提示 | 手动测试 |
| AC5.7 | 页面样式与 HTML 原型一致 | 视觉对比 rollcall.html |
| AC5.8 | 编译无错误 | `npm run typecheck` |

---

### F6: 点名反馈记录

#### Feature Overview

| 字段 | 内容 |
|------|------|
| **Feature 名称** | 点名反馈记录 |
| **用户故事** | 作为教师，我希望每次点名的反馈（点赞/需要改进）都被记录，以便追踪学生的课堂表现。 |
| **功能摘要** | 创建 rollcall_records 表存储点名记录及反馈数据。 |

#### Technical Requirements

**数据模型变更**:

```sql
CREATE TABLE rollcall_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  classroom_id INTEGER NOT NULL,
  feedback TEXT CHECK(feedback IN ('like', 'angry') OR feedback IS NULL),
  rolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (classroom_id) REFERENCES classrooms(id)
);

CREATE INDEX idx_rollcall_classroom ON rollcall_records(classroom_id);
CREATE INDEX idx_rollcall_student ON rollcall_records(student_id);
```

#### Acceptance Criteria

| ID | 验收条件 | 验证方式 |
|----|----------|----------|
| AC6.1 | 点名停止后自动创建记录 | 数据库查询验证 |
| AC6.2 | 点击点赞按钮，feedback 更新为 'like' | 数据库查询验证 |
| AC6.3 | 点击需要改进按钮，feedback 更新为 'angry' | 数据库查询验证 |
| AC6.4 | 记录包含正确的 student_id 和 classroom_id | 数据库查询验证 |
| AC6.5 | rolled_at 记录正确的时间戳 | 数据库查询验证 |
| AC6.6 | 自动保存开关生效 | 手动测试 |
| AC6.7 | 编译无错误 | `npm run typecheck` |

---

### F7: 点名统计面板

#### Feature Overview

| 字段 | 内容 |
|------|------|
| **Feature 名称** | 点名统计面板 |
| **用户故事** | 作为教师，我希望查看点名的统计数据，了解哪些学生表现好、哪些需要关注，以便调整教学策略。 |
| **功能摘要** | 实现点名数据统计页面，包括总点名次数、红榜（点赞最多）、黑榜（需要改进最多）。 |

#### UI 设计规格

**统计概览卡片**:

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
  {/* 总点名次数 - 蓝色 */}
  <div className="card-shadow p-6" 
       style={{ background: 'var(--color-blue)', borderColor: 'rgba(35, 131, 226, 0.2)' }}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>总点名次数</p>
        <p className="text-3xl font-bold" style={{ color: 'var(--color-blue-dark)' }}>
          {stats.totalRolls}
        </p>
      </div>
      <div className="w-12 h-12 rounded flex items-center justify-center" 
           style={{ background: 'var(--color-blue-dark)' }}>
        <i className="fas fa-random text-xl text-white" />
      </div>
    </div>
  </div>

  {/* 总点赞数 - 绿色 */}
  <div className="card-shadow p-6" 
       style={{ background: 'var(--color-green)', borderColor: 'rgba(15, 123, 108, 0.2)' }}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>总点赞数</p>
        <p className="text-3xl font-bold" style={{ color: 'var(--color-green-dark)' }}>
          {stats.totalLikes}
        </p>
      </div>
      <div className="w-12 h-12 rounded flex items-center justify-center" 
           style={{ background: 'var(--color-green-dark)' }}>
        <i className="fas fa-thumbs-up text-xl text-white" />
      </div>
    </div>
  </div>

  {/* 总需要改进 - 橙色 */}
  <div className="card-shadow p-6" 
       style={{ background: 'var(--color-orange)', borderColor: 'rgba(217, 115, 13, 0.2)' }}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>需要改进次数</p>
        <p className="text-3xl font-bold" style={{ color: 'var(--color-orange-dark)' }}>
          {stats.totalAngry}
        </p>
      </div>
      <div className="w-12 h-12 rounded flex items-center justify-center" 
           style={{ background: 'var(--color-orange-dark)' }}>
        <i className="fas fa-angry text-xl text-white" />
      </div>
    </div>
  </div>
</div>
```

**红榜 UI** (黄色主题):

```tsx
<div className="card-shadow p-6 mb-6" 
     style={{ background: 'var(--color-yellow)', borderColor: 'rgba(217, 115, 13, 0.2)' }}>
  <div className="flex items-center space-x-2 mb-6">
    <i className="fas fa-trophy text-xl" style={{ color: 'var(--color-yellow-dark)' }} />
    <h2 className="text-xl font-semibold" style={{ color: 'var(--color-yellow-dark)' }}>红榜</h2>
    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>(点赞次数最多)</span>
  </div>
  
  <div className="space-y-3">
    {/* 学生条目 */}
    <div className="flex items-center justify-between p-4 rounded" 
         style={{ background: 'rgba(255, 255, 255, 0.6)', borderLeft: '3px solid var(--color-yellow-dark)' }}>
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" 
             style={{ background: 'var(--color-yellow-dark)' }}>1</div>
        <div>
          <p className="font-bold">{student.name}</p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>学号: {student.student_number}</p>
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <div className="text-center">
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>被点次数</p>
          <p className="font-bold">{rollCount}</p>
        </div>
        <div className="text-center">
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>点赞</p>
          <p className="font-bold" style={{ color: 'var(--color-green-dark)' }}>{likeCount}</p>
        </div>
        <div className="text-center">
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>改进</p>
          <p className="font-bold" style={{ color: 'var(--color-orange-dark)' }}>{angryCount}</p>
        </div>
      </div>
    </div>
  </div>
</div>
```

**黑榜 UI** (红色主题): 与红榜类似，使用 `var(--color-red)` 和 `var(--color-red-dark)`

#### Acceptance Criteria

| ID | 验收条件 | 验证方式 |
|----|----------|----------|
| AC7.1 | 统计概览数据正确 | 对比数据库验证 |
| AC7.2 | 红榜按点赞数降序排列 | 视觉检查 + 数据验证 |
| AC7.3 | 黑榜按需要改进数降序排列 | 视觉检查 + 数据验证 |
| AC7.4 | 月份筛选功能正确 | 手动测试 |
| AC7.5 | 空数据时显示友好提示 | 手动测试 |
| AC7.6 | 页面样式与 HTML 原型一致 | 视觉对比 rollcall-stats.html |
| AC7.7 | 编译无错误 | `npm run typecheck` |

---

### F8: 点名设置

#### Feature Overview

| 字段 | 内容 |
|------|------|
| **Feature 名称** | 点名设置 |
| **用户故事** | 作为教师，我希望自定义点名规则（是否放回、滚动速度等），以适应不同的课堂场景。 |
| **功能摘要** | 实现点名设置页面，保存设置到本地存储并在点名时生效。 |

#### UI 设计规格

**设置页面布局**:

```tsx
<div className="card-shadow p-8">
  <h2 className="text-xl font-semibold mb-6">点名规则</h2>
  
  <div className="space-y-6">
    {/* 放回开关 */}
    <div className="flex items-center justify-between py-4" 
         style={{ borderBottom: '1px solid var(--border-color)' }}>
      <div className="flex-1">
        <h3 className="font-medium mb-1">点过后是否放回</h3>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          开启后，已点过的学生可以再次被抽中
        </p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" defaultChecked />
        <div className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full 
                        peer-checked:after:border-white after:content-[''] after:absolute 
                        after:top-[2px] after:left-[2px] after:bg-white after:border 
                        after:rounded-full after:h-5 after:w-5 after:transition-all" 
             style={{ background: 'var(--border-color)', 
                      'peer-checked:background': 'var(--text-primary)' }} />
      </label>
    </div>

    {/* 自动保存开关 */}
    <div className="flex items-center justify-between py-4" 
         style={{ borderBottom: '1px solid var(--border-color)' }}>
      <div className="flex-1">
        <h3 className="font-medium mb-1">自动保存反馈</h3>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          开启后，点名停止时自动保存记录
        </p>
      </div>
      <ToggleSwitch defaultChecked />
    </div>

    {/* 滚动速度选择 */}
    <div className="flex items-center justify-between py-4">
      <div className="flex-1">
        <h3 className="font-medium mb-1">滚动速度</h3>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          调整名字滚动的速度
        </p>
      </div>
      <select className="px-4 py-2 rounded-lg text-sm border border-input bg-white">
        <option value="slow">慢速</option>
        <option value="medium" selected>中速</option>
        <option value="fast">快速</option>
      </select>
    </div>
  </div>

  <div className="mt-8 flex justify-end space-x-4">
    <button className="px-6 py-2 rounded-lg border border-input hover:bg-accent transition">
      取消
    </button>
    <button className="px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition">
      保存设置
    </button>
  </div>
</div>
```

#### Acceptance Criteria

| ID | 验收条件 | 验证方式 |
|----|----------|----------|
| AC8.1 | 放回开关正确保存和加载 | 手动测试 |
| AC8.2 | 自动保存开关正确保存和加载 | 手动测试 |
| AC8.3 | 滚动速度变更即时生效 | 手动测试 |
| AC8.4 | 设置在重启应用后保持 | 重启应用后验证 |
| AC8.5 | 页面样式与 HTML 原型一致 | 视觉对比 rollcall-settings.html |
| AC8.6 | 重置按钮将设置恢复默认值 | 手动测试 |
| AC8.7 | 编译无错误 | `npm run typecheck` |

---

## 四、技术架构汇总

### 4.1 数据库变更汇总

| 操作 | 表名 | 变更内容 |
|------|------|----------|
| 新增 | rollcall_records | 存储点名记录和反馈 |

### 4.2 IPC Handler 注册汇总

| 通道 | 文件 | 状态 |
|------|------|------|
| classrooms:create | classroomHandler.ts | 已存在 |
| classrooms:getAll | classroomHandler.ts | 已存在 |
| classrooms:findById | classroomHandler.ts | 已存在 |
| classrooms:delete | classroomHandler.ts | 已存在 |
| **classrooms:update** | classroomHandler.ts | **待新增** |
| students:getByClassroomId | studentHandler.ts | 已存在 |
| **students:create** | studentHandler.ts | **待新增** |
| **students:update** | studentHandler.ts | **待新增** |
| **students:delete** | studentHandler.ts | **待新增** |
| **students:getCountByClassroomId** | studentHandler.ts | **待新增** |
| **rollcall:createRecord** | rollcallHandler.ts | **待新增** |
| **rollcall:getRecordsByClassroomId** | rollcallHandler.ts | **待新增** |
| **rollcall:getRecordsByStudentId** | rollcallHandler.ts | **待新增** |
| **rollcall:updateFeedback** | rollcallHandler.ts | **待新增** |
| **rollcall:getStats** | rollcallHandler.ts | **待新增** |
| **settings:getRollcallSettings** | settingsHandler.ts | **待新增** |
| **settings:setRollcallSettings** | settingsHandler.ts | **待新增** |

### 4.3 新增文件清单

| 文件路径 | 说明 |
|----------|------|
| `src/renderer/src/components/ui/input.tsx` | Input 组件 |
| `src/renderer/src/components/ui/label.tsx` | Label 组件 |
| `src/main/models/RollcallRecord.ts` | 点名记录模型 |
| `src/main/repositories/RollcallRecordRepository.ts` | 点名记录仓库 |
| `src/main/services/RollcallService.ts` | 点名服务 |
| `src/main/services/SettingsService.ts` | 设置服务 |
| `src/main/ipc-handlers/rollcallHandler.ts` | 点名 IPC handler |
| `src/main/ipc-handlers/settingsHandler.ts` | 设置 IPC handler |
| `src/renderer/src/pages/RollcallPage.tsx` | 点名主页面 |
| `src/renderer/src/pages/RollcallSettingsPage.tsx` | 点名设置页面 |
| `src/renderer/src/pages/RollcallStatsPage.tsx` | 点名统计页面 |
| `src/renderer/src/components/rollcall/*` | 点名相关组件 |
| `src/renderer/src/components/student/*` | 学生管理组件 |

### 4.4 路由变更

| 路径 | 页面 | 状态 |
|------|------|------|
| `/rollcall/:classroomId` | RollcallPage | 待新增 |
| `/rollcall/:classroomId/settings` | RollcallSettingsPage | 待新增 |
| `/rollcall/:classroomId/stats` | RollcallStatsPage | 待新增 |

---

## 五、测试策略

### 5.1 单元测试
- Repository 层 CRUD 方法
- Service 层业务逻辑
- 工具函数

### 5.2 集成测试
- IPC handler 与 Repository 的连接
- 前端组件与 IPC 的集成

### 5.3 E2E 测试
- 完整的点名流程
- 设置保存和加载
- 统计数据的准确性

### 5.4 手动测试清单
- [ ] F1: Input/Label 组件渲染和交互
- [ ] F2: 班级编辑保存
- [ ] F3: 学生增删改查
- [ ] F4: 班级学生数量正确显示
- [ ] F5: 随机点名滚动和停止
- [ ] F6: 点名反馈记录保存
- [ ] F7: 统计数据正确聚合
- [ ] F8: 设置持久化

---

## 六、风险评估

| 风险 | 影响 | 概率 | 缓解措施 |
|------|------|------|----------|
| 放回模式实现复杂 | 中 | 中 | 单独维护已点名学生列表 |
| 滚动性能问题 | 低 | 低 | 使用 requestAnimationFrame |
| 数据迁移问题 | 高 | 低 | 提供数据库迁移脚本 |
| UI 原型与 React 实现差异 | 中 | 中 | 严格按照原型实现 |

---

## 七、里程碑

| 阶段 | 交付内容 | 优先级 |
|------|----------|--------|
| M1 | F1 + F2 (UI组件 + 班级更新) | P0 |
| M2 | F3 + F4 (学生CRUD + 数量显示) | P0 |
| M3 | F5 (随机点名核心) | P1 |
| M4 | F6 + F7 + F8 (反馈 + 统计 + 设置) | P2 |

---

*文档结束*
