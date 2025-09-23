// 块的基础数据结构
export interface BlockData {
  id: string;           // 唯一标识符
  content: string;      // 块内容
  type: 'paragraph';    // 块类型（阶段3会扩展更多类型）
}

// 生成唯一ID的工具函数
export const generateBlockId = (): string => {
  return `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// 创建新块的工具函数
export const createBlock = (content: string = '', type: 'paragraph' = 'paragraph'): BlockData => ({
  id: generateBlockId(),
  content,
  type,
});