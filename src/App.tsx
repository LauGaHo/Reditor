import { useState, useCallback } from "react";
import { Block } from "./components";
import "./App.css";

function App() {
  // 分离关注点：初始内容和实时内容
  const INITIAL_CONTENT = "Hello World! 🌎️"; // 固定的初始值
  const [currentContent, setCurrentContent] = useState(INITIAL_CONTENT); // 用于调试显示

  const handleContentChange = useCallback((content: string) => {
    setCurrentContent(content); // 只更新调试信息
    console.log("内容变化:", content);
  }, []); // 稳定的函数引用

  return (
    <div className="app">
      <h1>Reditor</h1>
      <p>A Notion-like editor built with React and Tiptap</p>

      {/* 调试信息：显示当前内容 */}
      <div
        style={{
          marginBottom: "20px",
          padding: "10px",
          backgroundColor: "#f5f5f5",
          borderRadius: "4px",
          fontSize: "14px",
        }}
      >
        <strong>当前内容:</strong> {currentContent || "(空)"}
      </div>

      <Block
        initialContent={INITIAL_CONTENT}
        placeholder="开始输入..."
        onContentChange={handleContentChange}
      />

      <p style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
        💡 试试输入文本，观察状态变化！按 Enter 可以看到控制台日志。
      </p>
    </div>
  );
}

export { App };
