import { useCallback, useEffect, useRef, useState } from "react";
import type { BlockData } from "../types/block";
import { createBlock } from "../types/block";
import { Block, type BlockHandle } from "./Block";
import { useFocusNewItem } from "../hooks/useFocusNewItem";

interface MultiBlockEditorProps {
  initialBlocks?: BlockData[];
  onBlocksChange?: (blocks: BlockData[]) => void;
}

const MultiBlockEditorComponent = ({
  initialBlocks = [createBlock("Hello World! 🌎️")],
  onBlocksChange,
}: MultiBlockEditorProps) => {
  // 使用数组管理多个块
  const [blocks, setBlocks] = useState<BlockData[]>(initialBlocks);

  // 存储每个块的 DOM ref
  const blockRefs = useRef(new Map<string, BlockHandle>());

  // 使用自定义 Hook 管理新块的自动聚焦
  const focusNewBlock = useFocusNewItem(blockRefs);
  // 缓存回调函数，避免每次渲染都创建新函数
  const callbackCache = useRef(
    new Map<string, (element: BlockHandle | null) => void>(),
  );

  // 通知父组件块变化 - 避免在渲染过程中调用
  useEffect(() => {
    if (onBlocksChange) {
      onBlocksChange(blocks);
    }
  }, [blocks, onBlocksChange]);

  // 更新块内容 - 智能更新，避免创建不必要的新对象
  const handleContentChange = useCallback(
    (blockId: string, content: string) => {
      setBlocks((prevBlocks) => {
        const newBlocks = prevBlocks.map((block) => {
          if (block.id === blockId) {
            block.content = content;
          }
          return block;
        });

        return newBlocks;
      });
    },
    [],
  );

  // 处理回车键：在指定块后面创建新块
  const handleEnterPress = useCallback((blockId: string) => {
    const newBlock = createBlock(); // 创建空的新块

    setBlocks((prevBlocks) => {
      const blockIndex = prevBlocks.findIndex((block) => block.id === blockId);

      // 在指定位置插入新块
      const newBlocks = [
        ...prevBlocks.slice(0, blockIndex + 1),
        newBlock,
        ...prevBlocks.slice(blockIndex + 1),
      ];

      return newBlocks;
    });

    // 触发新块自动聚焦
    focusNewBlock(newBlock.id);
  }, [focusNewBlock]);

  // 删除块
  const handleDeleteBlock = useCallback((blockId: string) => {
    setBlocks((prevBlocks) => {
      // 如果只有一个块，不允许删除
      if (prevBlocks.length <= 1) {
        return prevBlocks;
      }

      const newBlocks = prevBlocks.filter((block) => block.id !== blockId);

      return newBlocks;
    });
  }, []);

  // 稳定的回调获取函数
  const getRefCallback = useCallback((blockId: string) => {
    if (!callbackCache.current.has(blockId)) {
      callbackCache.current.set(blockId, (element: BlockHandle | null) => {
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
    <div className="multi-block-editor">
      {/* React 列表渲染：直接使用 blocks */}
      {blocks.map((block, index) => (
        <Block
          key={block.id} // 重要：使用唯一的 key
          ref={getRefCallback(block.id)}
          block={block} // 对象引用稳定的 block
          placeholder={index === 0 ? "开始输入..." : "继续输入..."}
          onContentChange={handleContentChange}
          onEnterPress={handleEnterPress}
          onDeleteBlock={handleDeleteBlock}
        />
      ))}

      {/* 调试信息 */}
      <div
        style={{
          marginTop: "20px",
          padding: "10px",
          backgroundColor: "#f0f0f0",
          borderRadius: "4px",
          fontSize: "12px",
        }}
      >
        <strong>调试信息：</strong>
        <div>总块数: {blocks.length}</div>
        <div>块ID: {blocks.map((b) => b.id.slice(-6)).join(", ")}</div>
        <div>✨ 对象引用稳定：防止不必要的重新渲染</div>
      </div>
    </div>
  );
};

export const MultiBlockEditor = MultiBlockEditorComponent;
