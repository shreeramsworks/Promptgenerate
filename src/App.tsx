
import React, { useState, useCallback, useEffect } from 'react';
import { PromptEditor } from './components/PromptEditor';
import { GeneratedPromptDisplay } from './components/GeneratedPromptDisplay';
import { ControlPanel } from './components/ControlPanel';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { generateDetailedPrompt } from './services/aiService';
import { INITIAL_USER_INPUT } from './constants';

const App: React.FC = () => {
  const [userInput, setUserInput] = useState<string>(INITIAL_USER_INPUT);
  const [desiredMaxLength, setDesiredMaxLength] = useState<string>(''); // For input field, parsed to number later
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showCopiedMessage, setShowCopiedMessage] = useState<boolean>(false);

  const handleGeneratePrompt = useCallback(async () => {
    if (!userInput.trim()) {
      setError("Your idea description cannot be empty.");
      setGeneratedPrompt('');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedPrompt('');
    try {
      const maxLength = desiredMaxLength ? parseInt(desiredMaxLength, 10) : null;
      if (desiredMaxLength && (isNaN(maxLength as any) || (maxLength as number) <= 0)) {
         setError("Desired max characters must be a positive number.");
         setIsLoading(false);
         return;
      }
      const result = await generateDetailedPrompt(userInput, maxLength);
      setGeneratedPrompt(result);
    } catch (err) {
      console.error("Error generating prompt:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred during prompt generation.");
      setGeneratedPrompt('');
    } finally {
      setIsLoading(false);
    }
  }, [userInput, desiredMaxLength]);

  const handleClearAll = useCallback(() => {
    setUserInput('');
    setDesiredMaxLength('');
    setGeneratedPrompt('');
    setError(null);
  }, []);

  const handleCopyGeneratedPrompt = useCallback(async () => {
    if (!generatedPrompt) return;
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setShowCopiedMessage(true);
      setTimeout(() => setShowCopiedMessage(false), 2000);
    } catch (err) {
      console.error("Failed to copy generated prompt:", err);
      setError("Failed to copy generated prompt to clipboard.");
    }
  }, [generatedPrompt]);
  
  useEffect(() => {
    if (error && (userInput || desiredMaxLength)) {
      // Clear error if user starts typing a new idea or changes length
      const timeoutId = setTimeout(() => setError(null), 3000); // Clear error after 3s if user interacted
      return () => clearTimeout(timeoutId);
    }
  }, [userInput, desiredMaxLength, error]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col space-y-6 p-6 bg-slate-800 rounded-xl shadow-2xl">
          <PromptEditor
            userInput={userInput}
            onUserInputChange={setUserInput}
            desiredMaxLength={desiredMaxLength}
            onDesiredMaxLengthChange={setDesiredMaxLength}
          />
          <ControlPanel
            onGenerate={handleGeneratePrompt}
            onClear={handleClearAll}
            onCopy={handleCopyGeneratedPrompt}
            isLoading={isLoading}
            showCopiedMessage={showCopiedMessage}
            isInputEmpty={!userInput.trim()}
            isOutputEmpty={!generatedPrompt.trim()}
          />
        </div>
        <div className="p-6 bg-slate-800 rounded-xl shadow-2xl">
          <GeneratedPromptDisplay
            prompt={generatedPrompt}
            isLoading={isLoading} 
            error={error} 
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;