import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Diary = () => {
  const [entries, setEntries] = useState([]);
  const navigate = useNavigate();

  // 从本地存储加载日记条目
  useEffect(() => {
    const savedEntries = localStorage.getItem('diaryEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  // 创建新日记
  const handleCreateNewEntry = () => {
    const newEntry = {
      id: Date.now(),
      title: '新日记',
      content: '# 新日记\n\n开始写下你的想法...',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedEntries = [newEntry, ...entries];
    localStorage.setItem('diaryEntries', JSON.stringify(updatedEntries));
    setEntries(updatedEntries);

    navigate(`/diary/${newEntry.id}`);
  };

  // 删除日记
  const handleDeleteEntry = (id, e) => {
    e.preventDefault();
    e.stopPropagation();

    const updatedEntries = entries.filter(entry => entry.id !== id);
    localStorage.setItem('diaryEntries', JSON.stringify(updatedEntries));
    setEntries(updatedEntries);
  };

  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 获取日记摘要
  const getEntrySummary = (content) => {
    // 移除markdown标记，只保留纯文本
    const textOnly = content
      .replace(/#+\s/g, '') // 去掉标题
      .replace(/\*\*/g, '') // 去掉粗体
      .replace(/\*/g, '')   // 去掉斜体
      .replace(/!\[.*?\]\(.*?\)/g, '[图片]') // 替换图片
      .replace(/\[.*?\]\(.*?\)/g, '') // 去掉链接
      .replace(/```[\s\S]*?```/g, '[代码]') // 替换代码块
      .trim();

    return textOnly.length > 100 ? textOnly.substring(0, 100) + '...' : textOnly;
  };

  // 获取随机卡片背景色
  const getCardColor = (id) => {
    const colors = [
      'bg-light',
      'bg-white',
      'bg-info bg-opacity-10',
      'bg-success bg-opacity-10',
      'bg-warning bg-opacity-10',
      'bg-primary bg-opacity-10'
    ];

    // 基于ID确定一个固定的颜色，使相同ID始终显示相同颜色
    const colorIndex = id % colors.length;
    return colors[colorIndex];
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3">我的日记</h1>
        <button
          onClick={handleCreateNewEntry}
          className="btn btn-primary"
        >
          <i className="bi bi-plus-lg me-2"></i>
          新建日记
        </button>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-5">
          <div className="py-5">
            <i className="bi bi-journal-text display-1 text-secondary opacity-50"></i>
            <p className="mt-3 text-muted">还没有日记，创建一篇吧！</p>
          </div>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {entries.map(entry => (
            <div key={entry.id} className="col">
              <Link
                to={`/diary/${entry.id}`}
                className="text-decoration-none text-dark"
              >
                <div className={`card h-100 shadow-sm ${getCardColor(entry.id)}`}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="card-title text-truncate mb-0">{entry.title}</h5>
                      <button
                        onClick={(e) => handleDeleteEntry(entry.id, e)}
                        className="btn btn-sm text-danger border-0"
                        title="删除"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                    <p className="card-subtitle mb-3 text-muted small">
                      <i className="bi bi-calendar-event me-1"></i>
                      {formatDate(entry.updatedAt)}
                    </p>
                    <p className="card-text" style={{ display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {getEntrySummary(entry.content)}
                    </p>
                  </div>
                  <div className="card-footer border-top-0 bg-transparent">
                    <div className="d-flex justify-content-end">
                      <span className="text-primary small">
                        查看详情 <i className="bi bi-arrow-right"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Diary;
