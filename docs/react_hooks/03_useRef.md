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

## 高级应用：缓存模式

### 使用 useRef 实现函数缓存

在性能要求极高的场景中，我们可以使用 useRef 来缓存计算结果或函数引用：

```tsx
// 缓存回调函数的高级模式
const MultiBlockEditor = () => {
  const blockRefs = useRef(new Map<string, HTMLDivElement>());

  // ✅ 使用 ref 缓存回调函数 Map
  const callbackCache = useRef(
    new Map<string, (element: HTMLDivElement | null) => void>(),
  );

  const getRefCallback = useCallback((blockId: string) => {
    if (!callbackCache.current.has(blockId)) {
      // 懒加载：只在需要时创建并缓存回调函数
      callbackCache.current.set(blockId, (element: HTMLDivElement | null) => {
        if (element) {
          blockRefs.current.set(blockId, element);
        } else {
          blockRefs.current.delete(blockId);
        }
      });
    }
    return callbackCache.current.get(blockId)!;
  }, []);

  return (
    <div>
      {blocks.map(block => (
        <Block
          key={block.id}
          ref={getRefCallback(block.id)} // 稳定且高效的 ref 回调
        />
      ))}
    </div>
  );
};
```

### 缓存模式的优势

**相比重复创建的优势：**

| 特性 | 重复创建 | useRef 缓存 |
|------|---------|-------------|
| 内存占用 | 每次渲染都创建新对象 | 复用已创建的对象 |
| GC 压力 | 频繁的垃圾回收 | 减少 GC 压力 |
| 创建成本 | 每次都付出创建成本 | 一次创建，多次复用 |
| 引用稳定性 | 引用不稳定 | 引用完全稳定 |

### 缓存计算结果

```tsx
// 缓存复杂计算的结果
const ExpensiveComponent = ({ data }) => {
  // 缓存昂贵的计算结果
  const expensiveResultCache = useRef(new Map());
  const lastDataRef = useRef();

  const getExpensiveResult = useMemo(() => {
    // 如果数据没变，直接返回缓存
    if (lastDataRef.current === data && expensiveResultCache.current.has(data.id)) {
      return expensiveResultCache.current.get(data.id);
    }

    // 执行昂贵计算
    const result = heavyCalculation(data);

    // 更新缓存
    expensiveResultCache.current.set(data.id, result);
    lastDataRef.current = data;

    return result;
  }, [data]);

  return <div>{getExpensiveResult}</div>;
};
```

### 缓存网络请求

```tsx
const DataFetcher = ({ userId }) => {
  const [data, setData] = useState(null);
  const requestCache = useRef(new Map());
  const abortControllerRef = useRef();

  const fetchData = useCallback(async (id) => {
    // 检查缓存
    if (requestCache.current.has(id)) {
      setData(requestCache.current.get(id));
      return;
    }

    // 取消之前的请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 创建新的请求
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(`/api/users/${id}`, {
        signal: abortControllerRef.current.signal
      });
      const result = await response.json();

      // 缓存结果
      requestCache.current.set(id, result);
      setData(result);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('请求失败:', error);
      }
    }
  }, []);

  useEffect(() => {
    fetchData(userId);
  }, [userId, fetchData]);

  return <div>{data?.name}</div>;
};
```

## 设计模式总结

### 1. DOM 引用模式
```tsx
const domRef = useRef<HTMLElement>(null);
// 用于：焦点管理、滚动控制、测量等
```

### 2. 数据缓存模式
```tsx
const cacheRef = useRef(new Map());
// 用于：避免重复计算、存储临时状态等
```

### 3. 函数缓存模式
```tsx
const callbackCacheRef = useRef(new Map());
// 用于：稳定的回调函数引用、性能优化等
```

### 4. 实例存储模式
```tsx
const instanceRef = useRef();
// 用于：定时器 ID、订阅对象、第三方库实例等
```

## 最佳实践

- ✅ 用于需要直接访问的 DOM 元素
- ✅ 用于存储不需要触发重新渲染的数据
- ✅ 用于存储定时器 ID、订阅等
- ✅ 用于实现高效的缓存机制
- ✅ 配合 useCallback 实现懒加载模式
- ❌ 不要用 ref 存储需要响应式更新的 UI 状态
- ❌ 不要混淆 DOM 引用和数据存储的类型定义
- ❌ 不要过度缓存，简单数据直接计算即可