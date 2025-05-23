
import React from 'react';

interface PromptEditorProps {
  userInput: string; // Renamed from promptText
  onUserInputChange: (text: string) => void; // Renamed from onPromptChange
}

export const PromptEditor: React.FC<PromptEditorProps> = ({ userInput, onUserInputChange }) => {
  const charCount = userInput.length;

  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor="prompt-idea-input" className="text-lg font-semibold text-slate-300">
        Describe Your Prompt Idea
      </label>
      <textarea
        id="prompt-idea-input"
        value={userInput}
        onChange={(e) => onUserInputChange(e.target.value)}
        placeholder="Enter a description of what you want your AI prompt to achieve. For example, 'A story about a cat who learns to fly' or 'Python code to sort a list of numbers'."
        className="w-full h-64 p-4 bg-slate-700 text-slate-100 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-shadow duration-150 resize-y"
        aria-label="Prompt idea input"
      />
      <div className="text-sm text-slate-400 text-right">
        Character count: {charCount}
      </div>
    </div>
  );
};