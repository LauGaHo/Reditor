import type { BlockType } from "../../types/block";
import type { BlockRegistryItem } from "../../types/blockComponent";
import { ParagraphBlock } from "./ParagraphBlock";
import { H1Block, H2Block, H3Block } from "./HeadingWrappers";

// 块类型注册表
export const blockRegistry: Record<BlockType, BlockRegistryItem> = {
  paragraph: {
    component: ParagraphBlock,
    displayName: "段落",
    defaultContent: "",
  },
  h1: {
    component: H1Block,
    displayName: "标题 1",
    defaultContent: "",
  },
  h2: {
    component: H2Block,
    displayName: "标题 2",
    defaultContent: "",
  },
  h3: {
    component: H3Block,
    displayName: "标题 3",
    defaultContent: "",
  },
};

// 获取块类型的显示名称
export const getBlockDisplayName = (type: BlockType): string => {
  return blockRegistry[type]?.displayName || "未知类型";
};

// 获取所有可用的块类型
export const getAvailableBlockTypes = (): BlockType[] => {
  return Object.keys(blockRegistry) as BlockType[];
};