import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * 通用可调整大小组件的Hook
 * @param {Object} options
 * @param {number} options.defaultWidth - 默认宽度百分比
 * @param {number} options.minWidth - 最小宽度百分比
 * @param {number} options.maxWidth - 最大宽度百分比
 * @param {string} options.storageKey - localStorage存储键名
 * @returns {Object} 包含宽度、调整状态和各种处理函数
 */
const useResizable = ({
  defaultWidth = 30,
  minWidth = 15,
  maxWidth = 50,
  storageKey = 'sidebarWidth'
}) => {
  // 从localStorage获取保存的宽度，如果没有则使用默认值
  const [width, setWidth] = useState(() => {
    const savedWidth = localStorage.getItem(storageKey);
    return savedWidth ? parseFloat(savedWidth) : defaultWidth;
  });

  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef(null);

  // 处理拖拽开始
  const handleResizeStart = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
    document.body.classList.add('resizing');
  }, []);

  // 处理拖拽过程
  const handleResizeMove = useCallback((e) => {
    if (!isResizing || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

    // 限制宽度范围
    if (newWidth >= minWidth && newWidth <= maxWidth) {
      setWidth(newWidth);
    }
  }, [isResizing, minWidth, maxWidth]);

  // 处理拖拽结束
  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    document.body.classList.remove('resizing');

    // 保存当前宽度到localStorage
    localStorage.setItem(storageKey, width.toString());
  }, [width, storageKey]);

  // 添加和移除全局事件监听器
  useEffect(() => {
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);

    return () => {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
  }, [handleResizeMove, handleResizeEnd]);

  return {
    width,
    isResizing,
    containerRef,
    handleResizeStart,
    remainingWidth: 100 - width
  };
};

export default useResizable;
