import { useState, useCallback, useEffect } from "react";
import { Block } from "./Block";
import type { BlockData } from "../types/block";
import { createBlock } from "../types/block";

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
    setBlocks((prevBlocks) => {
      const blockIndex = prevBlocks.findIndex((block) => block.id === blockId);
      const newBlock = createBlock(); // 创建空的新块

      // 在指定位置插入新块
      const newBlocks = [
        ...prevBlocks.slice(0, blockIndex + 1),
        newBlock,
        ...prevBlocks.slice(blockIndex + 1),
      ];

      return newBlocks;
    });
  }, []);

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

  return (
    <div className="multi-block-editor">
      {/* React 列表渲染：直接使用 blocks */}
      {blocks.map((block, index) => (
        <Block
          key={block.id} // 重要：使用唯一的 key
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

