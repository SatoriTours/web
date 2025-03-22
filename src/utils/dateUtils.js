/**
 * 格式化日期（相对时间）
 * @param {string} dateString - ISO格式的日期字符串
 * @returns {string} 格式化后的日期字符串
 */
export const formatRelativeDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return `今天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  } else if (diffDays === 1) {
    return '昨天';
  } else if (diffDays < 7) {
    return `${diffDays}天前`;
  } else {
    return date.toLocaleDateString('zh-CN', {
      month: 'numeric',
      day: 'numeric'
    });
  }
};

/**
 * 格式化日期（完整格式）
 * @param {string} dateString - ISO格式的日期字符串
 * @returns {string} 完整格式的日期字符串
 */
export const formatFullDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * 获取当前时间的ISO字符串
 * @returns {string} ISO格式的日期字符串
 */
export const getNowISOString = () => {
  return new Date().toISOString();
};
