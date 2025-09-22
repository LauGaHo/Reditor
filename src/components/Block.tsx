import { memo } from "react";

interface BlockProps {
  initialContent?: string;
  placeholder?: string;
  onContentChange?: (content: string) => void;
}

const BlockComponent = ({
  initialContent = "",
  placeholder = "输入文本...",
  onContentChange,
}: BlockProps) => {
  // 事件处理函数：处理用户输入
  const handleInput = (event: React.FormEvent<HTMLDivElement>) => {
    const newContent = event.currentTarget.textContent || "";

    // 直接通知父组件，不触发任何重新渲染
    if (onContentChange) {
      onContentChange(newContent);
    }
  };

  // 处理回车键创建新块（暂时只是阻止默认行为）
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      // 阶段2会实现：创建新块的逻辑
      console.log("Enter pressed - 将在阶段2实现新块创建");
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
      dangerouslySetInnerHTML={{ __html: initialContent }}
    />
  );
};

// 使用 memo 优化：只有 props 真正变化时才重新渲染
export const Block = memo(BlockComponent);
