import { forwardRef, memo, useImperativeHandle, useRef } from "react";
import type { BaseBlockProps, BlockHandle } from "../../types/blockComponent";

interface HeadingBlockProps extends BaseBlockProps {
  headingLevel: "h1" | "h2" | "h3";
}

const HeadingBlockComponent = forwardRef<BlockHandle, HeadingBlockProps>(
  (
    {
      block,
      headingLevel,
      placeholder = "输入标题...",
      onContentChange,
      onEnterPress,
      onDeleteBlock,
    },
    ref,
  ) => {
    const elementRef = useRef<HTMLHeadingElement>(null);

    useImperativeHandle(
      ref,
      () => ({
        focus: () => {
          elementRef.current?.focus();
        },
      }),
      [],
    );

    const handleInput = (event: React.FormEvent<HTMLHeadingElement>) => {
      const newContent = event.currentTarget.textContent || "";

      if (onContentChange) {
        onContentChange(block.id, newContent);
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLHeadingElement>) => {
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

    // 根据标题级别设置样式
    const getHeadingStyle = () => {
      const baseStyle = {
        minHeight: "24px",
        padding: "8px 12px",
        border: "1px solid #e1e5e9",
        borderRadius: "4px",
        outline: "none",
        cursor: "text",
        marginBottom: "8px",
        fontWeight: "bold" as const,
      };

      switch (headingLevel) {
        case "h1":
          return { ...baseStyle, fontSize: "32px", lineHeight: "1.2" };
        case "h2":
          return { ...baseStyle, fontSize: "24px", lineHeight: "1.3" };
        case "h3":
          return { ...baseStyle, fontSize: "20px", lineHeight: "1.4" };
        default:
          return baseStyle;
      }
    };

    // 动态创建对应的标题元素
    const HeadingElement = headingLevel;

    return (
      <HeadingElement
        ref={elementRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        style={getHeadingStyle()}
        data-placeholder={placeholder}
        dangerouslySetInnerHTML={{ __html: block.content }}
      />
    );
  },
);

export const HeadingBlock = memo(HeadingBlockComponent);

