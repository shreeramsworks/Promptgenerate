
import React from 'react';

interface PromptEditorProps {
  userInput: string;
  onUserInputChange: (text: string) => void;
  desiredMaxLength: string;
  onDesiredMaxLengthChange: (length: string) => void;
}

export const PromptEditor: React.FC<PromptEditorProps> = ({ 
  userInput, 
  onUserInputChange,
  desiredMaxLength,
  onDesiredMaxLengthChange
}) => {
  const charCount = userInput.length;

  return (
    <div className="flex flex-col space-y-4">
      <div>
        <label htmlFor="prompt-idea-input" className="block text-lg font-semibold text-slate-300 mb-1">
          Describe Your Prompt Idea
        </label>
        <textarea
          id="prompt-idea-input"
          value={userInput}
          onChange={(e) => onUserInputChange(e.target.value)}
          placeholder="Enter a description of what you want your AI prompt to achieve. For example, 'A story about a cat who learns to fly' or 'Python code to sort a list of numbers'."
          className="w-full h-48 p-4 bg-slate-700 text-slate-100 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-shadow duration-150 resize-y"
          aria-label="Prompt idea input"
          rows={6}
        />
        <div className="text-sm text-slate-400 text-right mt-1">
          Character count: {charCount}
        </div>
      </div>
      <div>
        <label htmlFor="desired-max-length" className="block text-base font-medium text-slate-300 mb-1">
          Desired Max Characters (Optional)
        </label>
        <input
          type="number"
          id="desired-max-length"
          value={desiredMaxLength}
          onChange={(e) => onDesiredMaxLengthChange(e.target.value)}
          placeholder="e.g., 500"
          min="0"
          className="w-full sm:w-1/2 p-2 bg-slate-700 text-slate-100 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-shadow duration-150"
          aria-label="Desired maximum characters for the generated prompt"
        />
      </div>
    </div>
  );
};