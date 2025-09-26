import { memo, forwardRef } from "react";
import type { BaseBlockProps, BlockHandle } from "../../types/blockComponent";
import type { BlockType } from "../../types/block";
import { blockRegistry } from "./BlockRegistry";

interface BlockFactoryProps extends BaseBlockProps {
  blockType: BlockType;
}

const BlockFactoryComponent = forwardRef<BlockHandle, BlockFactoryProps>(
  ({ blockType, ...props }, ref) => {
    // 从注册表获取对应的组件，如果找不到则使用段落作为默认
    const registryItem = blockRegistry[blockType] || blockRegistry.paragraph;
    const Component = registryItem.component;

    return <Component ref={ref} {...props} />;
  }
);

export const BlockFactory = memo(BlockFactoryComponent);
