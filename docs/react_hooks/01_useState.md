# useState Hook

## 概述

`useState` 是 React 最基础的 Hook，用于在函数组件中添加状态管理能力。

## 语法

```tsx
const [state, setState] = useState(initialValue)
```

## 在项目中的使用案例

### 案例1：管理编辑器内容状态

```tsx
// App.tsx - 用于调试显示
const [currentContent, setCurrentContent] = useState(INITIAL_CONTENT);

const handleContentChange = (content: string) => {
  setCurrentContent(content); // 更新状态
};
```

**为什么使用：** 需要在父组件中跟踪编辑器的实时内容，用于调试显示。

### 案例2：Block 组件中的内容管理（已废弃）

```tsx
// 最初的错误实现
const [content, setContent] = useState(initialContent);

const handleInput = (event) => {
  setContent(event.currentTarget.textContent); // ❌ 导致光标跳转
};

return (
  <div contentEditable onInput={handleInput}>
    {content} {/* ❌ 触发 React reconciler */}
  </div>
);
```

**遇到的问题：**
- 每次输入都会触发状态更新
- 状态更新导致组件重新渲染
- React reconciler 重新创建 DOM 内容
- 光标位置丢失，跳转到文本开头

**解决方案：** 移除 Block 组件内部的状态管理，让 `contentEditable` 自己管理内容。

## 关键学习点

1. **状态更新触发重新渲染** - 每次 `setState` 都会导致组件重新渲染
2. **React reconciler 机制** - React 会比较新旧虚拟 DOM，更新变化的部分
3. **contentEditable 的特殊性** - 需要保持 DOM 稳定性，避免光标位置丢失
4. **设计原则** - 不是所有数据都需要用状态管理，有时候让 DOM 自己处理更好

## 最佳实践

- ✅ 用于真正需要响应式更新的 UI 状态
- ✅ 用于父子组件间的数据同步
- ❌ 避免在 contentEditable 中直接绑定内容状态
- ❌ 避免不必要的状态，简单的数据可以用 useRef