import { forwardRef, memo, useState } from "react";
import type { BaseBlockProps, BlockHandle } from "../types/blockComponent";
import type { BlockType } from "../types/block";
import { BlockFactory } from "./blocks";
import { BlockTypeSelector } from "./BlockTypeSelector";

const BlockWrapperComponent = forwardRef<BlockHandle, BaseBlockProps>(
  ({ block, onTypeChange, ...props }, ref) => {
    const [showTypeSelector, setShowTypeSelector] = useState(false);

    const handleTypeChange = (newType: BlockType) => {
      if (onTypeChange) {
        onTypeChange(block.id, newType);
      }
    };

    return (
      <div
        style={{
          position: "relative",
          marginBottom: "4px"
        }}
        onMouseEnter={() => setShowTypeSelector(true)}
        onMouseLeave={() => setShowTypeSelector(false)}
      >
        {/* 类型选择器 - 鼠标悬停时显示 */}
        {showTypeSelector && (
          <div
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              zIndex: 10,
            }}
          >
            <BlockTypeSelector
              currentType={block.type}
              onTypeChange={handleTypeChange}
            />
          </div>
        )}

        {/* 实际的块组件 */}
        <BlockFactory
          ref={ref}
          blockType={block.type}
          block={block}
          onTypeChange={onTypeChange}
          {...props}
        />
      </div>
    );
  }
);

export const BlockWrapper = memo(BlockWrapperComponent);
