# useEffect Hook

## 概述

`useEffect` 用于处理副作用（side effects），如数据获取、订阅、手动修改 DOM 等。

## 语法

```tsx
useEffect(() => {
  // 副作用逻辑
  return () => {
    // 清理函数（可选）
  };
}, [dependencies]); // 依赖数组
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
  console.log("组件渲染完成后执行");
}, []); // 只在首次渲染后执行

useEffect(() => {
  console.log("每次渲染后都执行");
}); // 没有依赖数组

useEffect(() => {
  console.log("content 变化后执行");
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

### 案例2：多块编辑器中的状态同步

```tsx
// MultiBlockEditor.tsx - 解决渲染时调用 setState 的问题
const MultiBlockEditorComponent = ({
  onBlocksChange,
}: MultiBlockEditorProps) => {
  const [blocks, setBlocks] = useState<BlockData[]>(initialBlocks);

  // ✅ 使用 useEffect 异步通知父组件，避免渲染时更新状态
  useEffect(() => {
    console.log("calling the useEffect");
    if (onBlocksChange) {
      onBlocksChange(blocks);
    }
  }, [blocks, onBlocksChange]);

  const handleContentChange = useCallback(
    (blockId: string, content: string) => {
      setBlocks((prevBlocks) => {
        const newBlocks = prevBlocks.map((block) => {
          if (block.id === blockId) {
            block.content = content; // 直接修改，保持对象引用
          }
          return block;
        });

        // ❌ 不能在这里调用 onBlocksChange(newBlocks)
        // 这会导致 "Cannot update component while rendering" 错误

        return newBlocks;
      });
    },
    [],
  );
};
```

**问题背景：**
在 `setState` 的同步回调中调用 `onBlocksChange` 会触发父组件状态更新，违反了 React 的规则：不能在组件渲染过程中更新另一个组件的状态。

**解决方案：**
使用 `useEffect` 监听状态变化，异步通知父组件，避免在渲染过程中触发状态更新。

## React 重新渲染的核心机制

### setState 触发重新渲染的规则

```tsx
function Component() {
  const [usedState, setUsedState] = useState("used");
  const [unusedState, setUnusedState] = useState("unused");

  console.log("🔄 组件重新渲染！"); // 任何 setState 都会触发这里

  return <div>{usedState}</div>; // 只使用了 usedState
}

// setUnusedState('new') 依然会触发整个组件重新渲染！
```

**重要概念：**

- React 不会分析 JSX 中哪些状态被使用
- 只要调用了 `setState`，组件就会重新渲染
- 这是 React 保持简单和可预测的设计哲学

### 数组引用 vs 对象引用的区别

```tsx
// 在我们的多块编辑器中
const handleContentChange = useCallback((blockId: string, content: string) => {
  setBlocks((prevBlocks) => {
    const newBlocks = prevBlocks.map((block) => {
      if (block.id === blockId) {
        block.content = content; // ✅ 保持块对象引用稳定
        return block;
      }
      return block;
    });

    return newBlocks; // ❗ 但数组引用总是新的
  });
});

useEffect(() => {
  // 每次都执行，因为 blocks 数组引用总是变化
  if (onBlocksChange) {
    onBlocksChange(blocks);
  }
}, [blocks]); // 数组引用比较
```

**优化策略的层次：**

1. **保持块对象引用稳定** → React.memo 工作，防止子组件重新渲染
2. **让数组引用变化** → useEffect 能检测到变化，正确通知父组件
3. **函数引用稳定** → useCallback 防止不必要的依赖更新

## 最佳实践

- 明确依赖数组，避免无限循环
- 需要清理的副作用要返回清理函数
- 理解 React 的重新渲染机制：setState 无条件触发重新渲染
- 使用 useEffect 解决渲染时状态更新的问题
- 区分对象引用稳定性和数组引用稳定性的不同作用
- 考虑是否真的需要 useEffect，有时直接处理更简单

