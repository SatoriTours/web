import React from 'react';

/**
 * 通用部分标题组件
 * @param {Object} props
 * @param {string} props.icon - 图标类名
 * @param {string} props.title - 标题文本
 * @param {number} props.count - 可选的计数
 * @param {React.ReactNode} props.actions - 右侧操作按钮
 */
const SectionHeader = ({ icon, title, count, actions }) => {
  return (
    <div className="d-flex justify-content-between p-3 border-bottom">
      <div className="d-flex align-items-center">
        <i className={`${icon} text-primary me-2`}></i>
        <span className="fw-medium">
          {title} {count !== undefined && count >= 0 ? count : ''}
        </span>
      </div>
      <div className="d-flex gap-2">
        {actions}
      </div>
    </div>
  );
};

export default SectionHeader;
