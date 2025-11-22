import React from 'react';
import { DownloadIcon } from './icons/DownloadIcon';

interface AssetCardProps {
  image: string;
  title: string;
  onDownload: () => void;
}

export const AssetCard: React.FC<AssetCardProps> = ({ image, title, onDownload }) => (
  <div className="bg-gray-800 rounded-lg p-3 flex flex-col items-center text-center">
    <div className="w-full h-40 mb-3 rounded-md overflow-hidden bg-gray-700/50 flex items-center justify-center p-2">
      <img src={`data:image/png;base64,${image}`} alt={title} className="max-h-full max-w-full object-contain" />
    </div>
    <div className="w-full flex justify-between items-center mt-auto">
      <p className="text-sm font-medium text-gray-200">{title}</p>
      <button
        onClick={onDownload}
        className="bg-gray-700 hover:bg-purple-600 text-white rounded-full p-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
        aria-label={`Download ${title}`}
      >
        <DownloadIcon className="w-5 h-5" />
      </button>
    </div>
  </div>
);
