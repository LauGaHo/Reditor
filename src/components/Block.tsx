import { memo } from "react";
import type { BlockData } from "../types/block";

interface BlockProps {
  block: BlockData; // 块数据
  placeholder?: string;
  onContentChange?: (blockId: string, content: string) => void; // 传递块ID
  onEnterPress?: (blockId: string) => void; // 回车创建新块
  onDeleteBlock?: (blockId: string) => void; // 删除块
}

const BlockComponent = ({
  block,
  placeholder = "输入文本...",
  onContentChange,
  onEnterPress,
  onDeleteBlock,
}: BlockProps) => {
  // 事件处理函数：处理用户输入
  const handleInput = (event: React.FormEvent<HTMLDivElement>) => {
    const newContent = event.currentTarget.textContent || "";

    // 通知父组件，传递块ID和内容
    if (onContentChange) {
      onContentChange(block.id, newContent);
    }
  };

  // 处理键盘事件
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      // 通知父组件创建新块
      if (onEnterPress) {
        onEnterPress(block.id);
      }
    } else if (event.key === "Backspace") {
      const content = event.currentTarget.textContent || "";
      // 如果块为空且按下退格键，删除该块
      if (content === "" && onDeleteBlock) {
        event.preventDefault();
        onDeleteBlock(block.id);
      }
    }
  };

  return (
    <div
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      style={{
        minHeight: "24px",
        padding: "8px 12px",
        border: "1px solid #e1e5e9",
        borderRadius: "4px",
        outline: "none",
        fontSize: "16px",
        lineHeight: "1.5",
        cursor: "text",
        marginBottom: "8px",
      }}
      data-placeholder={placeholder}
      dangerouslySetInnerHTML={{ __html: block.content }}
    />
  );
};

// 使用默认的 memo 比较函数即可
export const Block = memo(BlockComponent);

