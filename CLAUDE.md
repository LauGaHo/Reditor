# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Reditor is a Notion-like editor built with React and Tiptap. The project is in active development, transitioning from basic TipTap integration to a custom block-based editor similar to Notion's interface.

## 🏗️ Current Development Status

- ✅ **阶段1 已完成：基础块级编辑器**
  - 实现了单个可编辑文本块
  - 解决了 contentEditable 光标跳转问题
  - 学习了 React 状态管理和组件化

- ✅ **阶段2 已完成：多块管理**
  - 实现了多个独立文本块管理（使用数组和 map 渲染）
  - 支持 Enter 键创建新块并自动聚焦
  - 支持 Backspace 删除空块
  - 掌握了 React 列表渲染和 key 概念
  - 学会了性能优化：React.memo + useCallback + useRef 懒加载
  - 掌握了 useImperativeHandle 组件接口设计
  - 理解了 React 状态更新时机和批量处理机制
  - 学会了自定义 Hook 的抽象和复用

## Development Commands

```bash
# Development server
npm run dev

# Build project
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Architecture

### Tech Stack

- **React 19** with TypeScript
- **Vite** for build tooling and development server
- **TipTap** for rich text editing functionality
- **ESLint** for code linting

### Current Structure

- `src/main.tsx` - Application entry point with React 19 createRoot
- `src/App.tsx` - Main app component, renders the Editor with basic layout
- `src/components/Editor.tsx` - TipTap editor implementation using useEditor hook and EditorContent
- `src/components/index.ts` - Component exports

### Editor Implementation

The current editor uses TipTap's React integration:

- `useEditor` hook creates editor instance with StarterKit extensions
- `EditorContent` component handles DOM element creation and editor mounting
- No manual DOM element specification required (TipTap handles this automatically)

### Development Notes

- Project uses ES modules (`"type": "module"` in package.json)
- TypeScript configuration uses composite project structure with separate app and node configs
- React 19 features are available (StrictMode, createRoot API)

## 📋 开发计划 (8阶段路线图)

### 阶段1：基础块级编辑器

**目标：** 理解 React 组件化思想
**实现：** 单个可编辑文本块

- 创建 Block 组件
- 实现基础的文本输入和编辑
- 学习 React 状态管理 (useState)

### 阶段2：多块管理 ✅

**目标：** 理解 React 列表渲染和 key 概念
**实现：** 支持多个独立文本块

- ✅ 使用数组管理多个块
- ✅ 实现添加/删除块功能
- ✅ 学习 React 的 map 渲染和 key 属性
- ✅ 深入学习性能优化和 Hook 协同
- ✅ 掌握状态更新时机控制

### 阶段3：块类型系统（原生实现）

**目标：** 理解 React 条件渲染和组件复用
**实现：** 不同类型的块（标题、段落、列表等）- 使用原生 contentEditable

- 扩展 BlockData 数据结构支持类型字段
- 实现组件工厂模式或条件渲染
- 创建 HeadingBlock、ParagraphBlock、ListBlock 等组件
- 学习组件的 props 传递和复用模式
- 保持现有性能优化（memo + 引用稳定性）

### 阶段4：块选择和类型切换（原生实现）

**目标：** 理解 React 事件处理、状态管理和用户交互
**实现：** 块选择系统和类型切换功能

- 实现块的点击选择和焦点状态管理
- 添加类型切换 UI（工具栏或快捷键）
- 实现类型转换时的内容保持逻辑
- 学习复杂用户交互的状态设计
- 深入学习事件处理和 DOM 操作

### 阶段5：集成 TipTap + 斜杠命令

**目标：** 理解第三方库集成和自定义 Hook
**实现：** 升级到 TipTap + 实现斜杠命令系统

- 将原生 contentEditable 升级为 TipTap
- 保持现有的块级架构
- 实现 /h1, /h2 等斜杠命令
- 学习第三方库的 React 集成模式
- 创建自定义 Hook 封装命令逻辑

### 阶段6：拖拽排序

**目标：** 理解 React 与拖拽库集成
**实现：** 块的拖拽重新排序

- 集成 dnd-kit 或 react-beautiful-dnd
- 实现拖拽排序逻辑，保持 ref 管理
- 学习复杂第三方库集成
- 处理拖拽过程中的性能优化

### 阶段7：数据持久化和状态管理

**目标：** 理解 React 数据流和状态提升
**实现：** 内容保存和加载

- 设计完整的数据结构
- 实现本地存储（localStorage/IndexedDB）
- 学习状态提升和 Context
- 添加自动保存功能

### 阶段8：高级功能和组件组合

**目标：** 综合运用所学知识
**实现：** 复杂块类型和高级交互

- 实现复杂块类型（表格、图片、代码块等）
- 添加块嵌套功能
- 实现撤销/重做
- 学习组件组合模式和高级状态管理

## 💻 技术栈

**核心框架：**
- React 19+ with TypeScript
- Vite for build tooling and development

**开发策略：**
- 阶段 1-4: 原生实现（contentEditable + React 状态管理）
- 阶段 5+: 集成第三方库（TipTap、拖拽库等）

**第三方库（后续阶段）：**
- TipTap（阶段5+）：富文本编辑核心
- dnd-kit 或 react-beautiful-dnd（阶段6）：拖拽排序
- CSS-in-JS 或 Tailwind CSS（可选）：样式管理

## 🚀 开发建议

- 每个阶段完成后进行代码审查和测试
- 保持组件模块化和可复用性
- 注重用户体验和交互细节

