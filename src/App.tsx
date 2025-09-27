import { SimpleEditor } from "./components/SimpleEditor";
import "./App.css";

function App() {
  return (
    <div className="app">
      <div style={{ padding: '40px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '8px' }}>
            Reditor
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>
            基于 TipTap + ProseMirror 的富文本编辑器
          </p>
        </div>

        <SimpleEditor />

        <div style={{
          marginTop: '40px',
          textAlign: 'center',
          fontSize: '14px',
          color: '#888'
        }}>
          💡 尝试使用快捷键：<kbd>Cmd+B</kbd> 加粗，<kbd>Cmd+I</kbd> 斜体，<kbd># + 空格</kbd> 标题
        </div>
      </div>
    </div>
  );
}

export { App };
