import React from 'react';

/**
 * 通用空状态组件
 * @param {Object} props
 * @param {string} props.icon - Bootstrap图标类名
 * @param {string} props.title - 标题文本
 * @param {string} props.description - 描述文本
 * @param {React.ReactNode} props.action - 可选的操作按钮
 */
const EmptyState = ({ icon, title, description, action }) => {
  return (
    <div className="text-center py-5">
      <div className="py-5">
        <div className="bg-light rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{width: '80px', height: '80px'}}>
          <i className={`${icon} display-4 text-primary opacity-75`}></i>
        </div>
        <h5 className="mb-2">{title}</h5>
        <p className="text-muted mb-4">{description}</p>
        {action}
      </div>
    </div>
  );
};

export default EmptyState;
