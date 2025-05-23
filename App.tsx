
import React, { useState, useCallback, useEffect } from 'react';
import { PromptEditor } from './components/PromptEditor';
import { GeneratedPromptDisplay } from './components/GeneratedPromptDisplay'; // New component
import { ControlPanel } from './components/ControlPanel';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { generateDetailedPrompt } from './services/aiService'; // Updated import and function
import { INITIAL_USER_INPUT } from './constants'; // Renamed from INITIAL_PROMPT

const App: React.FC = () => {
  const [userInput, setUserInput] = useState<string>(INITIAL_USER_INPUT);
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
      const result = await generateDetailedPrompt(userInput);
      setGeneratedPrompt(result);
    } catch (err) {
      console.error("Error generating prompt:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred during prompt generation.");
      setGeneratedPrompt('');
    } finally {
      setIsLoading(false);
    }
  }, [userInput]);

  const handleClearAll = useCallback(() => {
    setUserInput('');
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
    if (error) {
      // Clear error if user starts typing a new idea
      setError(null);
    }
  }, [userInput]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col space-y-6 p-6 bg-slate-800 rounded-xl shadow-2xl">
          {/* TemplateSelector removed */}
          <PromptEditor
            userInput={userInput} // Renamed prop
            onUserInputChange={setUserInput} // Renamed prop
          />
          <ControlPanel
            onGenerate={handleGeneratePrompt} // Renamed prop
            onClear={handleClearAll}
            onCopy={handleCopyGeneratedPrompt} // Now copies generated prompt
            isLoading={isLoading}
            showCopiedMessage={showCopiedMessage}
            isInputEmpty={!userInput.trim()} // Renamed prop
            isOutputEmpty={!generatedPrompt.trim()} // New prop for copy button
          />
        </div>
        <div className="p-6 bg-slate-800 rounded-xl shadow-2xl">
          <GeneratedPromptDisplay // New component
            prompt={generatedPrompt} // Renamed prop
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