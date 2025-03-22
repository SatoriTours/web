import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { marked } from 'marked';
import MDEditor from '@uiw/react-md-editor';
import { useTheme, ThemeMode } from '../contexts/ThemeContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { diaryApi } from '../services/api';

const Diary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { themeMode } = useTheme();
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
  const sidebarRef = useRef(null);
  const containerRef = useRef(null);
  const [error, setError] = useState(null);
  const [newDiaryTitle, setNewDiaryTitle] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAddingDiary, setIsAddingDiary] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [filteredEntries, setFilteredEntries] = useState([]);

  // 在组件加载时获取日记列表
  useEffect(() => {
    const fetchDiaryEntries = async () => {
      try {
        setIsLoading(true);
        const entries = await diaryApi.getAll();
        setEntries(entries);
        setFilteredEntries(entries);
        setIsLoading(false);
      } catch (error) {
        console.error('获取日记失败:', error);
        setError('获取日记失败，请重试');
        setIsLoading(false);
      }
    };

    fetchDiaryEntries();
  }, []);

  // 更新编辑器的暗黑/亮色模式
  useEffect(() => {
    // 不需要额外操作，使用全局主题即可
  }, [themeMode]);

  // 加载选中的日记
  useEffect(() => {
    if (id) {
      const foundEntry = entries.find(entry => entry.id === Number(id) || entry.id === id);
      if (foundEntry) {
        setSelectedEntry(foundEntry);
        setEditTitle(foundEntry.title);
        setEditContent(foundEntry.content);
      } else {
        navigate('/diary');
      }
    } else if (entries.length > 0 && !selectedEntry) {
      // 如果没有指定ID但有日记，默认选择第一篇
      setSelectedEntry(entries[0]);
      setEditTitle(entries[0].title);
      setEditContent(entries[0].content);
    }
  }, [id, entries, navigate, selectedEntry]);

  // 修改添加日记函数
  const handleAddDiary = async () => {
    if (!newDiaryTitle.trim()) {
      setError('请输入日记标题');
      return;
    }

    try {
      setIsAddingDiary(true);
      setError(null);

      const newDiary = {
        title: newDiaryTitle,
        content: `# ${newDiaryTitle}\n\n在这里写下你的想法...`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // 创建新日记
      const createdDiary = await diaryApi.create(newDiary);

      // 更新日记列表
      const updatedEntries = await diaryApi.getAll();
      setEntries(updatedEntries);

      // 选中新创建的日记
      setSelectedEntry(createdDiary);

      // 重置状态
      setNewDiaryTitle('');
      setShowAddModal(false);
      setIsAddingDiary(false);
    } catch (error) {
      setError('添加日记失败: ' + error.message);
      setIsAddingDiary(false);
    }
  };

  // 修改删除日记函数
  const handleDeleteDiary = async (diary) => {
    if (!diary || !diary.id) return;

    try {
      await diaryApi.delete(diary.id);

      // 更新日记列表
      const updatedEntries = await diaryApi.getAll();
      setEntries(updatedEntries);

      // 如果删除的是当前选中的日记，则清除选中状态
      if (selectedEntry && selectedEntry.id === diary.id) {
        setSelectedEntry(null);
      }
    } catch (error) {
      setError('删除日记失败: ' + error.message);
    }
  };

  // 保存日记内容
  const handleSaveDiary = async () => {
    if (!selectedEntry) return;

    try {
      setIsSaving(true);

      const updatedDiary = {
        ...selectedEntry,
        content: editContent,
        updatedAt: new Date().toISOString()
      };

      // 更新日记
      await diaryApi.update(selectedEntry.id, updatedDiary);

      // 更新本地状态
      const updatedEntries = entries.map(entry =>
        entry.id === selectedEntry.id ? updatedDiary : entry
      );

      setEntries(updatedEntries);
      setSelectedEntry(updatedDiary);
      setIsEditing(false);
      setIsSaving(false);
    } catch (error) {
      setError('保存日记失败: ' + error.message);
      setIsSaving(false);
    }
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

  // 处理拖拽开始（鼠标）
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
    document.body.classList.add('resizing');
  };

  // 处理拖拽开始（触摸屏）
  const handleTouchStart = (e) => {
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

  // 搜索日记
  const handleSearch = async (value) => {
    setSearchQuery(value);

    if (!value.trim()) {
      setFilteredEntries(entries);
      return;
    }

    try {
      setIsSearching(true);
      const results = await diaryApi.search(value);
      setFilteredEntries(results);
    } catch (error) {
      console.error('搜索日记失败:', error);
      setError('搜索失败，请重试');
    } finally {
      setIsSearching(false);
    }
  };

  // 延迟搜索，避免频繁请求
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery !== undefined) {
        handleSearch(searchQuery);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <div className="container-fluid p-0" ref={containerRef}>
      <div className="d-flex vh-100">
        {/* 侧边栏 */}
        <div
          ref={sidebarRef}
          className={`border-end overflow-auto ${isResizing ? 'resizing' : ''}`}
          style={{
            width: `${sidebarWidth}%`,
            flexShrink: 0,
            maxWidth: '500px',
            minWidth: '250px',
            height: '100%'
          }}
        >
          <div className="sticky-top bg-white border-bottom">
            <div className="d-flex justify-content-between p-3 border-bottom">
              <div className="d-flex align-items-center">
                <i className="bi bi-journal-text text-primary me-2"></i>
                <span className="fw-medium">我的日记</span>
              </div>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={handleResetToDefault}
                  title="重置为初始数据"
                >
                  <i className="bi bi-arrow-counterclockwise"></i>
                </button>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => setShowAddModal(true)}
                  title="新建日记"
                >
                  <i className="bi bi-plus"></i>
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {isSearching && (
                  <span className="input-group-text bg-white border-start-0">
                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                      <span className="visually-hidden">搜索中...</span>
                    </div>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="p-2">
            {isLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">加载中...</span>
                </div>
                <p className="mt-3 text-muted">正在加载日记数据...</p>
              </div>
            ) : filteredEntries.length === 0 ? (
              <div className="text-center py-5">
                {searchQuery ? (
                  <div className="py-5">
                    <div className="bg-light rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{width: '80px', height: '80px'}}>
                      <i className="bi bi-search display-4 text-secondary opacity-75"></i>
                    </div>
                    <h5 className="mb-2">未找到匹配结果</h5>
                    <p className="text-muted mb-4">尝试使用不同的关键词搜索</p>
                    <button className="btn btn-outline-secondary" onClick={() => setSearchQuery('')}>
                      清除搜索
                    </button>
                  </div>
                ) : (
                  <div className="py-5">
                    <div className="bg-light rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{width: '80px', height: '80px'}}>
                      <i className="bi bi-journal-text display-4 text-primary opacity-75"></i>
                    </div>
                    <h5 className="mb-2">还没有日记</h5>
                    <p className="text-muted mb-4">记录你的思考、灵感和日常</p>
                    <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                      <i className="bi bi-plus me-1"></i>写新日记
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="list-group list-group-flush fade-in">
                {filteredEntries.map((entry, index) => (
                  <div
                    key={entry.id || index}
                    className={`list-group-item list-group-item-action border-0 border-bottom position-relative ${selectedEntry && selectedEntry.id === entry.id ? 'active' : ''}`}
                    onClick={() => handleSelectEntry(entry)}
                  >
                    <div className="d-flex justify-content-between align-items-start py-2">
                      <div className="w-100 pe-2">
                        <h6 className="mb-2 text-truncate fw-medium">{entry.title}</h6>
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
                          handleDeleteDiary(entry);
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
        </div>

        {/* Markdown编辑器部分 */}
        {selectedEntry && isEditing && (
          <div className="flex-grow-1 overflow-auto p-3">
            <div className="mb-3">
              <label htmlFor="title" className="form-label fw-bold">标题</label>
              <input
                type="text"
                className="form-control"
                id="title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="日记标题"
              />
            </div>

            <div data-color-mode={themeMode === ThemeMode.DARK ? 'dark' : 'light'} className="card border-0 shadow-sm p-2">
              <MDEditor
                value={editContent}
                onChange={setEditContent}
                height={500}
                preview="edit"
              />
            </div>

            <div className="d-flex justify-content-between mt-3">
              <div>
                {saveStatus && (
                  <span className="text-muted me-2">
                    <i className="bi bi-check-circle me-1"></i>
                    {saveStatus}
                  </span>
                )}
              </div>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-secondary"
                  onClick={() => setIsEditing(false)}
                >
                  取消
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSaveDiary}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      保存中...
                    </>
                  ) : (
                    '保存'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 查看日记内容部分 */}
        {selectedEntry && !isEditing && (
          <div className="flex-grow-1 overflow-auto p-3">
            <div className="d-flex justify-content-between mb-4 align-items-center">
              <h2 className="mb-0">{selectedEntry.title}</h2>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setIsEditing(true)}
                >
                  <i className="bi bi-pencil me-1"></i>
                  编辑
                </button>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => handleDeleteDiary(selectedEntry)}
                >
                  <i className="bi bi-trash me-1"></i>
                  删除
                </button>
              </div>
            </div>
            <div
              className={`markdown-content py-2 rounded-3`}
              dangerouslySetInnerHTML={{ __html: marked(selectedEntry.content) }}
            ></div>
          </div>
        )}

        {/* 提示选择或创建新日记 */}
        {!selectedEntry && !isEditing && (
          <div className="flex-grow-1 d-flex align-items-center justify-content-center text-center p-4">
            <div>
              <div className="display-1 text-muted opacity-25 mb-3">
                <i className="bi bi-journal-text"></i>
              </div>
              <h3 className="mb-3">选择一篇日记查看或编辑</h3>
              <p className="text-muted mb-4">或者创建一篇新的日记来记录你的想法</p>
              <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                <i className="bi bi-plus me-1"></i>
                写新日记
              </button>
            </div>
          </div>
        )}

        {/* 添加日记对话框 */}
        {showAddModal && (
          <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">新建日记</h5>
                  <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                </div>
                <div className="modal-body">
                  {error && <div className="alert alert-danger">{error}</div>}
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    handleAddDiary();
                  }}>
                    <div className="mb-3">
                      <label htmlFor="diaryTitle" className="form-label">日记标题</label>
                      <input
                        type="text"
                        className="form-control"
                        id="diaryTitle"
                        value={newDiaryTitle}
                        onChange={(e) => setNewDiaryTitle(e.target.value)}
                        placeholder="输入日记标题"
                        required
                      />
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowAddModal(false)}
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleAddDiary}
                    disabled={isAddingDiary}
                  >
                    {isAddingDiary ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        创建中...
                      </>
                    ) : '创建日记'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 分隔拖拽线 */}
        <div
          className="resizer"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        ></div>
      </div>
    </div>
  );
};

export default Diary;
