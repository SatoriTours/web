import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { marked } from 'marked';
import MDEditor from '@uiw/react-md-editor';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import diaryData from '../assets/data/diary.json';

const Diary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    // 从localStorage获取保存的宽度，如果没有则使用默认值30%
    const savedWidth = localStorage.getItem('sidebarWidth');
    return savedWidth ? parseFloat(savedWidth) : 30;
  });
  const [isResizing, setIsResizing] = useState(false);
  const [colorMode, setColorMode] = useState('light'); // 默认亮色模式
  const sidebarRef = useRef(null);
  const containerRef = useRef(null);

  // 从JSON文件和localStorage加载日记条目
  useEffect(() => {
    const loadEntries = () => {
      try {
        // 首先检查localStorage中是否已有数据
        const savedEntries = localStorage.getItem('diaryEntries');
        if (savedEntries) {
          // 如果localStorage有数据，使用它
          setEntries(JSON.parse(savedEntries));
        } else {
          // 否则使用JSON文件中的初始数据
          setEntries(diaryData);
          // 将初始数据也保存到localStorage
          localStorage.setItem('diaryEntries', JSON.stringify(diaryData));
        }
        console.log('日记数据加载成功');
      } catch (error) {
        console.error('加载日记数据失败:', error);
        // 如果出错，至少显示JSON文件中的数据
        setEntries(diaryData);
      } finally {
        setIsLoading(false);
      }
    };

    // 加载颜色模式设置
    const savedColorMode = localStorage.getItem('colorMode');
    if (savedColorMode) {
      setColorMode(savedColorMode);
    }

    loadEntries();
  }, []);

  // 保存颜色模式设置并应用到body
  useEffect(() => {
    localStorage.setItem('colorMode', colorMode);

    if (colorMode === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [colorMode]);

  // 切换颜色模式
  const toggleColorMode = () => {
    setColorMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  // 加载选中的日记
  useEffect(() => {
    if (id && entries.length > 0) {
      const entry = entries.find(entry => entry.id.toString() === id);
      setSelectedEntry(entry);
      if (entry) {
        setEditTitle(entry.title);
        setEditContent(entry.content);
      }
    } else if (entries.length > 0) {
      setSelectedEntry(entries[0]);
      setEditTitle(entries[0].title);
      setEditContent(entries[0].content);
    }
  }, [id, entries]);

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
    setSelectedEntry(newEntry);
    setEditTitle(newEntry.title);
    setEditContent(newEntry.content);
    setIsEditing(true);
  };

  // 删除日记
  const handleDeleteEntry = (id, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (window.confirm('确定要删除这篇日记吗？此操作不可撤销。')) {
      const updatedEntries = entries.filter(entry => entry.id !== id);
      localStorage.setItem('diaryEntries', JSON.stringify(updatedEntries));
      setEntries(updatedEntries);

      if (selectedEntry && selectedEntry.id === id) {
        setSelectedEntry(updatedEntries.length > 0 ? updatedEntries[0] : null);
        if (updatedEntries.length > 0) {
          setEditTitle(updatedEntries[0].title);
          setEditContent(updatedEntries[0].content);
        }
      }
    }
  };

  // 开始编辑日记
  const handleStartEditing = () => {
    if (selectedEntry) {
      setEditTitle(selectedEntry.title);
      setEditContent(selectedEntry.content);
      setIsEditing(true);
    }
  };

  // 保存编辑的日记
  const handleSaveEntry = () => {
    if (!selectedEntry) return;

    setIsSaving(true);
    setSaveStatus('保存中...');

    setTimeout(() => {
      const updatedEntry = {
        ...selectedEntry,
        title: editTitle,
        content: editContent,
        updatedAt: new Date().toISOString()
      };

      const updatedEntries = entries.map(e =>
        e.id === updatedEntry.id ? updatedEntry : e
      );

      localStorage.setItem('diaryEntries', JSON.stringify(updatedEntries));
      setEntries(updatedEntries);
      setSelectedEntry(updatedEntry);
      setIsEditing(false);
      setIsSaving(false);
      setSaveStatus('已保存');

      // 3秒后清除状态消息
      setTimeout(() => {
        setSaveStatus('');
      }, 3000);
    }, 500);
  };

  // 取消编辑
  const handleCancelEditing = () => {
    if (selectedEntry) {
      setEditTitle(selectedEntry.title);
      setEditContent(selectedEntry.content);
    }
    setIsEditing(false);
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

  // 选择日记
  const handleSelectEntry = (entry) => {
    setSelectedEntry(entry);
    setEditTitle(entry.title);
    setEditContent(entry.content);
    if (isEditing) {
      setIsEditing(false);
    }
  };

  // 重置为初始数据
  const handleResetToDefault = () => {
    if (window.confirm('确定要重置为初始数据吗？您创建的所有日记都将丢失。')) {
      setEntries(diaryData);
      localStorage.setItem('diaryEntries', JSON.stringify(diaryData));
      if (diaryData.length > 0) {
        setSelectedEntry(diaryData[0]);
        setEditTitle(diaryData[0].title);
        setEditContent(diaryData[0].content);
      }
    }
  };

  // 处理拖拽开始
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
    document.body.classList.add('resizing');
  };

  // 处理拖拽过程
  const handleMouseMove = (e) => {
    if (!isResizing || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

    // 限制宽度范围
    if (newWidth >= 15 && newWidth <= 50) {
      setSidebarWidth(newWidth);
    }
  };

  // 处理拖拽结束
  const handleMouseUp = () => {
    setIsResizing(false);
    document.body.classList.remove('resizing');

    // 保存当前宽度到localStorage
    localStorage.setItem('sidebarWidth', sidebarWidth.toString());
  };

  // 添加和移除全局事件监听器
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div ref={containerRef} className="container-fluid bg-light">
      <div className="row" style={{height: 'calc(100vh - 56px)'}}>
        {/* 左侧列表 */}
        <div
          ref={sidebarRef}
          className="p-0 border-end position-relative shadow-sm"
          style={{
            height: '100%',
            overflow: 'auto',
            width: `${sidebarWidth}%`,
            transition: isResizing ? 'none' : 'width 0.2s ease',
            backgroundColor: 'white'
          }}
        >
          <div className="resizer" onMouseDown={handleMouseDown}></div>
          <div className="p-3 border-bottom d-flex justify-content-between align-items-center" style={{backgroundColor: 'var(--primary-50)'}}>
            <div className="d-flex align-items-center">
              <div className="bg-primary bg-gradient rounded-circle p-2 me-2 text-white">
                <i className="bi bi-journal-text"></i>
              </div>
              <div>
                <h5 className="mb-0 fw-bold fs-6">我的日记</h5>
                <small className="text-muted">{entries.length} 篇日记</small>
              </div>
            </div>
            <div>
              <button
                className="btn btn-sm btn-outline-secondary me-2"
                onClick={toggleColorMode}
                title={colorMode === 'light' ? '切换到暗色模式' : '切换到亮色模式'}
              >
                <i className={`bi ${colorMode === 'light' ? 'bi-moon' : 'bi-sun'}`}></i>
              </button>
              <button
                className="btn btn-sm btn-outline-secondary me-2"
                onClick={handleResetToDefault}
                title="重置为初始数据"
              >
                <i className="bi bi-arrow-counterclockwise"></i>
              </button>
              <button
                className="btn btn-sm btn-primary"
                onClick={handleCreateNewEntry}
              >
                <i className="bi bi-plus"></i>
                <span className="ms-1 d-none d-md-inline">新建</span>
              </button>
            </div>
          </div>

          <div className="p-2">
            <div className="input-group mb-3">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="搜索日记..."
                aria-label="搜索日记"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">加载中...</span>
              </div>
              <p className="mt-3 text-muted">正在加载日记数据...</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-5">
              <div className="py-5">
                <div className="bg-light rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{width: '80px', height: '80px'}}>
                  <i className="bi bi-journal-text display-4 text-primary opacity-75"></i>
                </div>
                <h5 className="mb-2">还没有日记</h5>
                <p className="text-muted mb-4">记录你的思考、灵感和日常</p>
                <button className="btn btn-primary" onClick={handleCreateNewEntry}>
                  <i className="bi bi-plus me-1"></i>写新日记
                </button>
              </div>
            </div>
          ) : (
            <div className="list-group list-group-flush fade-in">
              {entries.map((entry, index) => (
                <div
                  key={entry.id || index}
                  className={`list-group-item list-group-item-action border-0 border-bottom position-relative ${selectedEntry && selectedEntry.id === entry.id ? 'active' : ''}`}
                  onClick={() => handleSelectEntry(entry)}
                >
                  <div className="d-flex justify-content-between align-items-start py-2">
                    <div className="w-100 pe-2">
                      <h6 className="mb-1 text-truncate fw-medium">{entry.title}</h6>
                      <p className="mb-1 small text-muted">
                        <i className="bi bi-calendar2 me-1"></i>
                        {formatDate(entry.createdAt)}
                      </p>
                      <p className="mb-0 small text-muted text-wrap overflow-hidden summary-text" style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        textOverflow: 'ellipsis',
                        lineHeight: '1.4'
                      }}>
                        {getEntrySummary(entry.content)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteEntry(entry.id, e);
                      }}
                      className="btn btn-sm btn-outline-danger border-0 ms-auto rounded-circle p-0 d-flex align-items-center justify-content-center"
                      style={{
                        opacity: 0,
                        transition: 'opacity 0.2s ease',
                        width: '24px',
                        height: '24px'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.opacity = 1}
                      onMouseOut={(e) => e.currentTarget.style.opacity = 0}
                      title="删除"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 右侧详情 */}
        <div className="p-0 bg-white" style={{
          height: '100%',
          overflow: 'auto',
          width: `${100 - sidebarWidth}%`,
          transition: isResizing ? 'none' : 'width 0.2s ease'
        }}>
          {selectedEntry ? (
            <div className="p-4">
              {isEditing ? (
                /* 编辑模式 */
                <div className="slide-in-up">
                  <div className="card border-0 shadow-sm p-3 mb-3">
                    <div className="mb-3 d-flex justify-content-between align-items-center">
                      <input
                        type="text"
                        className="form-control form-control-lg border-0 px-0 fw-bold"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="日记标题"
                      />
                      <div>
                        {saveStatus && (
                          <span className="badge bg-success me-2"><i className="bi bi-check-circle me-1"></i>{saveStatus}</span>
                        )}
                        <div className="btn-group">
                          <button
                            onClick={handleCancelEditing}
                            className="btn btn-outline-secondary"
                          >
                            <i className="bi bi-x me-1"></i>取消
                          </button>
                          <button
                            onClick={handleSaveEntry}
                            disabled={isSaving}
                            className="btn btn-primary"
                          >
                            {isSaving ? <><span className="spinner-border spinner-border-sm me-1"></span>保存中...</> : <><i className="bi bi-check me-1"></i>保存</>}
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="text-muted small">
                      <i className="bi bi-calendar-check me-1"></i>
                      创建于 {formatDate(selectedEntry.createdAt)}
                      {selectedEntry.createdAt !== selectedEntry.updatedAt &&
                        <><i className="bi bi-pencil ms-2 me-1"></i>更新于 {formatDate(selectedEntry.updatedAt)}</>}
                    </p>
                  </div>
                  <div data-color-mode={colorMode} className="card border-0 shadow-sm p-2">
                    <MDEditor
                      value={editContent}
                      onChange={setEditContent}
                      height={500}
                      preview="edit"
                    />
                  </div>
                </div>
              ) : (
                /* 查看模式 */
                <div>
                  <div className="mb-4 d-flex justify-content-between align-items-start border-bottom pb-3">
                    <div>
                      <h2 className="h3 mb-1 fw-bold">{selectedEntry.title || '无标题日记'}</h2>
                      <p className="text-muted small">
                        <i className="bi bi-calendar3 me-1"></i>
                        创建于 {formatDate(selectedEntry.createdAt)}
                        {selectedEntry.createdAt !== selectedEntry.updatedAt &&
                          <span className="ms-2">
                            <i className="bi bi-pencil me-1"></i>
                            更新于 {formatDate(selectedEntry.updatedAt)}
                          </span>
                        }
                      </p>
                    </div>
                    <button
                      onClick={handleStartEditing}
                      className="btn btn-outline-primary"
                    >
                      <i className="bi bi-pencil me-1"></i>
                      编辑
                    </button>
                  </div>
                  <div
                    className={`markdown-content py-2 rounded-3 ${colorMode === 'dark' ? 'text-light' : ''}`}
                    dangerouslySetInnerHTML={{ __html: marked(selectedEntry.content) }}
                  ></div>
                </div>
              )}
            </div>
          ) : (
            <div className="empty-state">
              <div className="card border-0 shadow-sm p-5 text-center" style={{maxWidth: '400px'}}>
                <i className="bi bi-journal-text display-4 mb-3 empty-state-icon"></i>
                <h3 className="h5 mb-3">没有选中的日记</h3>
                <p className="text-muted mb-4">从左侧列表选择一篇日记，或者创建新的日记</p>
                <button
                  className="btn btn-primary mx-auto"
                  style={{width: 'fit-content'}}
                  onClick={handleCreateNewEntry}
                >
                  <i className="bi bi-plus-circle me-1"></i>
                  新建日记
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Diary;
