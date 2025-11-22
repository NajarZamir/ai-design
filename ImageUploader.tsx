
import React, { useCallback, useState } from 'react';
import { fileToBase64 } from '../utils/fileUtils';
import { ImageIcon } from './icons/ImageIcon';

interface ImageUploaderProps {
  uploadedImage: string | null;
  onImageUpload: (base64: string | null) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ uploadedImage, onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback(async (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const base64 = await fileToBase64(file);
        onImageUpload(base64);
      } else {
        alert('Please upload a valid image file.');
      }
    }
  }, [onImageUpload]);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  }, [handleFileChange]);

  const handleRemoveImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onImageUpload(null);
  };

  return (
    <label
      htmlFor="file-upload"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`relative flex justify-center items-center w-full h-48 px-6 pt-5 pb-6 border-2 ${isDragging ? 'border-purple-500' : 'border-gray-600'} border-dashed rounded-md cursor-pointer bg-gray-700 hover:bg-gray-600/50 transition-colors duration-200`}
    >
      {uploadedImage ? (
        <>
          <img src={uploadedImage} alt="Uploaded product" className="max-h-full max-w-full object-contain" />
          <button
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-1.5 transition-colors"
            aria-label="Remove image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </>
      ) : (
        <div className="space-y-1 text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="flex text-sm text-gray-400">
            <p className="pl-1">
              <span className="font-semibold text-purple-400">Upload a file</span> or drag and drop
            </p>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
        </div>
      )}
      <input
        id="file-upload"
        name="file-upload"
        type="file"
        className="sr-only"
        accept="image/*"
        onChange={(e) => handleFileChange(e.target.files)}
      />
    </label>
  );
};
