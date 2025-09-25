# useImperativeHandle Hook - 组件接口设计

## 概述

`useImperativeHandle` 可以让你在使用 `forwardRef` 时自定义暴露给父组件的实例值。它通常用于替代直接暴露 DOM 节点，而是暴露一组更加语义化的方法。

## 语法

```tsx
useImperativeHandle(ref, createHandle, deps?)
```

- `ref`: 从 `forwardRef` 渲染函数接收的 ref
- `createHandle`: 返回你希望暴露的对象的函数
- `deps`: 可选的依赖数组

## 在项目中的应用场景

### 问题背景：组件封装与控制权

在我们的编辑器项目中，父组件（MultiBlockEditor）需要控制子组件（Block）的焦点，但又希望保持组件的封装性：

```tsx
// ❌ 方案1: 直接暴露 DOM 元素
const Block = forwardRef<HTMLDivElement, BlockProps>((props, ref) => {
  return <div ref={ref} contentEditable />; // 暴露了内部 DOM 结构
});

// 父组件直接操作 DOM
const divElement = blockRefs.current.get(blockId);
if (divElement) {
  divElement.focus(); // 直接调用 DOM API
}
```

**问题：**
- 暴露了组件内部实现细节
- 父组件与 DOM 结构强耦合
- 难以扩展和维护

### 解决方案：使用 useImperativeHandle 设计组件接口

```tsx
// ✅ 方案2: 定义清晰的组件接口
export interface BlockHandle {
  focus: () => void;
  // 未来可以扩展更多方法
  blur?: () => void;
  getSelection?: () => Selection | null;
  scrollIntoView?: () => void;
}

const BlockComponent = forwardRef<BlockHandle, BlockProps>(
  ({ block, placeholder, onContentChange, onEnterPress, onDeleteBlock }, ref) => {
    const divRef = useRef<HTMLDivElement>(null);

    // 暴露给父组件的方法
    useImperativeHandle(
      ref,
      () => ({
        focus: () => {
          divRef.current?.focus();
        },
      }),
      [], // 空依赖数组，保证引用稳定
    );

    return (
      <div
        ref={divRef} // 内部 DOM 引用
        contentEditable
        // ... 其他属性
      />
    );
  },
);
```

## 核心设计原则

### 1. **接口抽象**
```tsx
// 定义清晰的接口契约
export interface BlockHandle {
  focus: () => void; // 清晰的方法语义
}

// 而不是直接暴露 DOM
export type BlockRef = HTMLDivElement; // ❌ 暴露实现细节
```

### 2. **封装内部实现**
```tsx
useImperativeHandle(
  ref,
  () => ({
    focus: () => {
      // 内部可能有复杂的逻辑
      if (divRef.current) {
        divRef.current.focus();

        // 可能还有其他操作
        divRef.current.scrollIntoView({ behavior: 'smooth' });

        // 触发自定义事件
        onFocused?.(block.id);
      }
    },
  }),
  [], // 依赖数组很重要
);
```

### 3. **依赖数组优化**
```tsx
// ✅ 推荐：空依赖数组，方法引用稳定
useImperativeHandle(
  ref,
  () => ({
    focus: () => divRef.current?.focus(),
  }),
  [], // 引用稳定，配合 memo 使用
);

// ❌ 避免：不必要的依赖导致频繁重新创建
useImperativeHandle(
  ref,
  () => ({
    focus: () => divRef.current?.focus(),
  }),
  [someProps], // 可能导致引用不稳定
);
```

## 与其他 Hook 的配合使用

### 配合 forwardRef + memo

```tsx
// 完整的最佳实践组合
const Block = memo(
  forwardRef<BlockHandle, BlockProps>((props, ref) => {
    const divRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(
      ref,
      () => ({
        focus: () => divRef.current?.focus(),
      }),
      [], // 稳定引用，memo 生效
    );

    return <div ref={divRef} contentEditable />;
  })
);
```

### 配合自定义 Hook

```tsx
// 可以抽象成自定义 Hook
function useFocusableImperativeHandle(
  ref: ForwardedRef<BlockHandle>,
  elementRef: RefObject<HTMLDivElement>
) {
  useImperativeHandle(
    ref,
    () => ({
      focus: () => elementRef.current?.focus(),
    }),
    []
  );
}

// 在组件中使用
const Block = forwardRef<BlockHandle, BlockProps>((props, ref) => {
  const divRef = useRef<HTMLDivElement>(null);
  useFocusableImperativeHandle(ref, divRef);

  return <div ref={divRef} contentEditable />;
});
```

## 实际应用案例

### 案例1：编辑器块的焦点管理

```tsx
// 在我们的项目中的使用
const MultiBlockEditor = () => {
  const blockRefs = useRef(new Map<string, BlockHandle>());
  const focusNewBlock = useFocusNewItem(blockRefs);

  const handleEnterPress = useCallback((blockId: string) => {
    const newBlock = createBlock();
    setBlocks(/* ... 添加新块 */);

    // ✅ 调用组件暴露的方法，而不是直接操作 DOM
    focusNewBlock(newBlock.id);
  }, [focusNewBlock]);

  return (
    <div>
      {blocks.map(block => (
        <Block
          key={block.id}
          ref={getRefCallback(block.id)} // 获取 BlockHandle
          // ...
        />
      ))}
    </div>
  );
};
```

### 案例2：表单控件的统一接口

```tsx
// 为不同类型的表单控件定义统一接口
interface FormControlHandle {
  focus: () => void;
  validate: () => boolean;
  getValue: () => any;
  setValue: (value: any) => void;
}

const TextInput = forwardRef<FormControlHandle, TextInputProps>((props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState('');

  useImperativeHandle(
    ref,
    () => ({
      focus: () => inputRef.current?.focus(),
      validate: () => value.length > 0,
      getValue: () => value,
      setValue: (newValue) => setValue(newValue),
    }),
    [value]
  );

  return <input ref={inputRef} value={value} onChange={e => setValue(e.target.value)} />;
});

const SelectInput = forwardRef<FormControlHandle, SelectInputProps>((props, ref) => {
  // 相同的接口，不同的实现
  useImperativeHandle(ref, () => ({
    focus: () => selectRef.current?.focus(),
    validate: () => selectedValue !== '',
    getValue: () => selectedValue,
    setValue: (newValue) => setSelectedValue(newValue),
  }));

  return <select>...</select>;
});
```

## 设计模式与最佳实践

### 1. **接口优先设计**
```tsx
// 先定义接口
interface ComponentHandle {
  // 对外暴露的方法
}

// 再实现组件
const Component = forwardRef<ComponentHandle, Props>(...);
```

### 2. **职责单一原则**
```tsx
// ✅ 好的设计：职责清晰
interface BlockHandle {
  focus: () => void; // 焦点控制
}

// ❌ 过度设计：职责混乱
interface BlockHandle {
  focus: () => void;
  save: () => void;        // 数据持久化不应该是UI组件的责任
  validate: () => boolean;  // 验证逻辑应该在上层
}
```

### 3. **向前兼容**
```tsx
// 设计可扩展的接口
interface BlockHandle {
  focus: () => void;

  // 可选方法，保证向前兼容
  blur?: () => void;
  getSelection?: () => Selection | null;
}
```

### 4. **错误处理**
```tsx
useImperativeHandle(
  ref,
  () => ({
    focus: () => {
      try {
        divRef.current?.focus();
      } catch (error) {
        console.warn('Focus failed:', error);
      }
    },
  }),
  []
);
```

## 何时使用 useImperativeHandle

### ✅ 适合的场景

1. **需要暴露特定方法**：如 focus、scrollIntoView 等
2. **组件库开发**：为组件提供编程式 API
3. **复杂组件的控制**：父组件需要触发子组件的特定行为
4. **第三方库集成**：包装第三方库并提供 React 化的接口

### ❌ 不适合的场景

1. **简单的数据传递**：用 props 就足够了
2. **频繁的数据同步**：应该用 props 和回调
3. **状态管理**：应该提升状态到父组件
4. **过度使用**：大部分情况下 props 更合适

## useImperativeHandle vs 其他模式

| 方案 | 适用场景 | 优缺点 |
|------|---------|--------|
| `useImperativeHandle` | 需要调用子组件方法 | ✅ 封装性好 ❌ 增加复杂度 |
| `props + callback` | 数据传递和事件通知 | ✅ 简单直接 ❌ 无法调用方法 |
| `forwardRef` 直接暴露 | 简单的 DOM 操作 | ✅ 直接高效 ❌ 耦合度高 |

## 总结

`useImperativeHandle` 是 React 中实现组件接口设计的重要工具：

### 核心价值

1. **封装性** - 隐藏内部实现细节
2. **接口化** - 提供清晰的组件 API
3. **可维护性** - 便于扩展和重构
4. **类型安全** - TypeScript 接口约束

### 在 Reditor 项目中的作用

- 解决了父子组件间的方法调用需求
- 保持了组件的封装性和可测试性
- 为未来的功能扩展提供了良好的基础
- 展示了现代 React 组件设计的最佳实践

`useImperativeHandle` 体现了 React "数据向下流动，事件向上冒泡" 之外的第三种交互模式：**方法调用**。它让我们在保持 React 声明式特性的同时，也能处理一些必要的命令式操作。