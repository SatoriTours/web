/**
 * 从Markdown文本中提取纯文本摘要
 * @param {string} markdownText - Markdown格式文本
 * @param {number} maxLength - 最大长度
 * @returns {string} 提取的纯文本摘要
 */
export const extractSummaryFromMarkdown = (markdownText, maxLength = 100) => {
  if (!markdownText) return '';

  // 移除markdown标记，只保留纯文本
  const textOnly = markdownText
    .replace(/#+\s/g, '') // 去掉标题
    .replace(/\*\*/g, '') // 去掉粗体
    .replace(/\*/g, '')   // 去掉斜体
    .replace(/!\[.*?\]\(.*?\)/g, '[图片]') // 替换图片
    .replace(/\[.*?\]\(.*?\)/g, '') // 去掉链接
    .replace(/```[\s\S]*?```/g, '[代码]') // 替换代码块
    .trim();

  return textOnly.length > maxLength ? textOnly.substring(0, maxLength) + '...' : textOnly;
};

/**
 * 截断文本
 * @param {string} text - 原始文本
 * @param {number} maxLength - 最大长度
 * @returns {string} 截断后的文本
 */
export const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};
