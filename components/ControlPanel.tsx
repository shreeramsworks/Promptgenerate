
import React from 'react';

interface ControlPanelProps {
  onGenerate: () => void; // Renamed from onAnalyze
  onClear: () => void;
  onCopy: () => void;
  isLoading: boolean;
  showCopiedMessage: boolean;
  isInputEmpty: boolean; // Renamed from isPromptEmpty
  isOutputEmpty: boolean; // New prop to control copy button for generated prompt
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  onGenerate,
  onClear,
  onCopy,
  isLoading,
  showCopiedMessage,
  isInputEmpty,
  isOutputEmpty
}) => {
  const buttonBaseClasses = "px-6 py-2.5 rounded-md font-medium text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed";
  const primaryButtonClasses = `bg-cyan-500 hover:bg-cyan-600 text-white focus:ring-cyan-400 ${buttonBaseClasses}`;
  const secondaryButtonClasses = `bg-slate-600 hover:bg-slate-500 text-slate-100 focus:ring-slate-400 ${buttonBaseClasses}`;

  return (
    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 items-center">
      <button
        onClick={onGenerate}
        disabled={isLoading || isInputEmpty}
        className={`${primaryButtonClasses} w-full sm:w-auto flex-grow sm:flex-grow-0`}
        aria-label="Generate detailed prompt"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </div>
        ) : (
          'Generate Prompt'
        )}
      </button>
      <button
        onClick={onCopy}
        disabled={isLoading || isOutputEmpty} // Copy button depends on output
        className={`${secondaryButtonClasses} w-full sm:w-auto relative`}
        aria-label="Copy generated prompt"
      >
        {showCopiedMessage ? 'Copied!' : 'Copy Generated Prompt'}
      </button>
      <button
        onClick={onClear}
        disabled={isLoading || (isInputEmpty && isOutputEmpty)} // Clear button active if there's anything to clear
        className={`${secondaryButtonClasses} bg-red-600 hover:bg-red-700 focus:ring-red-500 w-full sm:w-auto`}
        aria-label="Clear input and output"
      >
        Clear All
      </button>
    </div>
  );
};