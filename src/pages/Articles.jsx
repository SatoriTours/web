import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { marked } from 'marked';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import articlesData from '../assets/data/articles.json';

const Articles = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [newUrl, setNewUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');

  // 从JSON文件和localStorage加载文章
  useEffect(() => {
    const loadArticles = () => {
      try {
        // 首先检查localStorage中是否已有数据
        const savedArticles = localStorage.getItem('articles');
        if (savedArticles) {
          // 如果localStorage有数据，使用它
          setArticles(JSON.parse(savedArticles));
        } else {
          // 否则使用JSON文件中的初始数据
          setArticles(articlesData);
          // 将初始数据也保存到localStorage
          localStorage.setItem('articles', JSON.stringify(articlesData));
        }
        console.log('文章数据加载成功');
      } catch (error) {
        console.error('加载文章数据失败:', error);
        // 如果出错，至少显示JSON文件中的数据
        setArticles(articlesData);
      } finally {
        setIsDataLoaded(true);
      }
    };

    loadArticles();
  }, []);

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
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  return (
    <div className="container-fluid">
      <div className="row" style={{height: 'calc(100vh - 56px)'}}>
        {/* 左侧列表 */}
        <div className="col-12 col-md-5 col-lg-4 p-0 border-end" style={{height: '100%', overflow: 'auto'}}>
          <div className="p-3 bg-light border-bottom d-flex justify-content-between align-items-center">
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

          {!isDataLoaded ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">加载中...</span>
              </div>
              <p className="mt-3 text-muted">正在加载文章数据...</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-5">
              <div className="py-5">
                <i className="bi bi-journal-bookmark display-1 text-secondary opacity-50"></i>
                <p className="mt-3 text-muted">还没有收藏任何网页，添加一个吧！</p>
              </div>
            </div>
          ) : (
            <div className="list-group list-group-flush">
              {articles.map(article => (
                <div
                  key={article.id}
                  className={`list-group-item list-group-item-action border-0 border-bottom ${selectedArticle && selectedArticle.id === article.id ? 'active bg-light' : ''}`}
                  onClick={() => handleSelectArticle(article)}
                >
                  <div className="d-flex align-items-start py-1">
                    <div className="flex-shrink-0 me-2">
                      {article.favicon ? (
                        <img src={article.favicon} alt="" width="16" height="16" />
                      ) : (
                        <i className="bi bi-globe"></i>
                      )}
                    </div>
                    <div className="flex-grow-1 overflow-hidden">
                      <h6 className="mb-0 text-truncate">{article.title}</h6>
                      <p className="mb-0 small text-truncate text-muted">
                        {article.url.replace(/^https?:\/\/(www\.)?/, '')}
                      </p>
                      <small className="text-muted">{formatDate(article.addedAt)}</small>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteArticle(article.id);
                      }}
                      className="btn btn-sm text-danger border-0"
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
        <div className="col-12 col-md-7 col-lg-8 p-0" style={{height: '100%', overflow: 'auto'}}>
          {selectedArticle ? (
            <div className="p-4">
              <div className="mb-4">
                <h2 className="h4 mb-1">{selectedArticle.title}</h2>
                <p className="text-muted">
                  <a href={selectedArticle.url} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                    {selectedArticle.url}
                    <i className="bi bi-box-arrow-up-right ms-1"></i>
                  </a>
                </p>
                <p className="text-muted small">
                  保存于 {new Date(selectedArticle.addedAt).toLocaleString('zh-CN')}
                </p>
              </div>

              <div className="mb-3 border-bottom">
                <ul className="nav">
                  <li className="nav-item">
                    <button
                      className={`btn btn-link px-3 py-2 text-decoration-none ${activeTab === 'summary' ? 'text-primary fw-medium border-bottom border-2 border-primary' : 'text-secondary'}`}
                      onClick={() => setActiveTab('summary')}
                    >
                      摘要
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`btn btn-link px-3 py-2 text-decoration-none ${activeTab === 'preview' ? 'text-primary fw-medium border-bottom border-2 border-primary' : 'text-secondary'}`}
                      onClick={() => setActiveTab('preview')}
                    >
                      预览
                    </button>
                  </li>
                </ul>
              </div>

              <div className="py-2">
                {activeTab === 'summary' ? (
                  <div>
                    <p className="mb-4">{selectedArticle.summary}</p>

                    {selectedArticle.images && selectedArticle.images.length > 0 && (
                      <div className="mt-4">
                        <h5 className="mb-3">网页图片</h5>
                        <div className="row row-cols-2 row-cols-md-3 g-3">
                          {selectedArticle.images.map((img, index) => (
                            <div key={index} className="col">
                              <img
                                src={img}
                                alt={`图片 ${index + 1}`}
                                className="img-fluid rounded"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center">
                    <img
                      src={selectedArticle.screenshot}
                      alt="网页截图"
                      className="img-fluid rounded shadow-sm"
                      style={{ maxHeight: 'calc(100vh - 250px)' }}
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="d-flex flex-column align-items-center justify-content-center h-100 text-center text-muted p-4">
              <i className="bi bi-journal-bookmark display-4 mb-3"></i>
              <h3 className="h5">没有选中的文章</h3>
              <p>从左侧列表选择一篇文章，或者添加新的网页收藏</p>
              <button
                className="btn btn-primary mt-2"
                onClick={() => setShowAddModal(true)}
              >
                <i className="bi bi-plus me-1"></i>
                添加网页
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 添加网页对话框 */}
      {showAddModal && (
        <div className="modal d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">添加网页</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <form onSubmit={handleAddArticle}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="newUrl" className="form-label">网页地址</label>
                    <input
                      type="text"
                      className="form-control"
                      id="newUrl"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      placeholder="例如：https://example.com"
                      disabled={isLoading}
                    />
                    {error && <div className="text-danger mt-2 small">{error}</div>}
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>取消</button>
                  <button
                    type="submit"
                    className="btn btn-primary"
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
