import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { marked } from 'marked';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { articlesApi } from '../services/api';

const Articles = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [newUrl, setNewUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    // 从localStorage获取保存的宽度，如果没有则使用默认值30%
    const savedWidth = localStorage.getItem('sidebarWidth');
    return savedWidth ? parseFloat(savedWidth) : 30;
  });
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef(null);
  const containerRef = useRef(null);

  // 从API加载文章
  useEffect(() => {
    const loadArticles = async () => {
      try {
        setIsLoading(true);
        const data = await articlesApi.getAll();
        setArticles(data);
        setFilteredArticles(data);
        setIsDataLoaded(true);
        setIsLoading(false);
      } catch (error) {
        console.error('加载文章数据失败:', error);
        setError('加载文章失败，请重试');
        setIsLoading(false);
      }
    };

    loadArticles();
  }, []);

  // 搜索文章
  const handleSearch = async (value) => {
    setSearchQuery(value);

    if (!value.trim()) {
      setFilteredArticles(articles);
      return;
    }

    try {
      setIsSearching(true);
      const results = await articlesApi.search(value);
      setFilteredArticles(results);
    } catch (error) {
      console.error('搜索文章失败:', error);
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

  // 加载选中的文章
  useEffect(() => {
    if (id && articles.length > 0) {
      const article = articles.find(article => article.id.toString() === id);
      setSelectedArticle(article);
    } else if (articles.length > 0) {
      setSelectedArticle(articles[0]);
    }
  }, [id, articles]);

  // 将文章保存到本地存储
  const saveArticles = (newArticles) => {
    localStorage.setItem('articles', JSON.stringify(newArticles));
    setArticles(newArticles);
  };

  // 模拟获取网页信息
  const fetchWebpage = async (url) => {
    // 实际项目中应连接到后端API进行网页爬取和AI摘要
    // 这里为了演示，创建模拟数据
    return {
      id: Date.now(),
      url,
      title: `关于 ${url.split('//')[1].split('/')[0]} 的文章`,
      summary: '这是一篇AI生成的文章摘要，描述了网页的主要内容和重点。在实际项目中，这部分应该由后端AI服务生成。',
      favicon: 'https://example.com/favicon.ico',
      screenshot: 'https://images.unsplash.com/photo-1481487196290-c152efe083f5',
      addedAt: new Date().toISOString()
    };
  };

  // 添加新文章
  const handleAddArticle = async (e) => {
    e.preventDefault();
    setError('');

    if (!newUrl.trim()) {
      setError('请输入网址');
      return;
    }

    // 简单验证URL格式
    try {
      new URL(newUrl);
    } catch (err) {
      setError('请输入有效的网址');
      return;
    }

    setIsLoading(true);

    try {
      const articleData = await fetchWebpage(newUrl);
      const updatedArticles = [articleData, ...articles];
      saveArticles(updatedArticles);
      setNewUrl('');
      setShowAddModal(false);
      setSelectedArticle(articleData);
    } catch (err) {
      setError('获取网页信息失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 删除文章
  const handleDeleteArticle = (id) => {
    const updatedArticles = articles.filter(article => article.id !== id);
    saveArticles(updatedArticles);

    if (selectedArticle && selectedArticle.id === id) {
      setSelectedArticle(updatedArticles.length > 0 ? updatedArticles[0] : null);
    }
  };

  // 格式化日期
  const formatDate = (dateString) => {
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

  // 重置为初始数据
  const handleResetToDefault = () => {
    if (window.confirm('确定要重置为初始数据吗？您添加的所有文章都将丢失。')) {
      setArticles(articlesData);
      localStorage.setItem('articles', JSON.stringify(articlesData));
      setSelectedArticle(articlesData.length > 0 ? articlesData[0] : null);
    }
  };

  // 点击选中文章
  const handleSelectArticle = (article) => {
    setSelectedArticle(article);
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
              <i className="bi bi-bookmark-fill text-primary me-2"></i>
              <span className="fw-medium">已收藏 {articles.length}</span>
            </div>
            <div>
              <button
                className="btn btn-sm btn-outline-secondary me-2"
                onClick={handleResetToDefault}
                title="重置为初始数据"
              >
                <i className="bi bi-arrow-counterclockwise"></i>
              </button>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => setShowAddModal(true)}
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
                placeholder="搜索收藏..."
                aria-label="搜索收藏"
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

          {!isDataLoaded ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">加载中...</span>
              </div>
              <p className="mt-3 text-muted">正在加载文章数据...</p>
            </div>
          ) : filteredArticles.length === 0 ? (
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
                    <i className="bi bi-bookmark display-4 text-primary opacity-75"></i>
                  </div>
                  <h5 className="mb-2">还没有收藏</h5>
                  <p className="text-muted mb-4">点击右上角的添加按钮收藏你喜欢的网页</p>
                  <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                    <i className="bi bi-plus me-1"></i>添加收藏
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="list-group list-group-flush fade-in">
              {filteredArticles.map(article => (
                <div
                  key={article.id}
                  className={`list-group-item list-group-item-action border-0 border-bottom position-relative ${selectedArticle && selectedArticle.id === article.id ? 'active' : ''}`}
                  onClick={() => handleSelectArticle(article)}
                >
                  <div className="d-flex align-items-start py-2">
                    <div className="flex-shrink-0 me-2 mt-1">
                      {article.favicon ? (
                        <img src={article.favicon} alt="" width="18" height="18" style={{borderRadius: 'var(--radius-sm)'}} />
                      ) : (
                        <i className="bi bi-globe text-primary"></i>
                      )}
                    </div>
                    <div className="flex-grow-1 overflow-hidden pe-4">
                      <h6 className="mb-1 text-truncate fw-medium">{article.title}</h6>
                      <p className="mb-1 small text-muted text-wrap overflow-hidden summary-text" style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        textOverflow: 'ellipsis',
                        lineHeight: '1.4'
                      }}>
                        {article.summary}
                      </p>
                      <small className="text-muted d-inline-block">
                        <i className="bi bi-clock me-1"></i>
                        {formatDate(article.addedAt)}
                      </small>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteArticle(article.id);
                      }}
                      className="btn btn-sm text-danger border-0 position-absolute end-0 top-0 mt-2 me-2"
                      style={{
                        opacity: 0,
                        transition: 'opacity 0.2s ease'
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
          {selectedArticle ? (
            <div className="p-4 slide-in-right">
              <div className="mb-4 border-bottom pb-3">
                <div className="d-flex align-items-start justify-content-between mb-2">
                  <h2 className="h4 mb-0 fw-bold">{selectedArticle.title}</h2>
                  <a
                    href={selectedArticle.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-primary"
                  >
                    <i className="bi bi-box-arrow-up-right me-1"></i>
                    访问原网页
                  </a>
                </div>
                <p className="text-muted small mb-0">
                  <i className="bi bi-link-45deg me-1"></i>
                  {selectedArticle.url}
                </p>
                <p className="text-muted small">
                  <i className="bi bi-calendar-check me-1"></i>
                  保存于 {new Date(selectedArticle.addedAt).toLocaleString('zh-CN')}
                </p>
              </div>

              <div className="mb-4">
                <ul className="nav nav-pills mb-3">
                  <li className="nav-item">
                    <button
                      className={`nav-link px-4 ${activeTab === 'summary' ? 'active' : ''}`}
                      onClick={() => setActiveTab('summary')}
                    >
                      <i className="bi bi-card-text me-1"></i>
                      摘要
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link px-4 ${activeTab === 'preview' ? 'active' : ''}`}
                      onClick={() => setActiveTab('preview')}
                    >
                      <i className="bi bi-image me-1"></i>
                      预览
                    </button>
                  </li>
                </ul>

                <div className="tab-content mt-3" style={{ minHeight: '300px' }}>
                  {activeTab === 'summary' ? (
                    <div className="tab-pane active fade-in">
                      <div className="card border-0 shadow-sm p-4 mb-4">
                        <p className="mb-3 lead">{selectedArticle.summary}</p>
                      </div>

                      {selectedArticle.images && selectedArticle.images.length > 0 && (
                        <div className="mt-4 card border-0 shadow-sm p-4">
                          <h5 className="mb-3 fw-medium"><i className="bi bi-images me-2"></i>网页图片</h5>
                          <div className="row row-cols-2 row-cols-md-3 g-3">
                            {selectedArticle.images.map((img, index) => (
                              <div key={index} className="col">
                                <img
                                  src={img}
                                  alt={`图片 ${index + 1}`}
                                  className="img-fluid rounded shadow-sm"
                                  style={{transition: 'transform 0.2s ease'}}
                                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="tab-pane active">
                      <div className="text-center fade-in">
                        <div className="card border-0 shadow-sm p-2 mb-3">
                          <img
                            src={selectedArticle.screenshot}
                            alt="网页截图"
                            className="img-fluid rounded"
                            style={{ maxHeight: 'calc(100vh - 250px)' }}
                          />
                        </div>
                        <a href={selectedArticle.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-3">
                          <i className="bi bi-globe me-1"></i>
                          访问原网页
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="card border-0 shadow-sm p-5 text-center" style={{maxWidth: '400px'}}>
                <i className="bi bi-journal-bookmark display-4 mb-3 empty-state-icon"></i>
                <h3 className="h5 mb-3">没有选中的文章</h3>
                <p className="text-muted mb-4">从左侧列表选择一篇文章，或者添加新的网页收藏</p>
                <button
                  className="btn btn-primary mx-auto"
                  style={{width: 'fit-content'}}
                  onClick={() => setShowAddModal(true)}
                >
                  <i className="bi bi-plus-circle me-1"></i>
                  添加网页
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 添加网页对话框 */}
      {showAddModal && (
        <div className="modal d-block fade-in" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title"><i className="bi bi-bookmark-plus me-2"></i>添加网页</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowAddModal(false)}></button>
              </div>
              <form onSubmit={handleAddArticle}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label htmlFor="newUrl" className="form-label fw-medium">网页地址</label>
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                      <input
                        type="text"
                        className="form-control"
                        id="newUrl"
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        placeholder="例如：https://example.com"
                        disabled={isLoading}
                        autoFocus
                      />
                    </div>
                    {error && <div className="text-danger mt-2 small"><i className="bi bi-exclamation-triangle me-1"></i>{error}</div>}
                    <div className="form-text mt-2">
                      <i className="bi bi-info-circle me-1"></i>
                      添加网页后，系统将自动提取网页内容并生成摘要
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowAddModal(false)}>取消</button>
                  <button
                    type="submit"
                    className="btn btn-primary px-4"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        添加中...
                      </>
                    ) : (
                      '添加'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Articles;
