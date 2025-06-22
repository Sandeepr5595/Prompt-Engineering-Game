
import React, { useState } from 'react';
import Button from './ui/Button';
import LoadingIcon from './ui/LoadingIcon';

interface PromptInputFormProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
  placeholderPrompt: string;
  currentLevelId: number;
}

const PromptInputForm: React.FC<PromptInputFormProps> = ({ onSubmit, isLoading, placeholderPrompt, currentLevelId }) => {
  const [prompt, setPrompt] = useState('');

  // Reset prompt when level changes
  React.useEffect(() => {
    setPrompt('');
  }, [currentLevelId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder={placeholderPrompt || "Type your prompt here..."}
        className="w-full h-32 p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-150 disabled:opacity-50"
        disabled={isLoading}
        aria-label="Prompt Input Area"
      />
      <Button type="submit" disabled={isLoading || !prompt.trim()} className="w-full flex items-center justify-center">
        {isLoading ? <LoadingIcon size="w-5 h-5 mr-2" /> : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2">
            <path d="M3.105 3.105a1.5 1.5 0 012.122-.001L17.79 14.522a1.5 1.5 0 01-2.122 2.122L3.105 5.227a1.5 1.5 0 01-.001-2.122zM3.497 12.083a1.5 1.5 0 010-2.122L15.352.099a1.5 1.5 0 012.122 0l2.33 2.33a1.5 1.5 0 010 2.122L7.948 16.408a1.5 1.5 0 01-2.122 0L3.497 14.056V12.083z" />
          </svg>
        )}
        {isLoading ? 'Thinking...' : 'Send Prompt'}
      </Button>
    </form>
  );
};

export default PromptInputForm;
