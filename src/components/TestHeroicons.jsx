import React from 'react';
// 测试不同的导入路径
import { BeakerIcon } from '@heroicons/react/24/solid';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { ChatBubbleOvalLeftIcon } from '@heroicons/react/20/solid';

const TestHeroicons = () => {
  return (
    <div className="p-4">
      <h2>Heroicons 测试</h2>
      <div className="d-flex flex-column gap-2">
        <div>
          <h4>24/solid:</h4>
          <BeakerIcon className="h-6 w-6 text-blue-500" />
        </div>
        <div>
          <h4>24/outline:</h4>
          <ArrowRightIcon className="h-6 w-6 text-green-500" />
        </div>
        <div>
          <h4>20/solid:</h4>
          <ChatBubbleOvalLeftIcon className="h-5 w-5 text-red-500" />
        </div>
      </div>
    </div>
  );
};

export default TestHeroicons;
