import type { Editor } from '@tiptap/react'
import type { SelectionState } from '../types/editor'

/**
 * 获取当前激活的标题级别
 * @param editor {Editor} - TipTap 编辑器实例
 * @returns {number | null} - 返回当前激活的标题级别（1-6），如果没有激活标题则返回 null
 */
export const getActiveHeadingLevel = (editor: Editor): number | null => {
  for (let level = 1; level <= 6; level++) {
    if (editor.isActive('heading', { level })) {
      return level
    }
  }
  return null
}

/**
 * 获取当前选择状态
 * @param editor {Editor} - TipTap 编辑器实例
 * @returns {SelectionState} - 返回当前选择状态对象
 */
export const getSelectionState = (editor: Editor): SelectionState => {
  return {
    hasSelection: !editor.state.selection.empty,
    markState: {
      bold: editor.isActive('bold'),
      italic: editor.isActive('italic'),
      underline: editor.isActive('underline'),
    },
    nodeState: {
      heading: {
        level: getActiveHeadingLevel(editor),
        active: editor.isActive('heading')
      },
      bulletList: editor.isActive('bulletList'),
      paragraph: editor.isActive('paragraph'),
    }
  }
}

/**
 * 创建初始的选择状态对象
 * @returns {SelectionState} - 返回初始的选择状态对象
 */
export const createInitialSelectionState = (): SelectionState => ({
  hasSelection: false,
  markState: {
    bold: false,
    italic: false,
    underline: false,
  },
  nodeState: {
    heading: { level: null, active: false },
    bulletList: false,
    paragraph: false,
  }
})
