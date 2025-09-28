# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Reditor is a Notion-like editor built with React and Tiptap. The project is in active development, transitioning from basic TipTap integration to a custom block-based editor similar to Notion's interface.

## 🏗️ Current Development Status

- ✅ **React 基础掌握**
  - 熟悉 React hooks (useState, useEffect, useCallback, useRef 等)
  - 理解组件化思想和状态管理
  - 掌握 TypeScript 与 React 的集成

- ✅ **TipTap 基础集成**
  - 完成 TipTap + ProseMirror 基础集成
  - 实现基础富文本编辑功能（加粗、斜体、标题等）
  - 集成实时状态追踪系统
  - 代码结构优化（类型定义、工具函数分离）

- 🚧 **当前阶段：向 Notion 风格转型**
  - 准备实现块级编辑器架构
  - 规划多块管理和交互系统

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
- `src/App.tsx` - Main app component with layout
- `src/components/SimpleEditor.tsx` - TipTap editor with real-time status tracking
- `src/components/index.ts` - Component exports
- `src/types/editor.ts` - TypeScript interface definitions
- `src/utils/editor.ts` - Editor utility functions

### Current Editor Features

- TipTap integration with StarterKit extensions
- Real-time selection state tracking
- Toolbar with format buttons (Bold, Italic, Headings, Lists)
- HTML output display with formatting toggle
- Clean TypeScript architecture

### Development Notes

- Project uses ES modules (`"type": "module"` in package.json)
- TypeScript configuration uses composite project structure with separate app and node configs
- React 19 features are available (StrictMode, createRoot API)

## 📋 开发计划 (6阶段路线图)

### 阶段1：多块架构设计 🚧

**目标：** 设计 Notion 风格的块级编辑器架构
**实现：** 从单编辑器转向多块系统

- 创建 Block 组件（包装 TipTap 实例）
- 设计块数据结构和状态管理
- 实现块的添加、删除、焦点管理
- 保持 TipTap 的富文本功能

### 阶段2：块类型系统

**目标：** 实现不同类型的块
**实现：** 支持多种块类型（文本、标题、列表等）

- 扩展块数据结构支持类型字段
- 创建不同类型的块组件
- 实现块类型切换逻辑
- 每个块保持独立的 TipTap 实例

### 阶段3：斜杠命令系统

**目标：** 实现 Notion 风格的斜杠命令
**实现：** /h1, /h2, /list 等快速命令

- 监听斜杠输入和命令匹配
- 创建命令菜单组件
- 实现命令执行和块类型转换
- 添加键盘导航支持

### 阶段4：块交互和选择

**目标：** 完善块的用户交互体验
**实现：** 块选择、拖拽手柄、键盘导航

- 实现块的选择状态管理
- 添加拖拽手柄和视觉反馈
- 实现键盘快捷键（Enter 新建块、Backspace 删除等）
- 优化块间的焦点切换

### 阶段5：拖拽排序

**目标：** 实现块的拖拽重排功能
**实现：** 拖拽改变块顺序

- 集成拖拽库（dnd-kit 推荐）
- 实现拖拽排序逻辑
- 处理拖拽过程中的视觉反馈
- 保持拖拽时的性能优化

### 阶段6：数据持久化和高级功能

**目标：** 完善编辑器的实用性
**实现：** 保存加载、撤销重做、高级块类型

- 实现文档的保存和加载
- 添加撤销/重做功能
- 实现高级块类型（代码块、引用、分割线等）
- 添加导入导出功能

## 💻 技术栈

**核心框架：**
- React 19 + TypeScript
- Vite（开发和构建工具）

**富文本编辑：**
- TipTap + ProseMirror（已集成）
- StarterKit 扩展（基础功能）

**即将集成：**
- dnd-kit（拖拽排序，阶段5）
- 自定义 TipTap 扩展（斜杠命令等）

**架构特点：**
- 多个独立的 TipTap 实例（每块一个）
- 块级组件化设计
- TypeScript 类型安全

## 🚀 开发建议

- 每个阶段完成后进行代码审查和测试
- 保持组件模块化和可复用性
- 注重用户体验和交互细节

