import React, { useRef } from 'react';

/**
 * 通用侧边栏组件
 * @param {Object} props
 * @param {React.ReactNode} props.header - 侧边栏头部内容
 * @param {React.ReactNode} props.children - 侧边栏主体内容
 * @param {number} props.width - 侧边栏宽度百分比
 * @param {boolean} props.isResizing - 是否正在调整大小
 * @param {Function} props.onResizeStart - 开始调整大小的处理函数
 */
const Sidebar = ({
  header,
  children,
  width = 30,
  isResizing = false,
  onResizeStart
}) => {
  const sidebarRef = useRef(null);

  return (
    <div
      ref={sidebarRef}
      className="p-0 border-end position-relative shadow-sm"
      style={{
        height: '100%',
        overflow: 'auto',
        width: `${width}%`,
        transition: isResizing ? 'none' : 'width 0.2s ease',
        backgroundColor: 'white'
      }}
    >
      <button
        className="resizer"
        onMouseDown={onResizeStart}
        aria-label="调整侧边栏宽度"
        tabIndex={0}
        role="separator"
      ></button>

      {/* 侧边栏头部 */}
      <div className="sticky-top bg-white border-bottom">
        {header}
      </div>

      {/* 侧边栏内容 */}
      {children}
    </div>
  );
};

export default Sidebar;
