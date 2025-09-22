# useRef Hook

## 概述

`useRef` 返回一个可变的 ref 对象，其 `.current` 属性被初始化为传入的参数。ref 对象在组件的整个生命周期内保持不变。

## 语法

```tsx
const ref = useRef<T>(initialValue)
```

## 在项目中的使用案例

### 案例1：引用 DOM 元素

```tsx
// Block.tsx - 正确的实现
const divRef = useRef<HTMLDivElement>(null);

return (
  <div
    ref={divRef}  // 引用 DOM 元素
    contentEditable
    suppressContentEditableWarning
    onInput={handleInput}
    // ...
  />
);
```

**为什么使用：**
- 需要直接访问 DOM 元素
- 为将来可能的 DOM 操作做准备（如焦点管理）

### 案例2：错误的尝试 - 用 ref 存储内容（已废弃）

```tsx
// 错误的实现
const inputEleRef = useRef<HTMLDivElement>(null);

const handleInput = (event) => {
  // ❌ 错误：试图用 ref 存储字符串内容
  inputEleRef.current = newContent; // 类型错误！
};
```

**问题分析：**
- `useRef<HTMLDivElement>` 的 `current` 应该是 DOM 元素，不是字符串
- 混淆了 ref 的两种用途：DOM 引用 vs 数据存储

### 案例3：正确使用 ref 存储数据（替代方案）

```tsx
// 如果需要存储数据而不触发重新渲染
const contentRef = useRef<string>('');

const handleInput = (event) => {
  const newContent = event.currentTarget.textContent || '';
  contentRef.current = newContent; // ✅ 正确：存储数据

  // 通知父组件
  if (onContentChange) {
    onContentChange(newContent);
  }
};
```

## useRef vs useState

| 特性 | useRef | useState |
|------|--------|----------|
| 触发重新渲染 | ❌ 否 | ✅ 是 |
| 数据持久性 | ✅ 组件生命周期内保持 | ✅ 组件生命周期内保持 |
| 用途 | DOM 引用、缓存数据 | 响应式状态 |
| 更新方式 | 直接赋值 | 调用 setter 函数 |

## 两种主要用途

### 1. DOM 引用
```tsx
const inputRef = useRef<HTMLInputElement>(null);

useEffect(() => {
  if (inputRef.current) {
    inputRef.current.focus(); // 直接操作 DOM
  }
}, []);
```

### 2. 数据存储（不触发重新渲染）
```tsx
const timerRef = useRef<number>();
const countRef = useRef(0);

const startTimer = () => {
  timerRef.current = setInterval(() => {
    countRef.current += 1; // 不会触发重新渲染
    console.log(countRef.current);
  }, 1000);
};
```

## 在我们项目中的学习点

1. **类型安全** - `useRef<HTMLDivElement>` 明确指定 ref 的类型
2. **用途明确** - DOM 引用用 DOM 类型，数据存储用数据类型
3. **性能优化** - 不需要响应式的数据用 ref 存储，避免不必要的重新渲染
4. **设计选择** - 在我们的 contentEditable 场景中，最终选择了最简单的方案

## 最佳实践

- ✅ 用于需要直接访问的 DOM 元素
- ✅ 用于存储不需要触发重新渲染的数据
- ✅ 用于存储定时器 ID、订阅等
- ❌ 不要用 ref 存储需要响应式更新的 UI 状态
- ❌ 不要混淆 DOM 引用和数据存储的类型定义