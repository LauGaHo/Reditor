# React Hooks 学习文档

这个文档集合记录了在开发 Reditor 编辑器过程中遇到的 React Hooks 使用案例、问题和解决方案。

## 文档列表

### [01. useState Hook](./01_useState.md)
- **主要问题：** contentEditable 中的状态管理导致光标跳转
- **核心学习：** React reconciler 机制，状态更新触发重新渲染
- **解决方案：** 合理选择受控 vs 非受控组件

### [02. useEffect Hook](./02_useEffect.md)
- **主要问题：** 过度使用 useEffect 处理简单事件响应，渲染时更新状态错误
- **核心学习：** 副作用概念，React 重新渲染机制，setState 无条件触发重新渲染
- **解决方案：** 使用 useEffect 解决渲染时状态更新问题，理解引用稳定性层次

### [03. useRef Hook](./03_useRef.md)
- **主要问题：** 混淆 DOM 引用和数据存储的用法
- **核心学习：** useRef 的两种用途，类型安全
- **解决方案：** 明确区分 DOM 引用和数据缓存场景

### [04. React.memo](./04_memo.md)
- **主要问题：** 父组件重新渲染导致子组件不必要的重新渲染
- **核心学习：** 浅比较原理，引用相等性
- **解决方案：** 确保 props 引用稳定，配合 useCallback 使用

### [05. useCallback Hook](./05_useCallback.md)
- **主要问题：** 函数引用不稳定导致 memo 优化失效
- **核心学习：** 函数引用稳定性，依赖数组的作用
- **解决方案：** 使用 useCallback 稳定函数引用

### [06. useMemo Hook](./06_useMemo.md)
- **主要问题：** ref 回调函数每次渲染都创建新引用，破坏 memo 优化
- **核心学习：** 计算值缓存，与 useCallback 的区别，引用稳定性
- **解决方案：** 使用 useMemo 创建稳定的函数引用 Map

### [07. 综合案例：状态更新时机](./07_综合案例_状态更新时机.md)
- **主要问题：** 在 useState 回调内调用 setState 导致执行时序错乱
- **核心学习：** React 状态更新机制，useEffect vs useLayoutEffect，useImperativeHandle
- **解决方案：** 分离状态更新调用，理解 React 批量更新机制

### [08. useImperativeHandle Hook](./08_useImperativeHandle.md)
- **主要问题：** 如何在保持组件封装性的同时暴露方法给父组件调用
- **核心学习：** 组件接口设计，forwardRef 配合使用，TypeScript 接口约束
- **解决方案：** 使用 useImperativeHandle 创建清晰的组件 API

## 核心问题回顾

### 问题链条：contentEditable + React 状态管理

1. **起始问题：** 用户在 contentEditable 中输入，光标跳到开头
2. **根本原因：** React 状态更新 → 重新渲染 → DOM 内容替换 → 光标位置丢失
3. **解决思路：** 避免不必要的重新渲染

### 优化历程

```tsx
// 第一版：有问题的实现
const [content, setContent] = useState('');
return <div contentEditable onInput={e => setContent(e.target.textContent)}>{content}</div>

// 第二版：移除状态绑定
return <div contentEditable dangerouslySetInnerHTML={{__html: initialContent}} />

// 第三版：添加性能优化
const handleInput = useCallback(() => { ... }, []);
export default memo(Block);

// 第四版：完善引用稳定性
const blockRefCallbacks = useMemo(() => createStableRefs(), [blocks]);
<Block ref={blockRefCallbacks.get(block.id)} />;

// 第五版：useImperativeHandle + 懒加载优化
const getRefCallback = useCallback((blockId) => {
  if (!callbackCache.current.has(blockId)) {
    callbackCache.current.set(blockId, createRef(blockId));
  }
  return callbackCache.current.get(blockId);
}, []);

// 第六版：状态更新时机优化
setBlocks(newBlocks);        // 先处理主要状态
setNewBlockId(newBlock.id);  // 再处理辅助状态
```

## 设计原则总结

1. **最小状态原则** - 不是所有数据都需要状态管理
2. **职责分离** - 初始化数据 vs 实时数据分开处理
3. **性能优化** - 稳定的引用 + memo 组合
4. **渐进式优化** - 先解决功能，再优化性能

## React 核心概念理解

### Reconciler 机制
- Virtual DOM 比较算法
- 状态变化触发重新渲染（无条件，不分析 JSX 使用情况）
- DOM 更新的时机和影响
- "Cannot update component while rendering" 错误的原因
- React 18 的自动批量更新机制
- useState 回调内调用 setState 的时序陷阱

### 组件优化策略
- React.memo 浅比较：对象引用 vs 内容比较
- useCallback/useMemo 缓存：函数引用稳定性
- useMemo vs useCallback：缓存返回值 vs 缓存函数本身
- 引用稳定性的层次：对象引用稳定 vs 数组引用变化
- 直接修改属性 vs 创建新对象的性能差异

### useState 深层理解
- setState 触发重新渲染的无条件性
- 对象引用稳定性：`block.content = content` vs `{ ...block, content }`
- 数组引用变化：`prevBlocks.map()` 总是返回新数组
- 函数式更新：`setBlocks(prevBlocks => ...)` 的重要性

### Hook 设计哲学
- 每个 Hook 都有明确的职责
- 组合使用实现复杂功能
- 理解而不是死记硬背
- 状态更新时机决定执行顺序
- 接口抽象优于直接暴露实现

## 下一步学习方向

- useContext（状态提升和共享）
- 自定义 Hook（逻辑复用，已在 useFocusNewItem 中涉及）
- useLayoutEffect（同步 DOM 操作，已在综合案例中涉及）
- useReducer（复杂状态管理）

这些文档记录了真实开发中遇到的问题和思考过程，比单纯的 API 文档更有学习价值。