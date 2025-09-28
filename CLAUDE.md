# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Reditor is a Notion-like editor built with React and Tiptap. The project is in active development, transitioning from basic TipTap integration to a custom block-based editor similar to Notion's interface.

## 🏗️ Current Development Status

- ✅ **React + TypeScript 基础**
  - 熟悉 React hooks 和组件化思想
  - 掌握 TypeScript 类型系统
  - 理解状态管理和事件处理

- ✅ **TipTap 基础应用**
  - 完成 TipTap + ProseMirror 基础集成
  - 实现基础富文本编辑功能
  - 掌握 TipTap 扩展系统基础概念
  - 代码结构优化（类型分离、工具函数）

- 🚧 **当前目标：深入 ProseMirror 核心**
  - **架构选择：单 Editor + 自定义 Node 方案**
  - 理解 ProseMirror Document Model
  - 学习自定义 Node 和 NodeView
  - 实现 Notion 风格的块级编辑器

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

## 📋 开发计划 (5阶段深度路线图)

> **核心架构：单 Editor + 自定义 Node 方案**
> 这是 Notion、Craft 等专业编辑器的真实架构，更有挑战性但学习价值更高

### 阶段1：ProseMirror Document Model 深度理解 🚧

**目标：** 理解 ProseMirror 的核心概念和文档模型
**核心学习：** Schema、Node、Fragment、Position

- 学习 ProseMirror Document Model
- 理解 Schema 定义和节点类型
- 掌握 Position、Selection、Transaction 概念
- 实验基础的自定义 Node 定义
- 为块级架构设计 Schema 结构

**技术深度：**
- ProseMirror 核心概念
- 文档结构和节点树
- 位置系统和选择机制

### 阶段2：自定义 Block Node 实现

**目标：** 创建第一个自定义块节点
**实现：** 可编辑的段落块和标题块

- 定义 BlockNode 的基础 Schema
- 实现 ParagraphBlock 和 HeadingBlock Node
- 学习 NodeSpec 和 toDOM/parseDOM
- 处理块的序列化和反序列化
- 实现基础的块内容编辑

**技术深度：**
- 自定义 Node 定义
- DOM 映射和转换
- 内容模型设计

### 阶段3：Block NodeView 和交互系统

**目标：** 使用 NodeView 实现复杂的块交互
**实现：** 块选择、焦点管理、键盘导航

- 学习 NodeView 概念和生命周期
- 实现块的可视化边界和选择状态
- 添加块工具栏和操作按钮
- 实现 Enter/Backspace 的块级行为
- 处理块间的导航和焦点切换

**技术深度：**
- NodeView 高级用法
- 事件处理和命令系统
- 复杂交互逻辑

### 阶段4：斜杠命令和块类型转换

**目标：** 实现动态的块类型系统
**实现：** /h1, /h2, /list 等命令和块转换

- 实现输入处理和命令识别
- 创建命令菜单和自动完成
- 实现块类型的动态转换
- 添加更多块类型（列表、引用等）
- 处理复杂的内容迁移逻辑

**技术深度：**
- 命令系统设计
- 动态 Schema 变换
- 内容转换算法

### 阶段5：高级功能和性能优化

**目标：** 完善编辑器到生产级别
**实现：** 拖拽、协作、持久化

- 实现块的拖拽重排（基于 ProseMirror Transform）
- 添加撤销/重做支持
- 实现数据持久化和序列化
- 性能优化和内存管理
- 支持协作编辑（可选）

**技术深度：**
- Transform 和 Transaction 高级用法
- 性能分析和优化
- 分布式状态同步

## 💻 技术栈与学习路径

**核心技术：**
- **ProseMirror**（核心编辑器引擎）
- **TipTap**（ProseMirror 的 React 封装）
- **React 19 + TypeScript**（UI 框架）
- **Vite**（开发工具）

**重点学习领域：**
1. **ProseMirror 核心概念**
   - Document Model（文档模型）
   - Schema（模式定义）
   - Node & NodeSpec（节点规范）
   - Transform & Transaction（变换和事务）

2. **TipTap 高级特性**
   - 自定义 Extension 开发
   - NodeView 实现
   - Command 系统
   - Plugin 生态

3. **架构设计**
   - 单编辑器 + 自定义节点架构
   - 块级文档结构设计
   - 性能优化策略

**学习资源优先级：**
1. ProseMirror 官方文档（核心概念）
2. TipTap 自定义扩展指南
3. Notion/Craft 等产品的技术分析

## 🚀 开发策略

**学习方法：**
- **理论先行**：每个阶段先深入理解概念，再动手编码
- **实验驱动**：通过小实验验证理解，逐步构建复杂功能
- **文档并重**：阅读 ProseMirror 和 TipTap 官方文档
- **源码学习**：研究优秀开源项目的实现（BlockNote、Novel 等）

**代码原则：**
- 类型安全优先（充分利用 TypeScript）
- 模块化设计（分离关注点）
- 性能考虑（避免不必要的重渲染）
- 可测试性（便于单元测试和调试）

**挑战预期：**
- ProseMirror 学习曲线陡峭，需要耐心
- 自定义 Node 和 NodeView 实现复杂
- 调试工具相对有限，需要掌握调试技巧

