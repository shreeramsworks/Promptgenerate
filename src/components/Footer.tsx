
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 py-4 mt-auto">
      <div className="container mx-auto px-4 text-center text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} PromptPerfect.</p>
        <p>For educational and demonstration purposes only.</p>
      </div>
    </footer>
  );
};