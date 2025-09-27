import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useState } from 'react'
import type { SelectionState } from '../types/editor'
import { getSelectionState, createInitialSelectionState } from '../utils/editor'

export const SimpleEditor = () => {
  const [content, setContent] = useState('<h1>Reditor</h1><p>一个基于 TipTap 的富文本编辑器</p>')
  const [showPretty, setShowPretty] = useState(false)

  const [selectionState, setSelectionState] = useState<SelectionState>(createInitialSelectionState())

  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML())
    },
    onSelectionUpdate: ({ editor }) => {
      setSelectionState(getSelectionState(editor))
    },
    editorProps: {
      attributes: {
        style: 'outline: none; min-height: 200px; padding: 16px; line-height: 1.6;',
      },
    },
  })


  if (!editor) {
    return <div>Loading...</div>
  }

  const buttonStyle = (isActive: boolean) => ({
    padding: '8px 12px',
    borderRadius: '4px',
    fontSize: '14px',
    border: '1px solid #ddd',
    backgroundColor: isActive ? '#3b82f6' : '#fff',
    color: isActive ? '#fff' : '#333',
    cursor: 'pointer',
    marginRight: '8px',
    marginBottom: '4px'
  })

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
        {/* 工具栏 */}
        <div style={{
          backgroundColor: '#f9fafb',
          borderBottom: '1px solid #ddd',
          padding: '12px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4px'
        }}>
          <button
            onClick={() => {
              editor.chain().focus().toggleBold().run()
              setSelectionState(getSelectionState(editor))
            }}
            style={buttonStyle(selectionState.markState.bold)}
          >
            加粗
          </button>
          <button
            onClick={() => {
              editor.chain().focus().toggleItalic().run()
              setSelectionState(getSelectionState(editor))
            }}
            style={buttonStyle(selectionState.markState.italic)}
          >
            斜体
          </button>
          <button
            onClick={() => {
              editor.chain().focus().toggleHeading({ level: 1 }).run()
              setSelectionState(getSelectionState(editor))
            }}
            style={buttonStyle(selectionState.nodeState.heading.level === 1)}
          >
            H1
          </button>
          <button
            onClick={() => {
              editor.chain().focus().toggleHeading({ level: 2 }).run()
              setSelectionState(getSelectionState(editor))
            }}
            style={buttonStyle(selectionState.nodeState.heading.level === 2)}
          >
            H2
          </button>
          <button
            onClick={() => {
              editor.chain().focus().toggleBulletList().run()
              setSelectionState(getSelectionState(editor))
            }}
            style={buttonStyle(selectionState.nodeState.bulletList)}
          >
            列表
          </button>
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            style={{
              ...buttonStyle(false),
              opacity: editor.can().chain().focus().undo().run() ? 1 : 0.5,
              cursor: editor.can().chain().focus().undo().run() ? 'pointer' : 'not-allowed'
            }}
          >
            撤销
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            style={{
              ...buttonStyle(false),
              opacity: editor.can().chain().focus().redo().run() ? 1 : 0.5,
              cursor: editor.can().chain().focus().redo().run() ? 'pointer' : 'not-allowed'
            }}
          >
            重做
          </button>
        </div>

        {/* 编辑器内容 */}
        <div style={{ backgroundColor: '#fff', minHeight: '200px' }}>
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* 实时显示 HTML 输出 */}
      <div style={{
        marginTop: '24px',
        padding: '16px',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', margin: 0 }}>HTML 输出：</h3>
          <button
            onClick={() => setShowPretty(!showPretty)}
            style={{
              padding: '4px 8px',
              fontSize: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: '#fff',
              cursor: 'pointer',
              color: '#666'
            }}
          >
            {showPretty ? '紧凑' : '换行'}
          </button>
        </div>
        <pre style={{
          fontSize: '12px',
          overflow: 'auto',
          backgroundColor: '#fff',
          padding: '12px',
          borderRadius: '4px',
          border: '1px solid #ddd',
          whiteSpace: showPretty ? 'pre-wrap' : 'nowrap',
          lineHeight: '1.4',
          fontFamily: 'Monaco, Consolas, "Courier New", monospace',
          wordBreak: 'break-word'
        }}>
          {showPretty ? content.replace(/></g, '>\n<') : content}
        </pre>
      </div>
    </div>
  )
}
