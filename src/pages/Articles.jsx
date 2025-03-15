import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">我的网页收藏</h1>

        <form onSubmit={handleAddArticle} className="flex space-x-2">
          <input
            type="text"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="输入网址以添加收藏"
            className="input flex-grow"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? '添加中...' : '添加'}
          </button>
        </form>

        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">还没有收藏任何网页，添加一个吧！</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map(article => (
            <div key={article.id} className="card hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={article.screenshot}
                  alt={article.title}
                  className="w-full h-40 object-cover rounded-t-xl"
                />
                <button
                  onClick={() => handleDeleteArticle(article.id)}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                  title="删除"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900 truncate">{article.title}</h2>
                <p className="text-sm text-gray-500 mt-1 truncate">{article.url}</p>
                <p className="text-sm text-gray-700 mt-2 line-clamp-2">{article.summary}</p>

                <div className="mt-4">
                  <Link
                    to={`/articles/${article.id}`}
                    className="text-primary-600 font-medium hover:text-primary-700"
                  >
                    查看详情
                  </Link>
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
