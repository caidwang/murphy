# Murphy 项目 Wiki

## 项目概述

**Murphy** 是一款基于 Electron、React 和 TypeScript 构建的桌面应用程序，用于课堂和学生管理。教师可以管理班级（班级）和学生，提供创建、编辑、删除教室和查看班级内学生信息的功能。

---

## 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 框架 | Electron | ^39.2.6 |
| UI 库 | React | ^19.2.1 |
| 语言 | TypeScript | ^5.9.3 |
| 构建工具 | electron-vite | ^5.0.0 |
| 打包工具 | Vite | ^7.2.6 |
| 数据库 | better-sqlite3 | ^12.5.0 |
| CSS 框架 | Tailwind CSS | ^3.4.1 |
| UI 组件 | Radix UI | - |
| 图标 | lucide-react | ^0.562.0 |
| 代码检查 | ESLint 9 | ^9.39.1 |
| 代码格式化 | Prettier | ^3.7.4 |
| 打包工具 | electron-builder | ^26.0.12 |

---

## 项目架构

### Electron 进程模型

```
┌─────────────────────────────────────────────────────────┐
│                    Main Process (Node.js)              │
│  - 窗口管理                                               │
│  - 原生 OS 交互                                          │
│  - IPC Handler 注册                                      │
│  - 业务逻辑 & 数据库访问                                   │
└─────────────────────────────────────────────────────────┘
                           │ IPC
┌─────────────────────────────────────────────────────────┐
│                   Preload Script                        │
│  - 通过 contextBridge 安全暴露 API                       │
└─────────────────────────────────────────────────────────┘
                           │ IPC
┌─────────────────────────────────────────────────────────┐
│                Renderer Process (React)                 │
│  - UI 渲染                                               │
│  - 用户交互处理                                          │
└─────────────────────────────────────────────────────────┘
```

### 目录结构

```
murphy/
├── src/
│   ├── main/                    # 主进程 (Node.js)
│   │   ├── index.ts             # 入口点，窗口创建
│   │   ├── models/              # 数据模型
│   │   │   ├── Classroom.ts
│   │   │   └── Student.ts
│   │   ├── repositories/        # 数据库访问层 (CRUD)
│   │   │   ├── database.ts      # SQLite 初始化
│   │   │   ├── ClassroomRepository.ts
│   │   │   └── StudentRepository.ts
│   │   ├── services/            # 业务逻辑层
│   │   │   ├── ClassroomService.ts
│   │   │   └── StudentService.ts
│   │   └── ipc-handlers/        # IPC 通信
│   │       ├── classroomHandler.ts
│   │       └── studentHandler.ts
│   ├── preload/                  # 预加载脚本 (桥接)
│   │   └── index.ts
│   └── renderer/                # React 前端
│       └── src/
│           ├── App.tsx           # 主应用组件
│           ├── pages/            # 路由页面
│           ├── components/       # React 组件
│           └── assets/           # CSS 和图片
├── design/                       # HTML 原型 (参考设计)
├── resources/                    # 应用图标
├── build/                        # 构建资源
├── electron.vite.config.ts       # electron-vite 配置
├── electron-builder.yml          # electron-builder 配置
├── tailwind.config.js            # Tailwind CSS 配置
└── package.json
```

---

## 数据库架构

### 表结构

**classrooms (班级表)**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PRIMARY KEY | 主键 |
| name | TEXT NOT NULL | 班级名称 |
| background_image_path | TEXT | 背景图片路径 |
| theme_color | TEXT | 主题颜色 |
| created_at | DATETIME | 创建时间 |

**students (学生表)**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PRIMARY KEY | 主键 |
| name | TEXT NOT NULL | 学生姓名 |
| student_number | TEXT NOT NULL | 学号 |
| avatar_path | TEXT | 头像路径 |
| classroom_id | INTEGER | 所属班级 (外键) |
| created_at | DATETIME | 创建时间 |

> 约束: `UNIQUE(classroom_id, student_number)` - 同一班级内学号唯一

---

## IPC 通信

| 通道 | 方向 | 用途 |
|------|------|------|
| `classrooms:create` | Renderer -> Main | 创建班级 |
| `classrooms:getAll` | Renderer -> Main | 获取所有班级 |
| `classrooms:findById` | Renderer -> Main | 根据 ID 获取班级 |
| `classrooms:delete` | Renderer -> Main | 删除班级 |
| `students:getByClassroomId` | Renderer -> Main | 获取班级学生 |

---

## 功能模块

### 1. 班级管理

- 创建新班级（名称、背景图片、主题颜色）
- 网格布局展示所有班级
- 编辑班级信息
- 删除班级（级联删除学生）
- 导航到班级详情页

### 2. 学生管理

- 查看班级内学生（表格展示）
- 添加学生到班级
- 编辑学生信息
- 删除学生
- 批量插入和删除

### 3. 用户界面

- Notion 风格设计
- 侧边栏导航
- 卡片式班级展示（可自定义主题）
- 响应式网格布局
- 模态对话框用于创建/编辑表单

---

## 开发命令

```bash
npm run dev          # 启动开发（热重载）
npm run build        # 生产构建
npm run build:mac    # 构建 macOS 版本
npm run build:win    # 构建 Windows 版本
npm run build:linux  # 构建 Linux 版本
npm run lint         # 运行 ESLint
npm run format       # 运行 Prettier
npm run typecheck    # 运行 TypeScript 类型检查
```

---

## 注意事项

1. **缺失 UI 组件**: `CreateEditClassDialog` 组件引入了 `Input` 和 `Label` 组件，但这些组件在代码库中不存在（位于 `src/renderer/src/components/ui/`）。

2. **设计参考**: `design/` 目录包含 HTML 原型，作为 React 实现的参考。

3. **部分功能待完善**: 部分学生管理功能（添加、编辑、批量操作）的 IPC 处理器未完全实现（`studentHandler.ts` 只有 `getByClassroomId`）。

4. **语言**: UI 文本主要使用简体中文（班级 = classroom, 学生 = student 等）。
