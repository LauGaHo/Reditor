# useState Hook

## 概述

`useState` 是 React 最基础的 Hook，用于在函数组件中添加状态管理能力。

## 语法

```tsx
const [state, setState] = useState(initialValue);
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

### 案例3：多块编辑器状态管理

```tsx
// MultiBlockEditor.tsx - 管理多个块的数组状态
const [blocks, setBlocks] = useState<BlockData[]>(initialBlocks);

const handleContentChange = useCallback((blockId: string, content: string) => {
  setBlocks((prevBlocks) => {
    const newBlocks = prevBlocks.map((block) => {
      if (block.id === blockId) {
        block.content = content; // ✅ 直接修改，保持对象引用
      }
      return block;
    });
    return newBlocks;
  });
}, []);
```

**关键优化：**

- 使用函数式更新 `setBlocks(prevBlocks => ...)` 获取最新状态
- 直接修改对象属性而不是创建新对象，保持引用稳定性
- 配合 `memo` 实现精确的重新渲染控制

## 对象引用稳定性原理

在多块编辑器中，我们学到了一个重要概念：**保持对象引用稳定性**

```tsx
// ❌ 错误：每次都创建新对象，破坏引用相等性
block.id === blockId ? { ...block, content } : block;

// ✅ 正确：直接修改属性，保持对象引用
if (block.id === blockId) {
  block.content = content; // 保持 block 对象引用不变
  return block;
}
```

**为什么重要：**

- React.memo 使用浅比较检查 props 是否变化
- 对象引用相同时，memo 会跳过重新渲染
- 这是 React 性能优化的核心机制

## React 的内置优化机制：引用相等性检查

这是一个非常重要但容易被忽略的机制！

### 核心原理

React 在 `setState` 时会进行 **引用相等性检查**：

```tsx
const [blocks, setBlocks] = useState(initialBlocks);

// 情况1: 返回相同引用
setBlocks(prevBlocks => {
  targetBlock.content = newContent; // 直接修改属性
  return prevBlocks; // ✅ 相同引用
});
// 结果: Object.is(prevBlocks, prevBlocks) === true
// React 行为: 跳过重新渲染和 useEffect 执行！

// 情况2: 返回新引用
setBlocks(prevBlocks => {
  return [...prevBlocks, newBlock]; // ❌ 新数组
});
// 结果: Object.is(newArray, prevBlocks) === false
// React 行为: 触发重新渲染和 useEffect
```

### 实际影响

```tsx
// 用户输入时
const handleContentChange = (blockId, content) => {
  setBlocks(prevBlocks => {
    targetBlock.content = content;
    return prevBlocks; // 相同引用
  });

  // 这时会发生什么？
  // 1. React 检查: Object.is(prevBlocks, prevBlocks) === true
  // 2. React 判断: "状态没有变化"
  // 3. React 行为: 跳过重新渲染
  // 4. useEffect 不会执行！
  // 5. 父组件不会收到 onBlocksChange 回调！
};

// 按回车创建新块时
const handleEnterPress = (blockId) => {
  setBlocks(prevBlocks => {
    return [...prevBlocks, newBlock]; // 新数组
  });

  // 这时会发生什么？
  // 1. React 检查: Object.is(newArray, prevBlocks) === false
  // 2. React 判断: "状态已变化"
  // 3. React 行为: 触发重新渲染
  // 4. useEffect 正常执行！
  // 5. 父组件收到 onBlocksChange 回调！
};
```

### 解决 useEffect 不执行的问题

当使用引用稳定策略时，需要手动通知：

```tsx
const handleContentChange = useCallback((blockId: string, content: string) => {
  setBlocks(prevBlocks => {
    const targetBlock = prevBlocks.find(block => block.id === blockId);
    if (targetBlock && targetBlock.content !== content) {
      targetBlock.content = content;

      // 手动通知父组件，因为 useEffect 不会执行
      queueMicrotask(() => {
        if (onBlocksChange) {
          onBlocksChange(prevBlocks);
        }
      });
    }
    return prevBlocks; // 相同引用，useEffect 不执行
  });
}, [onBlocksChange]);
```

### 设计权衡

**引用稳定策略的优缺点：**

✅ **优点:**
- Block 组件 memo 生效，性能最优
- useMemo 依赖稳定，避免重复计算
- 渲染次数最少

❌ **缺点:**
- useEffect 不会自动执行
- 需要手动管理副作用通知
- 代码复杂度略高

**新引用策略的优缺点：**

✅ **优点:**
- useEffect 正常工作
- 副作用管理简单
- 代码逻辑清晰

❌ **缺点:**
- 每次输入都触发重新渲染
- memo 优化失效
- 性能较差

## 最佳实践

- ✅ 用于真正需要响应式更新的 UI 状态
- ✅ 用于父子组件间的数据同步
- ✅ 使用函数式更新获取最新状态值
- ✅ 理解 React 的引用相等性优化机制
- ✅ 在性能敏感场景下保持对象引用稳定性
- ✅ 引用稳定时手动管理副作用通知
- ❌ 避免在 contentEditable 中直接绑定内容状态
- ❌ 避免不必要的状态，简单的数据可以用 useRef

## 核心理解

**React 的 setState 不是无条件触发重新渲染的！** 它会先进行引用相等性检查，这是一个重要的性能优化机制。理解这一点对于写出高性能的 React 代码至关重要。

