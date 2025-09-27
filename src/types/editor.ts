// 编辑器相关的类型定义

export interface MarkState {
  bold: boolean;
  italic: boolean;
  underline: boolean;
}

export interface HeadingState {
  level: number | null;
  active: boolean;
}

export interface NodeState {
  heading: HeadingState;
  bulletList: boolean;
  paragraph: boolean;
}

export interface SelectionState {
  hasSelection: boolean;
  markState: MarkState;
  nodeState: NodeState;
}

// 可以继续扩展的类型
export interface EditorConfig {
  placeholder?: string;
  editable?: boolean;
  autofocus?: boolean;
}

export interface ToolbarConfig {
  showMarkButtons: boolean;
  showNodeButtons: boolean;
  showHistoryButtons: boolean;
}