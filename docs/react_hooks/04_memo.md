# React.memo

## 概述

`React.memo` 是一个高阶组件，用于优化函数组件的性能。它通过浅比较 props 来决定是否跳过重新渲染。

## 语法

```tsx
const MemoizedComponent = memo(Component);

// 或者自定义比较函数
const MemoizedComponent = memo(Component, (prevProps, nextProps) => {
  // 返回 true 表示 props 相等，跳过重新渲染
  return prevProps.id === nextProps.id;
});
```

## 在项目中的使用案例

### 问题背景：父组件重新渲染导致子组件不必要的重新渲染

```tsx
// App.tsx - 父组件
function App() {
  const [currentContent, setCurrentContent] = useState("");

  const handleContentChange = (content: string) => {
    setCurrentContent(content); // 触发 App 重新渲染
  };

  return (
    <Block
      initialContent="Hello World!"
      placeholder="开始输入..."
      onContentChange={handleContentChange}
    />
  );
}
```

**问题：** 每次用户输入都会：
1. 触发 `handleContentChange`
2. 更新 `currentContent` 状态
3. App 组件重新渲染
4. Block 组件也跟着重新渲染（即使它的 props 可能没变）
5. 导致 `console.log("fucking Block")` 每次都执行

### 解决方案1：使用 React.memo

```tsx
// Block.tsx
const Block = ({ initialContent, placeholder, onContentChange }: BlockProps) => {
  console.log("fucking Block"); // 用于检测重新渲染

  // 组件逻辑...
};

export default memo(Block); // ✅ 添加 memo 优化
```

**但是遇到新问题：** memo 没有生效，因为 props 还在变化！

### 问题分析：函数引用不稳定

```tsx
// App.tsx - 每次渲染都创建新的函数
const handleContentChange = (content: string) => { // ❌ 新的函数引用
  setCurrentContent(content);
};

// React.memo 的比较过程
function arePropsEqual(prevProps, nextProps) {
  return (
    prevProps.initialContent === nextProps.initialContent &&     // ✅ 相等
    prevProps.placeholder === nextProps.placeholder &&           // ✅ 相等
    prevProps.onContentChange === nextProps.onContentChange      // ❌ 不相等！
  );
}
```

### 完整解决方案：memo + useCallback

```tsx
// App.tsx
const INITIAL_CONTENT = "Hello World!"; // ✅ 稳定的值

const handleContentChange = useCallback((content: string) => {
  setCurrentContent(content);
}, []); // ✅ 稳定的函数引用

return (
  <Block
    initialContent={INITIAL_CONTENT}        // ✅ 稳定
    placeholder="开始输入..."               // ✅ 稳定
    onContentChange={handleContentChange}   // ✅ 稳定
  />
);
```

```tsx
// Block.tsx
export default memo(Block); // ✅ 现在真正有效！
```

## memo 的工作原理

### 默认的浅比较
```js
function defaultCompare(prevProps, nextProps) {
  const prevKeys = Object.keys(prevProps);
  const nextKeys = Object.keys(nextProps);

  if (prevKeys.length !== nextKeys.length) {
    return false;
  }

  for (let key of prevKeys) {
    if (prevProps[key] !== nextProps[key]) {
      return false; // 发现不同，需要重新渲染
    }
  }

  return true; // 所有 props 都相同，跳过重新渲染
}
```

### 自定义比较函数
```tsx
const Block = memo(({ initialContent, placeholder, onContentChange }: BlockProps) => {
  // 组件逻辑
}, (prevProps, nextProps) => {
  // 自定义比较：忽略某些 props 的变化
  return (
    prevProps.placeholder === nextProps.placeholder &&
    prevProps.onContentChange === nextProps.onContentChange
    // 故意忽略 initialContent 的比较
  );
});
```

## 何时使用 memo

### ✅ 适合使用的场景
- 组件经常重新渲染，但 props 很少变化
- 组件渲染成本较高（复杂计算、大量 DOM）
- 父组件频繁更新，但子组件相对稳定

### ❌ 不适合使用的场景
- props 经常变化的组件
- 简单的组件（渲染成本很低）
- 过度优化，增加代码复杂度

## 关键学习点

1. **React 默认行为** - 父组件重新渲染时，所有子组件都会重新渲染
2. **浅比较的概念** - memo 只比较 props 的第一层属性
3. **引用相等性** - 对象和函数需要保持相同的引用才能被认为是"相等"
4. **性能优化策略** - memo + useCallback + useMemo 的组合使用

## 多块编辑器中的实际应用

### Block 组件的 memo 优化

```tsx
// Block.tsx - 最终简化版本
import { memo } from "react";

const BlockComponent = ({
  block,
  placeholder,
  onContentChange,
  onEnterPress,
  onDeleteBlock,
}: BlockProps) => {
  // 组件逻辑...

  return (
    <div
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      dangerouslySetInnerHTML={{ __html: block.content }}
    />
  );
};

// ✅ 使用默认的 memo 即可，因为我们保证了对象引用稳定性
export const Block = memo(BlockComponent);
```

### 核心优化策略：对象引用稳定性

```tsx
// MultiBlockEditor.tsx
const handleContentChange = useCallback((blockId: string, content: string) => {
  setBlocks((prevBlocks) => {
    const newBlocks = prevBlocks.map((block) => {
      if (block.id === blockId) {
        if (block.content === content) {
          return block; // ✅ 内容没变，保持引用
        }
        block.content = content; // ✅ 直接修改，保持对象引用
        return block;
      }
      return block; // ✅ 其他块保持原引用
    });
    return newBlocks;
  });
}, [onBlocksChange]);
```

**为什么这种方式有效：**

1. **对象引用稳定** - `block.content = content` 保持 block 对象引用不变
2. **函数引用稳定** - `useCallback` 保持事件处理函数引用不变
3. **默认 memo 足够** - 所有 props 都引用稳定，不需要自定义比较函数

### 性能对比

```tsx
// ❌ 错误方式：破坏对象引用
const newBlocks = prevBlocks.map((block) =>
  block.id === blockId ? { ...block, content } : block
);
// 结果：每次输入都创建新对象 → memo 失效 → 所有 Block 重新渲染

// ✅ 正确方式：保持对象引用
const newBlocks = prevBlocks.map((block) => {
  if (block.id === blockId) {
    block.content = content; // 直接修改
    return block;
  }
  return block;
});
// 结果：只有修改的对象引用变化 → memo 生效 → 只有变化的 Block 重新渲染
```

### 调试技巧：验证 memo 是否生效

```tsx
// 在组件内部添加调试日志
const BlockComponent = ({ block, ...props }: BlockProps) => {
  console.log(`🔄 Block ${block.id.slice(-6)} 重新渲染`);

  // 如果只在内容真正变化时看到这个日志，说明 memo 工作正常
  // 如果每次输入都看到，说明 props 引用在变化
};
```

## 最佳实践

- 与 `useCallback` 和 `useMemo` 配合使用
- 优先保证 props 引用稳定性，而不是依赖复杂的比较函数
- 理解对象引用稳定性的重要性：直接修改 vs 创建新对象
- 使用调试日志验证优化效果
- 不要过度使用，先测量性能再优化