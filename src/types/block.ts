// 块类型定义
export type BlockType = 'paragraph' | 'h1' | 'h2' | 'h3';

// 块的基础数据结构
export interface BlockData {
  id: string;           // 唯一标识符
  content: string;      // 块内容
  type: BlockType;      // 块类型
}

// 生成唯一ID的工具函数
export const generateBlockId = (): string => {
  return `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// 创建新块的工具函数
export const createBlock = (content: string = '', type: BlockType = 'paragraph'): BlockData => ({
  id: generateBlockId(),
  content,
  type,
});