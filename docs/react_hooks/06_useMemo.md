# useMemo Hook - 计算值缓存与引用稳定

## 问题背景

在 MultiBlockEditor 中，每次渲染都会为每个 Block 创建新的 ref 回调函数，导致 React.memo 优化失效：

```tsx
// 💥 问题代码：每次渲染都创建新函数
{blocks.map((block, index) => (
  <Block
    ref={(element) => {  // ❌ 每次都是新函数
      if (element) {
        blockRefs.current.set(block.id, element);
      } else {
        blockRefs.current.delete(block.id);
      }
    }}
    // ...其他 props
  />
))}
```

**问题现象：**
- Block 组件使用了 `memo` 优化，但仍然每次都重新渲染
- 性能分析发现 ref 回调函数每次都是新的引用
- 导致整个列表渲染性能下降

## useMemo 基础概念

### 作用
缓存计算结果，只有当依赖发生变化时才重新计算。

### 语法
```tsx
const memoizedValue = useMemo(() => {
  return expensiveCalculation(dependency);
}, [dependency]);
```

### 与 useCallback 的区别
- `useCallback`: 缓存**函数本身**
- `useMemo`: 缓存**函数的返回值**

```tsx
// useCallback - 缓存函数
const handleClick = useCallback(() => {
  console.log('click');
}, []);

// useMemo - 缓存返回值
const expensiveValue = useMemo(() => {
  return heavyCalculation();
}, [dependency]);
```

## 解决方案：稳定的 ref 回调 Map

### 实现思路

使用 `useMemo` 为每个 Block 创建稳定的 ref 回调函数：

```tsx
// ✅ 解决方案：使用 useMemo 创建稳定的 Map
const blockRefCallbacks = useMemo(() => {
  const callbacks = new Map<string, (element: HTMLDivElement | null) => void>();

  blocks.forEach(block => {
    callbacks.set(block.id, (element) => {
      if (element) {
        blockRefs.current.set(block.id, element);
      } else {
        blockRefs.current.delete(block.id);
      }
    });
  });

  return callbacks;
}, [blocks]);
```

### 使用方式

```tsx
{blocks.map((block, index) => (
  <Block
    key={block.id}
    ref={blockRefCallbacks.get(block.id)!}  // ✅ 稳定的函数引用
    // ...其他 props
  />
))}
```

## 核心原理分析

### 为什么需要 useMemo？

1. **引用稳定性需求**：React.memo 进行浅比较，需要相同的函数引用
2. **性能优化**：避免每次渲染都创建新的 Map 和函数
3. **依赖追踪**：只有当 blocks 数组变化时才重新计算

### 缓存策略

```tsx
// 依赖分析
useMemo(() => {
  // 这里使用了 blocks 变量
  blocks.forEach(block => { ... });
  return callbacks;
}, [blocks]);  // 必须包含 blocks 作为依赖
```

**依赖变化时机：**
- 添加新 block → blocks 数组变化 → 重新计算
- 删除 block → blocks 数组变化 → 重新计算
- 修改 block 内容 → blocks 数组引用不变 → 使用缓存

## ESLint 规则与最佳实践

### 常见警告处理

```tsx
// ❌ 警告：missing dependency
useMemo(() => {
  blocks.forEach(block => { ... });
}, []); // 缺少 blocks 依赖

// ❌ 警告：complex expression in dependency
useMemo(() => {
  // ...
}, [blocks.map(b => b.id).join(',')]); // 复杂表达式

// ✅ 正确写法
useMemo(() => {
  blocks.forEach(block => { ... });
}, [blocks]); // 简单、完整的依赖
```

### 性能考虑

**何时使用 useMemo：**
1. 计算开销大的操作
2. 需要稳定引用的复杂对象
3. 作为其他 Hook 的依赖

**何时不需要：**
1. 简单的计算（如字符串拼接）
2. 原始值（React 会自动优化）
3. 每次都需要更新的值

## 实际应用案例

### 案例1：ref 回调函数 Map

```tsx
// 问题：为大量组件创建稳定的 ref 函数
const blockRefCallbacks = useMemo(() => {
  const callbacks = new Map();
  blocks.forEach(block => {
    callbacks.set(block.id, (element) => {
      // ref 回调逻辑
    });
  });
  return callbacks;
}, [blocks]);
```

### 案例2：复杂过滤计算

```tsx
// 假设的搜索过滤场景
const filteredBlocks = useMemo(() => {
  return blocks.filter(block =>
    block.content.toLowerCase().includes(searchTerm.toLowerCase())
  );
}, [blocks, searchTerm]);
```

### 案例3：格式化数据

```tsx
// 复杂的数据转换
const formattedData = useMemo(() => {
  return blocks.map(block => ({
    ...block,
    wordCount: block.content.split(' ').length,
    preview: block.content.substring(0, 100)
  }));
}, [blocks]);
```

## 与其他 Hook 的配合

### useMemo + useCallback

```tsx
// 缓存计算结果
const expensiveData = useMemo(() => heavyCalculation(), [dependency]);

// 缓存使用该数据的函数
const handleData = useCallback((input) => {
  return processData(expensiveData, input);
}, [expensiveData]);
```

### useMemo + memo

```tsx
// 稳定的复杂 props
const ComplexChild = memo(({ data, config }) => {
  // 组件实现
});

function Parent() {
  const config = useMemo(() => ({
    theme: 'dark',
    size: 'large'
  }), []); // 稳定的对象引用

  return <ComplexChild data={data} config={config} />;
}
```

## 调试与性能分析

### React DevTools Profiler

1. 启用 Profiler 录制
2. 观察组件重新渲染原因
3. 检查 props 变化情况

### 常见问题排查

```tsx
// 调试：打印依赖变化
useMemo(() => {
  console.log('useMemo recalculating, blocks:', blocks.length);
  return calculations;
}, [blocks]);

// 验证引用稳定性
const result = useMemo(() => createCallbacks(), [blocks]);
console.log('Same reference?', result === lastResult);
```

## 总结

### useMemo 的核心价值

1. **性能优化** - 避免重复计算
2. **引用稳定** - 配合 memo 使用
3. **依赖追踪** - 精确控制重新计算时机

### 设计原则

1. **按需使用** - 不是所有计算都需要缓存
2. **正确依赖** - 遵循 ESLint 规则
3. **简单明确** - 避免过度复杂的逻辑

### 在 Reditor 项目中的作用

useMemo 解决了 Block 组件列表渲染的性能问题，确保了：
- ref 回调函数的引用稳定性
- React.memo 优化的有效性
- 整体编辑器的流畅体验

## 方案对比与演进

### 从 useMemo 到 useCallback + useRef 的演进过程

在我们的项目中，ref 回调管理经历了不同方案的演进：

### 方案1: 每次创建（性能最差）

```tsx
{blocks.map(block => (
  <Block
    ref={(element) => {  // ❌ 每次都创建新函数
      if (element) {
        blockRefs.current.set(block.id, element);
      }
    }}
  />
))}
```

**问题：** memo 完全失效，每次都重新渲染

### 方案2: useMemo 批量创建（中等性能）

```tsx
const blockRefCallbacks = useMemo(() => {
  const callbacks = new Map();
  blocks.forEach(block => {
    callbacks.set(block.id, (element) => {
      // ref 逻辑
    });
  });
  return callbacks;
}, [blocks]); // blocks 变化时重新创建整个 Map
```

**问题：** 用户输入时 blocks 变化 → 重新创建所有回调函数

### 方案3: useCallback + useRef 懒加载（最优性能）

```tsx
const callbackCache = useRef(new Map());

const getRefCallback = useCallback((blockId: string) => {
  if (!callbackCache.current.has(blockId)) {
    callbackCache.current.set(blockId, (element) => {
      // ref 逻辑
    });
  }
  return callbackCache.current.get(blockId)!;
}, []); // 完全稳定，不依赖任何变量
```

**优势：** 按需创建，引用完全稳定

### 性能对比表

| 操作场景 | 方案1 | 方案2 (useMemo) | 方案3 (懒加载) |
|---------|-------|----------------|---------------|
| 用户输入 | 重新渲染所有 | memo 生效 | memo 生效 |
| 添加新块 | 重新渲染所有 | 重新创建所有回调 | 只创建新块回调 |
| 删除块 | 重新渲染所有 | 重新创建所有回调 | 无操作 |
| 内存效率 | 最差 | 中等 | 最好 |
| 引用稳定性 | 不稳定 | 部分稳定 | 完全稳定 |

### 何时选择不同方案

**使用 useMemo 的场景：**
- ✅ 计算结果依赖某些 props/state
- ✅ 需要批量处理的数据转换
- ✅ 一次性创建复杂对象

**使用懒加载模式的场景：**
- ✅ 动态列表的回调函数管理
- ✅ 需要极致性能的场景
- ✅ 函数创建成本很高
- ✅ 希望引用完全稳定

### 实际项目中的选择

在我们的编辑器项目中：

1. **最初选择 useMemo** - 简单直接，解决了基本性能问题
2. **遇到新问题** - 用户输入导致 blocks 变化，useMemo 重新执行
3. **升级到懒加载** - 实现了真正的按需创建和完全稳定的引用

这个演进过程体现了：
- **渐进式优化** - 先解决主要问题，再优化细节
- **问题驱动** - 遇到具体性能瓶颈时才进一步优化
- **方案权衡** - 根据实际需求选择最合适的技术方案

## 总结

### useMemo 的核心价值

1. **性能优化** - 避免重复计算
2. **引用稳定** - 配合 memo 使用
3. **依赖追踪** - 精确控制重新计算时机
4. **方案演进** - 为更高级的优化模式奠定基础

### 设计原则

1. **按需使用** - 不是所有计算都需要缓存
2. **正确依赖** - 遵循 ESLint 规则
3. **简单明确** - 避免过度复杂的逻辑
4. **渐进优化** - 根据实际需求选择方案

### 在 Reditor 项目中的作用

useMemo 在我们的项目中起到了承上启下的作用：
- 解决了基本的 ref 回调性能问题
- 为后续的懒加载模式提供了思路
- 展示了 React 性能优化的演进过程

这是 React 性能优化的重要一环，与 useCallback 和 memo 共同构成了完整的优化策略。