# useCallback Hook

## 概述

`useCallback` 返回一个记忆化的回调函数。只有当依赖项改变时，才会返回新的函数实例。主要用于优化性能，避免不必要的重新渲染。

## 语法

```tsx
const memoizedCallback = useCallback(() => {
  // 函数逻辑
}, [dependencies]);
```

## 在项目中的使用案例

### 问题背景：函数引用不稳定导致 memo 失效

```tsx
// App.tsx - 问题代码
function App() {
  const [currentContent, setCurrentContent] = useState("");

  // ❌ 每次渲染都创建新的函数实例
  const handleContentChange = (content: string) => {
    setCurrentContent(content);
    console.log("内容变化:", content);
  };

  return (
    <Block
      onContentChange={handleContentChange} // ❌ 每次都是新的函数引用
    />
  );
}
```

**问题分析：**
1. 用户输入 → `handleContentChange` 调用 → `setCurrentContent` → App 重新渲染
2. App 重新渲染 → 创建新的 `handleContentChange` 函数 → 新的函数引用
3. Block 收到新的 `onContentChange` prop → React.memo 认为 props 变了 → Block 重新渲染
4. 结果：`console.log("fucking Block")` 每次都执行

### 解决方案：使用 useCallback 稳定函数引用

```tsx
// App.tsx - 优化后的代码
import { useState, useCallback } from "react";

function App() {
  const [currentContent, setCurrentContent] = useState("");

  // ✅ 使用 useCallback 保持函数引用稳定
  const handleContentChange = useCallback((content: string) => {
    setCurrentContent(content);
    console.log("内容变化:", content);
  }, []); // 空依赖数组 = 函数引用永远不变

  return (
    <Block
      onContentChange={handleContentChange} // ✅ 稳定的函数引用
    />
  );
}
```

**效果：**
- ✅ Block 组件不再因为 `onContentChange` 变化而重新渲染
- ✅ `console.log("fucking Block")` 只在真正需要时执行
- ✅ React.memo 真正发挥作用

## useCallback 的工作原理

### 依赖数组的作用

```tsx
// 情况1：空依赖数组 - 函数永远不变
const callback1 = useCallback(() => {
  console.log('这个函数引用永远不变');
}, []); // 即使组件重新渲染，返回相同的函数实例

// 情况2：有依赖的情况 - 依赖变化时更新函数
const callback2 = useCallback(() => {
  console.log('当前值:', value);
}, [value]); // 只有 value 变化时，才返回新的函数实例

// 情况3：没有依赖数组 - 每次都创建新函数（没有优化效果）
const callback3 = useCallback(() => {
  console.log('每次都是新函数');
}); // 等同于不使用 useCallback
```

### 内部实现原理（简化版）

```js
function useCallback(callback, deps) {
  const hook = getCurrentHook();

  if (hook.deps && depsAreEqual(hook.deps, deps)) {
    // 依赖没变，返回缓存的函数
    return hook.memoizedCallback;
  } else {
    // 依赖变了，创建新函数并缓存
    hook.memoizedCallback = callback;
    hook.deps = deps;
    return callback;
  }
}
```

## 常见使用场景

### 1. 配合 React.memo 使用（我们的案例）

```tsx
// 父组件
const Parent = () => {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    console.log('按钮被点击');
  }, []); // 稳定的函数引用

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <Child onClick={handleClick} /> {/* Child 不会因为 count 变化而重新渲染 */}
    </div>
  );
};

const Child = memo(({ onClick }) => {
  console.log('Child 重新渲染');
  return <button onClick={onClick}>点击我</button>;
});
```

### 2. 依赖外部变量的情况

```tsx
const SearchComponent = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');

  // ✅ 正确：依赖数组包含所有外部变量
  const handleSearch = useCallback(() => {
    searchAPI(query, category);
  }, [query, category]); // query 或 category 变化时，函数才更新

  return <SearchButton onSearch={handleSearch} />;
};
```

### 3. 避免无限循环

```tsx
const DataFetcher = ({ userId }) => {
  const [data, setData] = useState(null);

  // ✅ 正确：使用 useCallback 避免 useEffect 无限执行
  const fetchData = useCallback(async () => {
    const result = await api.getUserData(userId);
    setData(result);
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]); // fetchData 稳定，不会导致无限循环

  return <div>{data?.name}</div>;
};
```

## useCallback vs 普通函数

```tsx
// 没有 useCallback - 每次都创建新函数
const handleClick1 = () => {
  console.log('clicked');
}; // 新的函数实例

// 使用 useCallback - 缓存函数实例
const handleClick2 = useCallback(() => {
  console.log('clicked');
}, []); // 相同的函数实例（如果依赖不变）
```

## 性能考虑

### ✅ 何时使用 useCallback
- 函数作为 props 传递给使用了 memo 的组件
- 函数作为其他 Hook 的依赖项（如 useEffect）
- 函数创建成本较高（包含复杂逻辑）

### ❌ 过度使用的陷阱
```tsx
// ❌ 过度优化：简单函数不需要 useCallback
const handleClick = useCallback(() => {
  console.log('simple click');
}, []); // 这里的优化成本可能大于收益

// ✅ 直接使用普通函数更好
const handleClick = () => {
  console.log('simple click');
};
```

## 在多块编辑器中的实际应用

### MultiBlockEditor 组件中的事件处理函数

```tsx
// MultiBlockEditor.tsx - 实际项目代码
const MultiBlockEditorComponent = ({ onBlocksChange }: MultiBlockEditorProps) => {
  const [blocks, setBlocks] = useState<BlockData[]>(initialBlocks);

  // ✅ 使用 useCallback 稳定函数引用
  const handleContentChange = useCallback(
    (blockId: string, content: string) => {
      setBlocks((prevBlocks) => {
        const newBlocks = prevBlocks.map((block) => {
          if (block.id === blockId) {
            if (block.content === content) {
              return block; // 内容没变，保持引用
            }
            block.content = content; // 直接修改，保持对象引用
            return block;
          }
          return block;
        });

        if (onBlocksChange) {
          onBlocksChange(newBlocks);
        }
        return newBlocks;
      });
    },
    [onBlocksChange], // 依赖 onBlocksChange
  );

  const handleEnterPress = useCallback(
    (blockId: string) => {
      setBlocks((prevBlocks) => {
        // ... 创建新块的逻辑
      });
    },
    [onBlocksChange],
  );

  const handleDeleteBlock = useCallback(
    (blockId: string) => {
      setBlocks((prevBlocks) => {
        // ... 删除块的逻辑
      });
    },
    [onBlocksChange],
  );

  return (
    <div>
      {blocks.map((block) => (
        <Block
          key={block.id}
          block={block}
          onContentChange={handleContentChange} // ✅ 稳定的函数引用
          onEnterPress={handleEnterPress}       // ✅ 稳定的函数引用
          onDeleteBlock={handleDeleteBlock}     // ✅ 稳定的函数引用
        />
      ))}
    </div>
  );
};
```

**关键优化点：**

1. **函数引用稳定性**: 所有事件处理函数都用 `useCallback` 包装
2. **配合对象引用稳定性**: 配合 `block.content = content` 实现双重优化
3. **正确的依赖数组**: 包含 `onBlocksChange` 依赖，确保父组件回调变化时函数能更新

### 性能效果分析

```tsx
// 没有 useCallback 的情况
❌ 用户输入 → setBlocks → MultiBlockEditor 重新渲染 → 创建新的事件处理函数 →
   所有 Block 组件收到新的 props → 所有 Block 重新渲染

// 使用 useCallback 的情况
✅ 用户输入 → setBlocks → MultiBlockEditor 重新渲染 → 事件处理函数引用不变 →
   只有内容变化的 Block 重新渲染（由于对象引用稳定性）
```

## 在我们项目中的关键作用

1. **解决 memo 失效问题** - 确保 Block 组件的 props 真正稳定
2. **提升性能** - 避免不必要的重新渲染
3. **函数引用稳定性** - 让组件优化策略真正生效
4. **调试友好** - 通过减少重新渲染，让调试日志更清晰
5. **配合对象引用优化** - 与 `block.content = content` 形成完整的性能优化方案

## 最佳实践

- 与 React.memo 配合使用时必须使用 useCallback
- 依赖数组要完整，包含所有外部变量
- 不要过度使用，简单场景直接用普通函数
- 理解闭包和依赖的关系，避免 stale closure 问题