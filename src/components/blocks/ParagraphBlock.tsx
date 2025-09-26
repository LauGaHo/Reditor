import { forwardRef, memo, useImperativeHandle, useRef } from "react";
import type { BaseBlockProps, BlockHandle } from "../../types/blockComponent";

const ParagraphBlockComponent = forwardRef<BlockHandle, BaseBlockProps>(
  (
    {
      block,
      placeholder = "输入文本...",
      onContentChange,
      onEnterPress,
      onDeleteBlock,
    },
    ref,
  ) => {
    const divRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(
      ref,
      () => ({
        focus: () => {
          divRef.current?.focus();
        },
      }),
      [],
    );

    const handleInput = (event: React.FormEvent<HTMLDivElement>) => {
      const newContent = event.currentTarget.textContent || "";

      if (onContentChange) {
        onContentChange(block.id, newContent);
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (onEnterPress) {
          onEnterPress(block.id);
        }
      } else if (event.key === "Backspace") {
        const content = event.currentTarget.textContent || "";
        if (content === "" && onDeleteBlock) {
          event.preventDefault();
          onDeleteBlock(block.id);
        }
      }
    };

    return (
      <div
        ref={divRef}
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
  },
);

export const ParagraphBlock = memo(ParagraphBlockComponent);