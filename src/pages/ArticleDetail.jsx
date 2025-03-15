import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 从本地存储获取文章
    const savedArticles = localStorage.getItem('articles');
    if (savedArticles) {
      const parsedArticles = JSON.parse(savedArticles);
      const foundArticle = parsedArticles.find(article => article.id.toString() === id);

      if (foundArticle) {
        setArticle(foundArticle);
      } else {
        navigate('/articles');
      }
    } else {
      navigate('/articles');
    }

    setLoading(false);
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <p className="text-gray-500">文章未找到</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/articles')}
          className="flex items-center text-primary-600 hover:text-primary-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回收藏列表
        </button>
      </div>

      <div className="bg-white shadow rounded-xl overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900">{article.title}</h1>
          <p className="text-gray-500 mt-2">
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {article.url}
            </a>
          </p>
          <p className="text-gray-500 mt-1 text-sm">
            保存于 {new Date(article.savedAt).toLocaleString('zh-CN')}
          </p>
        </div>

        <div className="border-t border-gray-200">
          <div className="flex border-b border-gray-200">
            <button
              className={`px-6 py-3 font-medium text-sm focus:outline-none ${
                activeTab === 'summary'
                  ? 'text-primary-600 border-b-2 border-primary-500'
                  : 'text-gray-500 hover:text-primary-600'
              }`}
              onClick={() => setActiveTab('summary')}
            >
              AI 摘要
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm focus:outline-none ${
                activeTab === 'preview'
                  ? 'text-primary-600 border-b-2 border-primary-500'
                  : 'text-gray-500 hover:text-primary-600'
              }`}
              onClick={() => setActiveTab('preview')}
            >
              网页截图
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm focus:outline-none ${
                activeTab === 'original'
                  ? 'text-primary-600 border-b-2 border-primary-500'
                  : 'text-gray-500 hover:text-primary-600'
              }`}
              onClick={() => setActiveTab('original')}
            >
              原始网页
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'summary' && (
              <div>
                <p className="text-gray-700 mb-6">{article.summary}</p>

                {article.images && article.images.length > 0 && (
                  <div>
                    <h3 className="font-medium text-lg text-gray-900 mb-4">网页图片</h3>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                      {article.images.map((img, index) => (
                        <div key={index} className="aspect-w-16 aspect-h-9 overflow-hidden rounded-lg">
                          <img
                            src={img}
                            alt={`图片 ${index + 1}`}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'preview' && (
              <div className="flex justify-center">
                <img
                  src={article.screenshot}
                  alt="网页截图"
                  className="max-w-full rounded-lg shadow-md"
                />
              </div>
            )}

            {activeTab === 'original' && (
              <div className="border rounded-lg overflow-hidden h-[600px]">
                <iframe
                  src={article.url}
                  title={article.title}
                  className="w-full h-full"
                  sandbox="allow-same-origin allow-scripts"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
