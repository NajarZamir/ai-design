import React from 'react';
import { ImageUploader } from './ImageUploader';
import { SparklesIcon } from './icons/SparklesIcon';
import { UndoIcon } from './icons/UndoIcon';
import { RedoIcon } from './icons/RedoIcon';

export interface SceneStyle {
  name: string;
  description: string;
}

interface ControlPanelProps {
  uploadedImage: string | null;
  onImageUpload: (base64: string | null) => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  examplePrompts: string[];
  onSelectExample: (prompt: string) => void;
  shouldModifyItem: boolean;
  setShouldModifyItem: (value: boolean) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  sceneStyles: SceneStyle[];
  selectedStyle: string | null;
  onSelectStyle: (styleName: string) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  uploadedImage,
  onImageUpload,
  prompt,
  setPrompt,
  onGenerate,
  isLoading,
  examplePrompts,
  onSelectExample,
  shouldModifyItem,
  setShouldModifyItem,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  sceneStyles,
  selectedStyle,
  onSelectStyle,
}) => {
  const isGenerateDisabled = isLoading || !uploadedImage || !prompt;
  
  return (
    <div className="w-full md:w-[450px] bg-gray-800 p-6 flex-shrink-0 flex flex-col space-y-6 overflow-y-auto">
      <div className="flex-grow flex flex-col space-y-6 pt-6">
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">1. Upload Product Image</label>
          <ImageUploader uploadedImage={uploadedImage} onImageUpload={onImageUpload} />
        </div>

        <div>
          <label htmlFor="prompt-textarea" className="text-sm font-medium text-gray-300 mb-2 block">2. Describe Your Scene</label>
          <textarea
            id="prompt-textarea"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., on a marble countertop..."
            className="w-full h-28 p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow duration-200 resize-none"
            disabled={isLoading}
          />
        </div>

        <div>
          <p className="text-sm font-medium text-gray-300 mb-2">Or try an example:</p>
          <div className="flex flex-wrap gap-2">
            {examplePrompts.map((example, index) => (
              <button
                key={index}
                onClick={() => onSelectExample(example)}
                disabled={isLoading}
                className="px-3 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 rounded-full text-gray-200 transition-colors duration-200 disabled:opacity-50"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-300 mb-2">3. Choose a Style (Optional)</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {sceneStyles.map((style) => (
              <button
                key={style.name}
                onClick={() => onSelectStyle(style.name)}
                disabled={isLoading}
                className={`px-3 py-2 text-sm text-center rounded-lg transition-all duration-200 disabled:opacity-50
                  ${selectedStyle === style.name
                    ? 'bg-purple-600 text-white font-semibold ring-2 ring-purple-400'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                  }`}
              >
                {style.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 space-y-4">
        <div className="flex items-center justify-end space-x-2">
           <button
             onClick={onUndo}
             disabled={!canUndo || isLoading}
             className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white disabled:text-gray-600 disabled:bg-transparent disabled:cursor-not-allowed transition-colors"
             aria-label="Undo"
           >
             <UndoIcon className="w-5 h-5" />
           </button>
           <button
             onClick={onRedo}
             disabled={!canRedo || isLoading}
             className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white disabled:text-gray-600 disabled:bg-transparent disabled:cursor-not-allowed transition-colors"
             aria-label="Redo"
           >
             <RedoIcon className="w-5 h-5" />
           </button>
        </div>

        <div className="flex items-center justify-between bg-gray-700/50 p-3 rounded-lg">
          <div>
            <label htmlFor="modify-item-toggle" className="text-sm font-medium text-gray-200 cursor-pointer">
              Modify item to match scene
            </label>
            <p className="text-xs text-gray-400">Adjusts lighting and reflections on the item.</p>
          </div>
          <button
            type="button"
            className={`${
              shouldModifyItem ? 'bg-purple-600' : 'bg-gray-600'
            } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800`}
            role="switch"
            aria-checked={shouldModifyItem}
            onClick={() => setShouldModifyItem(!shouldModifyItem)}
            id="modify-item-toggle"
            disabled={isLoading}
          >
            <span
              aria-hidden="true"
              className={`${
                shouldModifyItem ? 'translate-x-5' : 'translate-x-0'
              } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
          </button>
        </div>

        <button
          onClick={onGenerate}
          disabled={isGenerateDisabled}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5 mr-2" />
              Generate Image
            </>
          )}
        </button>
      </div>
    </div>
  );
};
