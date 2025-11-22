import React, { useState, useCallback } from 'react';
import { ControlPanel } from './components/ControlPanel';
import type { SceneStyle } from './components/ControlPanel';
import { Canvas } from './components/Canvas';
import { generateScene } from './services/geminiService';
import { useHistoryState } from './hooks/useHistoryState';
import ErrorBoundary from './components/ErrorBoundary';

// Define and export scene styles here to be accessible by other components
export const sceneStyles: SceneStyle[] = [
  { name: 'Minimalist', description: 'in a minimalist style, clean lines, simple background, neutral color palette' },
  { name: 'Bohemian', description: 'in a bohemian style, with natural textures, plants, and warm, earthy tones' },
  { name: 'Industrial', description: 'in an industrial style, with exposed brick, metal accents, and a raw, edgy feel' },
  { name: 'Modern', description: 'in a modern style, sleek surfaces, geometric shapes, and a sophisticated look' },
  { name: 'Vintage', description: 'in a vintage style, with retro patterns, muted colors, and a nostalgic atmosphere' },
  { name: 'Surreal', description: 'in a surreal, dreamlike style, with unexpected elements and a fantasy atmosphere' },
];

interface AppState {
  uploadedImage: string | null;
  prompt: string;
  shouldModifyItem: boolean;
  selectedStyle: string | null;
}

const App: React.FC = () => {
  const { 
    state: appState, 
    setState: setAppState, 
    undo, 
    redo, 
    canUndo, 
    canRedo 
  } = useHistoryState<AppState>({
    uploadedImage: null,
    prompt: '',
    shouldModifyItem: true,
    selectedStyle: null,
  });

  const { uploadedImage, prompt, shouldModifyItem, selectedStyle } = appState;

  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const resetState = () => {
    setError(null);
    setGeneratedImage(null);
  };

  const onImageUpload = (image: string | null) => {
    setAppState(prev => ({...prev, uploadedImage: image}));
    resetState();
  };
  
  const setPrompt = (newPrompt: string) => {
    setAppState(prev => ({ ...prev, prompt: newPrompt }));
  };

  const setShouldModifyItem = (value: boolean) => {
    setAppState(prev => ({...prev, shouldModifyItem: value}));
  };
  
  const handleSelectStyle = (styleName: string) => {
    setAppState(prev => ({
      ...prev,
      selectedStyle: prev.selectedStyle === styleName ? null : styleName,
    }));
  };

  const handleGenerate = useCallback(async () => {
    if (!prompt || !uploadedImage) {
      setError('Please upload an image and provide a prompt.');
      return;
    }

    setIsLoading(true);
    resetState();

    try {
      const base64Data = uploadedImage.split(',')[1];
      const mimeType = uploadedImage.match(/data:(.*);base64,/)?.[1] || 'image/png';
      
      const style = sceneStyles.find(s => s.name === selectedStyle);
      const finalPrompt = style ? `${prompt}, ${style.description}` : prompt;
      
      const image = await generateScene(finalPrompt, base64Data, mimeType, shouldModifyItem);
      setGeneratedImage(image);

      if (!image) {
        throw new Error('The AI model did not return a final image. Please try again.');
      }

    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, uploadedImage, shouldModifyItem, selectedStyle]);
  
  const examplePrompts = [
    "on a marble countertop, next to a glass of water, with soft morning light",
    "on a wooden table, surrounded by autumn leaves and acorns",
    "floating in a pool of crystal clear water with ripples",
  ];
  
  const handleSelectExample = (example: string) => {
    setPrompt(example);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-white font-sans">
      <header className="absolute top-0 left-0 p-4 md:p-6 z-10">
          <h1 className="text-2xl font-bold tracking-tight">AI Product Stager</h1>
      </header>
      <main className="flex flex-col md:flex-row w-full h-full pt-16 md:pt-0">
        <ErrorBoundary>
          <ControlPanel
            uploadedImage={uploadedImage}
            onImageUpload={onImageUpload}
            prompt={prompt}
            setPrompt={setPrompt}
            onGenerate={handleGenerate}
            isLoading={isLoading}
            examplePrompts={examplePrompts}
            onSelectExample={handleSelectExample}
            shouldModifyItem={shouldModifyItem}
            setShouldModifyItem={setShouldModifyItem}
            onUndo={undo}
            onRedo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
            sceneStyles={sceneStyles}
            selectedStyle={selectedStyle}
            onSelectStyle={handleSelectStyle}
          />
          <Canvas
            generatedImage={generatedImage}
            isLoading={isLoading}
            error={error}
          />
        </ErrorBoundary>
      </main>
    </div>
  );
};

export default App;