
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-800 shadow-lg">
      <div className="container mx-auto px-4 py-5">
        <h1 className="text-3xl font-bold text-cyan-400 tracking-tight">
          PromptPerfect ✨
        </h1>
        <p className="text-sm text-slate-400">Describe Your Idea, We'll Generate the Perfect AI Prompt</p>
      </div>
    </header>
  );
};