import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">我的日记</h1>
        <button
          onClick={handleCreateNewEntry}
          className="btn btn-primary flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          新建日记
        </button>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">还没有日记，创建一篇吧！</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map(entry => (
            <Link
              key={entry.id}
              to={`/diary/${entry.id}`}
              className="block"
            >
              <div className="card hover:shadow-lg transition-shadow h-full flex flex-col">
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start">
                    <h2 className="text-lg font-semibold text-gray-900 truncate">{entry.title}</h2>
                    <button
                      onClick={(e) => handleDeleteEntry(entry.id, e)}
                      className="text-gray-400 hover:text-gray-600"
                      title="删除"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDate(entry.updatedAt)}
                  </p>
                  <p className="text-sm text-gray-700 mt-4 line-clamp-3">
                    {getEntrySummary(entry.content)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Diary;
