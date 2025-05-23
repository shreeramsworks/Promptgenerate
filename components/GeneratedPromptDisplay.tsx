import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface GeneratedPromptDisplayProps {
  prompt: string;
  isLoading: boolean;
  error: string | null;
}

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center space-x-2" aria-label="Loading generated prompt">
    <svg className="animate-spin h-5 w-5 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <span className="text-slate-300">Generating your detailed prompt...</span>
  </div>
);

export const GeneratedPromptDisplay: React.FC<GeneratedPromptDisplayProps> = ({ prompt, isLoading, error }) => {
  return (
    <div className="flex flex-col space-y-2 h-full">
      <h2 className="text-xl font-semibold text-slate-200 mb-2">Generated Prompt</h2>
      <div 
        className="flex-grow p-4 bg-slate-700 border border-slate-600 rounded-lg overflow-y-auto min-h-[200px] max-h-[calc(100vh-250px)] lg:max-h-full"
        aria-live="polite"
        aria-atomic="true"
      >
        {isLoading && <LoadingSpinner />}
        {error && <p className="text-red-400 whitespace-pre-wrap">Error: {error}</p>}
        {!isLoading && !error && !prompt && (
          <p className="text-slate-400">
            Describe your idea in the panel on the left and click "Generate Prompt" to see a detailed AI-generated prompt here.
          </p>
        )}
        {!isLoading && !error && prompt && (
          <div className="prose prose-sm prose-invert max-w-none text-slate-200">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {prompt}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};