import React from 'react';

/**
 * 通用加载状态组件
 * @param {Object} props
 * @param {string} props.message - 显示的加载消息
 */
const LoadingState = ({ message = "正在加载..." }) => {
  return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">加载中...</span>
      </div>
      <p className="mt-3 text-muted">{message}</p>
    </div>
  );
};

export default LoadingState;
