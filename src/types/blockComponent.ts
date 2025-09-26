import type { BlockData, BlockType } from "./block";

// 基础块组件属性接口
export interface BaseBlockProps {
  block: BlockData;
  placeholder?: string;
  onContentChange?: (blockId: string, content: string) => void;
  onEnterPress?: (blockId: string) => void;
  onDeleteBlock?: (blockId: string) => void;
  onTypeChange?: (blockId: string, newType: BlockType) => void;
}

// 块组件的对外接口
export interface BlockHandle {
  focus: () => void;
  blur?: () => void;
  getContent?: () => string;
}

// 块注册项接口
export interface BlockRegistryItem {
  component: React.ForwardRefExoticComponent<BaseBlockProps & React.RefAttributes<BlockHandle>>;
  displayName: string;
  icon?: string;
  defaultContent?: string;
}