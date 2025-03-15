import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { marked } from 'marked';

const DiaryEntry = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // 从本地存储加载日记条目
  useEffect(() => {
    const savedEntries = localStorage.getItem('diaryEntries');
    if (savedEntries) {
      const parsedEntries = JSON.parse(savedEntries);
      const foundEntry = parsedEntries.find(entry => entry.id.toString() === id);

      if (foundEntry) {
        setEntry(foundEntry);
        setTitle(foundEntry.title);
        setContent(foundEntry.content);
      } else {
        navigate('/diary');
      }
    } else {
      navigate('/diary');
    }
  }, [id, navigate]);

  // 自动保存
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (entry && (title !== entry.title || content !== entry.content)) {
        handleSave();
      }
    }, 10000); // 每10秒自动保存一次

    return () => clearInterval(autoSaveInterval);
  }, [entry, title, content]);

  // 保存日记
  const handleSave = () => {
    if (!entry) return;

    setIsSaving(true);
    setSaveStatus('保存中...');

    setTimeout(() => {
      const savedEntries = localStorage.getItem('diaryEntries');
      let entries = [];

      if (savedEntries) {
        entries = JSON.parse(savedEntries);
      }

      const updatedEntry = {
        ...entry,
        title,
        content,
        updatedAt: new Date().toISOString()
      };

      const updatedEntries = entries.map(e =>
        e.id === updatedEntry.id ? updatedEntry : e
      );

      localStorage.setItem('diaryEntries', JSON.stringify(updatedEntries));
      setEntry(updatedEntry);
      setIsSaving(false);
      setSaveStatus('已保存');

      // 3秒后清除状态消息
      setTimeout(() => {
        setSaveStatus('');
      }, 3000);
    }, 500);
  };

  // 处理图片上传
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 文件大小限制 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('图片大小不能超过5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      // 在光标位置插入图片Markdown
      const imageMarkdown = `![${file.name}](${reader.result})\n`;

      // 获取textarea元素
      const textarea = document.getElementById('editor');
      const cursorPos = textarea.selectionStart;

      // 拼接新内容
      const newContent =
        content.substring(0, cursorPos) +
        imageMarkdown +
        content.substring(cursorPos);

      setContent(newContent);

      // 聚焦并将光标移动到合适位置
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          cursorPos + imageMarkdown.length,
          cursorPos + imageMarkdown.length
        );
      }, 0);
    };

    reader.readAsDataURL(file);

    // 清空input，以便能再次选择同一文件
    e.target.value = '';
  };

  if (!entry) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate('/diary')}
          className="flex items-center text-primary-600 hover:text-primary-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回日记列表
        </button>
        <div className="flex items-center">
          {saveStatus && (
            <span className="text-sm text-gray-500 mr-3">
              {saveStatus}
            </span>
          )}
          <label htmlFor="image-upload" className="btn mr-2 bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
            </svg>
            插入图片
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <button
            onClick={() => setIsPreview(!isPreview)}
            className="btn mr-2 bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            {isPreview ? '编辑' : '预览'}
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn btn-primary"
          >
            {isSaving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="日记标题"
            className="text-2xl font-bold text-gray-900 w-full border-none focus:outline-none focus:ring-0"
            disabled={isPreview}
          />
          <p className="text-gray-500 text-sm mt-2">
            最后更新: {new Date(entry.updatedAt).toLocaleString('zh-CN')}
          </p>
        </div>

        <div className="p-6">
          {isPreview ? (
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: marked(content) }}
            />
          ) : (
            <textarea
              id="editor"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="开始写下你的想法..."
              className="w-full min-h-[500px] border-none focus:outline-none focus:ring-0 font-mono text-gray-700 resize-none"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DiaryEntry;
