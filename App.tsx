
import React from 'react';
import GameManager from './components/GameManager.tsx';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 selection:bg-sky-400 selection:text-sky-900">
      <header className="mb-8 text-center">
        <h1 className="text-5xl font-bold text-sky-400">Prompt Engineering Adventure</h1>
        <p className="text-slate-400 text-lg mt-2">Learn to craft powerful prompts with Sparky the Robot!</p>
      </header>
      <GameManager />
      <footer className="mt-12 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} AI Adventures Inc. Powering up your prompt skills.</p>
        <p>Model: gemini-2.5-flash-preview-04-17</p>
      </footer>
    </div>
  );
};

export default App;