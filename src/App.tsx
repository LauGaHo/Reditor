import { useState, useCallback } from "react";
import { MultiBlockEditor } from "./components";
import type { BlockData } from "./types/block";
import "./App.css";

function App() {
  // 管理所有块的状态
  const [allBlocks, setAllBlocks] = useState<BlockData[]>([]);

  const handleBlocksChange = useCallback((blocks: BlockData[]) => {
    setAllBlocks(blocks);
  }, []);

  return (
    <div className="app">
      <h1>Reditor</h1>
      <p>A Notion-like editor built with React and Tiptap</p>

      {/* 调试信息：显示所有块 */}
      <div
        style={{
          marginBottom: "20px",
          padding: "10px",
          backgroundColor: "#f5f5f5",
          borderRadius: "4px",
          fontSize: "14px",
        }}
      >
        <strong>多块编辑器状态:</strong>
        <div>总块数: {allBlocks.length}</div>
        <div>
          块内容预览:{" "}
          {allBlocks
            .map((b, i) => `${i + 1}. "${b.content.slice(0, 15)}..."`)
            .join(" | ")}
        </div>
      </div>

      <MultiBlockEditor onBlocksChange={handleBlocksChange} />

      <p style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
        💡 试试输入文本！按 <kbd>Enter</kbd> 创建新块，在空块中按{" "}
        <kbd>Backspace</kbd> 删除块。
      </p>
    </div>
  );
}

export { App };
