import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [newUrl, setNewUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 从本地存储加载文章
  useEffect(() => {
    const savedArticles = localStorage.getItem('articles');
    if (savedArticles) {
      setArticles(JSON.parse(savedArticles));
    }
  }, []);

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
      images: [
        'https://images.unsplash.com/photo-1682687982360-3fbab65f9d50',
        'https://images.unsplash.com/photo-1682695795557-17447f921f79'
      ],
      screenshot: 'https://images.unsplash.com/photo-1481487196290-c152efe083f5',
      savedAt: new Date().toISOString()
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

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col-lg-10 col-md-8">
          <h1 className="h3 mb-3">我的网页收藏</h1>
          <form onSubmit={handleAddArticle} className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="输入网址以添加收藏"
              disabled={isLoading}
            />
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
                <>
                  <i className="bi bi-plus"></i> 添加
                </>
              )}
            </button>
          </form>
          {error && (
            <div className="alert alert-danger py-2" role="alert">
              {error}
            </div>
          )}
        </div>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-5">
          <div className="py-5">
            <i className="bi bi-journal-bookmark display-1 text-secondary opacity-50"></i>
            <p className="mt-3 text-muted">还没有收藏任何网页，添加一个吧！</p>
          </div>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {articles.map(article => (
            <div key={article.id} className="col">
              <div className="card h-100 shadow-sm">
                <div className="position-relative">
                  <img
                    src={article.screenshot}
                    alt={article.title}
                    className="card-img-top"
                    style={{ height: '160px', objectFit: 'cover' }}
                  />
                  <button
                    onClick={() => handleDeleteArticle(article.id)}
                    className="btn btn-sm btn-light position-absolute top-0 end-0 m-2"
                    title="删除"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
                <div className="card-body">
                  <h5 className="card-title text-truncate">{article.title}</h5>
                  <p className="card-text text-muted small text-truncate">{article.url}</p>
                  <p className="card-text" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {article.summary}
                  </p>
                </div>
                <div className="card-footer bg-white border-top-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">{formatDate(article.savedAt)}</small>
                    <Link to={`/articles/${article.id}`} className="btn btn-sm btn-outline-primary">
                      查看详情
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Articles;
