import { useCallback, useEffect, useState, type RefObject } from "react";

/**
 * 自定义 Hook：管理新创建元素的自动聚焦
 *
 * @param refsMap - 存储元素引用的 Map
 * @returns 触发聚焦的函数
 */
export function useFocusNewItem<T extends { focus(): void }>(
  refsMap: RefObject<Map<string, T>>,
) {
  const [newItemId, setNewItemId] = useState<string>("");

  // 当有新元素需要聚焦时，自动执行聚焦逻辑
  useEffect(() => {
    if (newItemId) {
      const newElement = refsMap.current.get(newItemId);
      if (newElement) {
        newElement.focus();
        setNewItemId(""); // 清空状态，避免重复执行
      }
    }
  }, [newItemId, refsMap]);

  // 返回触发聚焦的函数，使用 useCallback 缓存
  const focusNewItem = useCallback((itemId: string) => {
    setNewItemId(itemId);
  }, []);

  return focusNewItem;
}
