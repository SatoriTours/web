import React from 'react';

/**
 * 通用搜索输入组件
 * @param {Object} props
 * @param {string} props.placeholder - 占位符文本
 * @param {function} props.onChange - 值变化回调
 * @param {string} props.value - 输入框值
 */
const SearchInput = ({ placeholder, onChange, value = '' }) => {
  return (
    <div className="p-2">
      <div className="input-group mb-3">
        <span className="input-group-text bg-white border-end-0">
          <i className="bi bi-search text-muted"></i>
        </span>
        <input
          type="text"
          className="form-control border-start-0"
          placeholder={placeholder || "搜索..."}
          aria-label={placeholder || "搜索"}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default SearchInput;
