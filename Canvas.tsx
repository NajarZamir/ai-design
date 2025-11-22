import React from 'react';
import { DownloadIcon } from './icons/DownloadIcon';

interface CanvasProps {
  generatedImage: string | null;
  isLoading: boolean;
  error: string | null;
}

export const Canvas: React.FC<CanvasProps> = ({ generatedImage, isLoading, error }) => {

  const handleDownload = (base64Image: string, filename: string) => {
    if (!base64Image) return;
    
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${base64Image}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-grow flex flex-col p-4 md:p-8 bg-gray-900 overflow-y-auto">
      <div className={`w-full max-w-4xl mx-auto flex items-center justify-center bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-700 relative mb-6 ${generatedImage ? 'aspect-square' : ''}`} style={{minHeight: '400px'}}>
        {isLoading && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-75 flex flex-col items-center justify-center z-10 text-center px-4">
            <svg className="animate-spin h-10 w-10 text-purple-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-lg text-gray-300">Generating your scene...</p>
          </div>
        )}
        {error && (
          <div className="text-center p-4">
            <p className="text-red-400 font-semibold">An error occurred</p>
            <p className="text-gray-400 mt-1 text-sm max-w-md">{error}</p>
          </div>
        )}
        {!isLoading && !error && generatedImage && (
          <>
            <img src={`data:image/png;base64,${generatedImage}`} alt="Generated scene" className="max-w-full max-h-full object-contain rounded-lg" />
            <button
              onClick={() => handleDownload(generatedImage, 'generated-scene.png')}
              className="absolute bottom-4 right-4 bg-gray-900 bg-opacity-60 hover:bg-opacity-80 text-white rounded-full p-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500"
              aria-label="Download"
            >
              <DownloadIcon className="w-6 h-6" />
            </button>
          </>
        )}
        {!isLoading && !error && !generatedImage && (
          <div className="text-center text-gray-500 p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium">Your generated output will appear here</h3>
            <p className="mt-1 text-xs text-gray-600">Upload an image and describe a scene to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};