import { useState, useRef, useEffect } from "react";
import type { BlockType } from "../types/block";
import { getAvailableBlockTypes, getBlockDisplayName } from "./blocks";

interface BlockTypeSelectorProps {
  currentType: BlockType;
  onTypeChange: (newType: BlockType) => void;
}

export const BlockTypeSelector = ({ currentType, onTypeChange }: BlockTypeSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const availableTypes = getAvailableBlockTypes();

  const handleTypeSelect = (type: BlockType) => {
    onTypeChange(type);
    setIsOpen(false);
  };

  return (
    <div ref={selectorRef} style={{ position: "relative", display: "inline-block" }}>
      {/* 触发按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: "4px 8px",
          border: "1px solid #ddd",
          borderRadius: "4px",
          background: "white",
          cursor: "pointer",
          fontSize: "12px",
          color: "#666",
        }}
      >
        {getBlockDisplayName(currentType)} ▼
      </button>

      {/* 下拉菜单 */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            minWidth: "120px",
            background: "white",
            border: "1px solid #ddd",
            borderRadius: "4px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            zIndex: 1000,
          }}
        >
          {availableTypes.map((type) => (
            <button
              key={type}
              onClick={() => handleTypeSelect(type)}
              style={{
                display: "block",
                width: "100%",
                padding: "8px 12px",
                border: "none",
                background: currentType === type ? "#f0f0f0" : "transparent",
                textAlign: "left",
                cursor: "pointer",
                fontSize: "14px",
              }}
              onMouseEnter={(e) => {
                if (currentType !== type) {
                  e.currentTarget.style.background = "#f8f8f8";
                }
              }}
              onMouseLeave={(e) => {
                if (currentType !== type) {
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              {getBlockDisplayName(type)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};