import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useState } from 'react'

interface MarkState {
  bold: boolean;
  italic: boolean;
  underline: boolean;
}

interface NodeState {
  heading: HeadingState;
  bulletList: boolean;
  paragraph: boolean;
}

interface HeadingState {
  level: number | null;
  active: boolean;
}

interface SelectionState {
  hasSelection: boolean;
  markState: MarkState;
  nodeState: NodeState;
}


export const SimpleEditor = () => {
  const [content, setContent] = useState('<h1>Reditor</h1><p>一个基于 TipTap 的富文本编辑器</p>')
  const [showPretty, setShowPretty] = useState(false)

  const [selectionState, setSelectionState] = useState<SelectionState>({
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

  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML())
    },
    onSelectionUpdate: ({ editor }) => {
      const newSelectionState: SelectionState = {
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

      setSelectionState(newSelectionState)
    },
    editorProps: {
      attributes: {
        style: 'outline: none; min-height: 200px; padding: 16px; line-height: 1.6;',
      },
    },
  })

  // 获取当前激活的标题级别
  const getActiveHeadingLevel = (editor: Editor) => {
    for (let level = 1; level <= 6; level++) {
      if (editor.isActive('heading', { level })) {
        return level
      }
    }
    return null
  }

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
              setSelectionState(prev => ({...prev, markState: {...prev.markState, bold: !prev.markState.bold}}))
            }}
            style={buttonStyle(selectionState.markState.bold)}
          >
            加粗
          </button>
          <button
            onClick={() => {
              editor.chain().focus().toggleItalic().run()
              setSelectionState(prev => ({...prev, markState: {...prev.markState, italic: !prev.markState.italic}}))
            }}
            style={buttonStyle(selectionState.markState.italic)}
          >
            斜体
          </button>
          <button
            onClick={() => {
              editor.chain().focus().toggleHeading({ level: 1 }).run()
              setSelectionState(prev => ({...prev, nodeState: {...prev.nodeState, heading: {level: prev.nodeState.heading.level === 1 ? null : 1, active: true}}}))
            }}
            style={buttonStyle(selectionState.nodeState.heading.level === 1)}
          >
            H1
          </button>
          <button
            onClick={() => {
              editor.chain().focus().toggleHeading({ level: 2 }).run()
              setSelectionState(prev => ({...prev, nodeState: {...prev.nodeState, heading: {level: prev.nodeState.heading.level === 2 ? null : 2, active: true}}}))
            }}
            style={buttonStyle(selectionState.nodeState.heading.level === 2)}
          >
            H2
          </button>
          <button
            onClick={() => {
              editor.chain().focus().toggleBulletList().run()
              setSelectionState(prev => ({...prev, nodeState: {...prev.nodeState, bulletList: !prev.nodeState.bulletList}}))
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
