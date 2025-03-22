import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { marked } from 'marked';
import { articlesApi } from '../services/api';

// 引入通用组件
import Sidebar from '../components/common/Sidebar';
import SectionHeader from '../components/common/SectionHeader';
import SearchInput from '../components/common/SearchInput';
import EmptyState from '../components/common/EmptyState';
import LoadingState from '../components/common/LoadingState';

// 引入自定义钩子
import useResizable from '../hooks/useResizable';
import useLocalStorage from '../hooks/useLocalStorage';

// 引入工具函数
import { formatRelativeDate, formatFullDate, getNowISOString } from '../utils/dateUtils';

// 引入初始数据
import articlesData from '../assets/data/articles.json';

const ArticlesRefactored = () => {
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('summary');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 使用自定义钩子
  const [articles, setArticles, resetArticles] = useLocalStorage('articles', articlesData);
  const { width, isResizing, containerRef, handleResizeStart, remainingWidth } = useResizable({
    storageKey: 'articlesWidth',
  });

  // 选中的文章
  const [selectedArticle, setSelectedArticle] = useState(null);

  // 加载选中的文章
  useEffect(() => {
    if (id && articles.length > 0) {
      const article = articles.find(article => article.id.toString() === id);
      setSelectedArticle(article);
    } else if (articles.length > 0) {
      setSelectedArticle(articles[0]);
    }
  }, [id, articles]);

  // 在useEffect中使用articlesApi获取文章数据
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        const articles = await articlesApi.getAll();
        setArticles(articles);
        setIsLoading(false);
      } catch (error) {
        setError('获取文章列表失败，请重试');
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // 模拟获取网页信息
  const fetchWebpage = async (url) => {
    // 实际项目中应连接到后端API进行网页爬取和AI摘要
    return {
      id: Date.now(),
      url,
      title: `关于 ${url.split('//')[1].split('/')[0]} 的文章`,
      summary: '这是一篇AI生成的文章摘要，描述了网页的主要内容和重点。在实际项目中，这部分应该由后端AI服务生成。',
      favicon: 'https://example.com/favicon.ico',
      screenshot: 'https://images.unsplash.com/photo-1481487196290-c152efe083f5',
      addedAt: getNowISOString()
    };
  };

  // 修改添加新文章函数
  const handleAddArticle = async () => {
    if (!newUrl) {
      setError('请输入有效的URL');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // 使用API服务来获取网页数据
      const newArticle = await articlesApi.fetchWebpageData(newUrl);

      // 添加新文章
      const updatedArticles = [newArticle, ...articles];
      setArticles(updatedArticles);

      // 重置状态
      setNewUrl('');
      setShowAddModal(false);
      setSelectedArticle(newArticle);
    } catch (error) {
      setError('添加文章失败: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 修改删除文章函数
  const handleDeleteArticle = async (article) => {
    if (!article || !article.id) return;

    try {
      await articlesApi.delete(article.id);

      // 更新文章列表
      const updatedArticles = await articlesApi.getAll();
      setArticles(updatedArticles);

      // 如果删除的是当前选中的文章，则清除选中状态
      if (selectedArticle && selectedArticle.id === article.id) {
        setSelectedArticle(null);
      }
    } catch (error) {
      setError('删除文章失败: ' + error.message);
    }
  };

  // 处理重置为初始数据
  const handleResetToDefault = () => {
    if (window.confirm('确定要重置为初始数据吗？您添加的所有文章都将丢失。')) {
      resetArticles();
      setSelectedArticle(articlesData.length > 0 ? articlesData[0] : null);
    }
  };

  // 点击选中文章
  const handleSelectArticle = (article) => {
    setSelectedArticle(article);
  };

  // 过滤后的文章列表
  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 侧边栏标题组件
  const sidebarHeader = (
    <>
      <SectionHeader
        icon="bi bi-bookmark-fill"
        title="已收藏"
        count={articles.length}
        actions={
          <>
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
              title="添加网页"
            >
              <i className="bi bi-plus"></i>
            </button>
          </>
        }
      />
      <SearchInput
        placeholder="搜索收藏..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </>
  );

  return (
    <div ref={containerRef} className="container-fluid bg-light">
      <div className="row" style={{height: 'calc(100vh - 56px)'}}>
        {/* 左侧列表 */}
        <Sidebar
          header={sidebarHeader}
          width={width}
          isResizing={isResizing}
          onResizeStart={handleResizeStart}
        >
          {!articles ? (
            <LoadingState message="正在加载文章数据..." />
          ) : filteredArticles.length === 0 ? (
            <EmptyState
              icon="bi bi-bookmark"
              title="还没有收藏"
              description="点击右上角的添加按钮收藏你喜欢的网页"
              action={
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                  <i className="bi bi-plus me-1"></i>添加收藏
                </button>
              }
            />
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
                        {formatRelativeDate(article.addedAt)}
                      </small>
                    </div>
                    <button
                      onClick={(e) => handleDeleteArticle(article)}
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
        </Sidebar>

        {/* 右侧详情 */}
        <div className="p-0 bg-white" style={{
          height: '100%',
          overflow: 'auto',
          width: `${remainingWidth}%`,
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
                  保存于 {formatFullDate(selectedArticle.addedAt)}
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
            <EmptyState
              icon="bi bi-journal-bookmark"
              title="没有选中的文章"
              description="从左侧列表选择一篇文章，或者添加新的网页收藏"
              action={
                <button
                  className="btn btn-primary"
                  onClick={() => setShowAddModal(true)}
                >
                  <i className="bi bi-plus-circle me-1"></i>
                  添加网页
                </button>
              }
            />
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
                        <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                        <output>添加中...</output>
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

export default ArticlesRefactored;
