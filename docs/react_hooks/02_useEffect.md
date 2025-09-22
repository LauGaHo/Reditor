# useEffect Hook

## 概述

`useEffect` 用于处理副作用（side effects），如数据获取、订阅、手动修改 DOM 等。

## 语法

```tsx
useEffect(() => {
  // 副作用逻辑
  return () => {
    // 清理函数（可选）
  }
}, [dependencies]) // 依赖数组
```

## 在项目中的使用案例

### 案例1：监听内容变化并通知父组件（已废弃）

```tsx
// Block.tsx - 最初的实现
const [content, setContent] = useState(initialContent);

useEffect(() => {
  // 当内容发生变化时，通知父组件
  if (onContentChange) {
    onContentChange(content);
  }
}, [content, onContentChange]); // 依赖 content 和 onContentChange

const handleInput = (event) => {
  setContent(event.currentTarget.textContent); // 触发 useEffect
};
```

**为什么使用：** 希望在内容状态变化时自动通知父组件。

**遇到的问题：**
1. **额外的渲染周期** - 输入 → 状态更新 → useEffect 执行 → 可能再次更新
2. **依赖数组复杂性** - `onContentChange` 函数引用不稳定导致额外执行
3. **性能损耗** - 每次输入都要经过完整的 React 更新周期

**解决方案：** 直接在事件处理函数中调用回调，避免使用 useEffect。

```tsx
// 优化后的实现
const handleInput = (event) => {
  const newContent = event.currentTarget.textContent;

  // 直接调用回调，不经过状态和 useEffect
  if (onContentChange) {
    onContentChange(newContent);
  }
};
```

## useEffect 的执行时机

```tsx
useEffect(() => {
  console.log('组件渲染完成后执行');
}, []); // 只在首次渲染后执行

useEffect(() => {
  console.log('每次渲染后都执行');
}); // 没有依赖数组

useEffect(() => {
  console.log('content 变化后执行');
}, [content]); // content 变化时执行
```

## 关键学习点

1. **副作用的概念** - useEffect 用于处理组件渲染之外的操作
2. **依赖数组的重要性** - 控制 useEffect 的执行时机
3. **性能考虑** - 过度使用 useEffect 可能影响性能
4. **替代方案** - 简单的事件响应可以直接在事件处理函数中处理

## 适用场景

- ✅ 数据获取（API 调用）
- ✅ 设置订阅
- ✅ 手动修改 DOM
- ✅ 定时器设置
- ❌ 简单的事件响应（用事件处理函数更好）
- ❌ 同步的状态计算（用 useMemo 更好）

## 最佳实践

- 明确依赖数组，避免无限循环
- 需要清理的副作用要返回清理函数
- 考虑是否真的需要 useEffect，有时直接处理更简单