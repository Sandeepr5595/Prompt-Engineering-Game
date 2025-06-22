
import React, { useState, useEffect, useCallback } from 'react';
import { GameLevel, CharacterEmotion, SparkyState } from '../types';
import { GAME_LEVELS, API_KEY_ERROR_MESSAGE } from '../constants';
import { generateGeminiResponse, GeminiResponse as ApiGeminiResponse } from '../services/geminiService';
import CharacterDisplay from './CharacterDisplay';
import PromptInputForm from './PromptInputForm';
import GeminiResponseView from './GeminiResponseView';
import Button from './ui/Button';

const GameManager: React.FC = () => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [sparkyState, setSparkyState] = useState<SparkyState>({
    emotion: CharacterEmotion.GUIDE,
    dialogue: GAME_LEVELS[0].initialDialogue,
  });
  const [userPrompt, setUserPrompt] = useState<string | null>(null);
  const [geminiResponse, setGeminiResponse] = useState<string | null>(null);
  const [gameFeedback, setGameFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [isGameFinished, setIsGameFinished] = useState(false);

  const currentLevel: GameLevel = GAME_LEVELS[currentLevelIndex];

  useEffect(() => {
    // Check for API Key on mount
    if (!process.env.API_KEY) {
      setApiKeyMissing(true);
      setSparkyState({
        emotion: CharacterEmotion.ERROR,
        dialogue: API_KEY_ERROR_MESSAGE,
      });
    }
  }, []);

  const loadLevel = useCallback((levelIdx: number) => {
    if (levelIdx >= GAME_LEVELS.length) {
        setIsGameFinished(true);
        setSparkyState({
            emotion: CharacterEmotion.SUCCESS,
            dialogue: "Wow! You've mastered all the challenges! You're a prompt engineering superstar! 🌟"
        });
        return;
    }
    const level = GAME_LEVELS[levelIdx];
    setCurrentLevelIndex(levelIdx);
    setSparkyState({ emotion: CharacterEmotion.GUIDE, dialogue: level.initialDialogue });
    setUserPrompt(null);
    setGeminiResponse(null);
    setGameFeedback(null);
    setLevelCompleted(false);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadLevel(currentLevelIndex);
  }, [currentLevelIndex, loadLevel]);

  const handlePromptSubmit = async (prompt: string) => {
    if (apiKeyMissing || !currentLevel) return;

    setIsLoading(true);
    setUserPrompt(prompt);
    setGeminiResponse(null);
    setGameFeedback(null);
    setSparkyState({ emotion: CharacterEmotion.THINKING, dialogue: "Hmm, let me process that prompt..." });

    try {
      const apiResponse: ApiGeminiResponse = await generateGeminiResponse(prompt);
      setGeminiResponse(apiResponse.text);

      const isSuccess = currentLevel.successCritera(prompt, apiResponse.text);
      if (isSuccess) {
        setSparkyState({ emotion: CharacterEmotion.SUCCESS, dialogue: currentLevel.successFeedback });
        setGameFeedback(currentLevel.successFeedback);
        setLevelCompleted(true);
      } else {
        setSparkyState({ emotion: CharacterEmotion.CONFUSED, dialogue: currentLevel.retryFeedback });
        setGameFeedback(currentLevel.retryFeedback);
        setLevelCompleted(false);
      }
    } catch (error: any) {
      console.error("Game Manager Error:", error);
      let errorMessage = "An unexpected error occurred. My circuits are frazzled!";
      if (error.message === "API_KEY_MISSING") {
        errorMessage = API_KEY_ERROR_MESSAGE;
        setApiKeyMissing(true);
      } else if (error.message && error.message.includes("Invalid API Key")) {
        errorMessage = "It seems there's an issue with the API Key. Please check it and refresh.";
        setApiKeyMissing(true); // Treat as missing for UI purposes
      }
      
      setSparkyState({ emotion: CharacterEmotion.ERROR, dialogue: errorMessage });
      setGameFeedback(errorMessage);
      setGeminiResponse(null); // Clear previous response on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextLevel = () => {
    if (currentLevelIndex < GAME_LEVELS.length - 1) {
      setCurrentLevelIndex(prevIndex => prevIndex + 1);
    } else {
      setIsGameFinished(true);
      setSparkyState({
        emotion: CharacterEmotion.SUCCESS,
        dialogue: "You've completed all levels! You're a true Prompt Artisan! Congratulations!"
      });
    }
  };
  
  const handleRestartGame = () => {
    setIsGameFinished(false);
    setCurrentLevelIndex(0); // This will trigger the useEffect to load level 0
    // No need to call loadLevel(0) here, useEffect will handle it
  };


  if (apiKeyMissing && !isGameFinished) {
    return (
      <div className="w-full max-w-2xl p-6 bg-slate-800 rounded-xl shadow-2xl text-center">
        <CharacterDisplay emotion={CharacterEmotion.ERROR} dialogue={API_KEY_ERROR_MESSAGE} />
        <p className="mt-4 text-red-400">Please set the <code className="bg-slate-700 p-1 rounded">process.env.API_KEY</code> environment variable and refresh the page.</p>
      </div>
    );
  }

  if (isGameFinished) {
    return (
      <div className="w-full max-w-2xl p-6 bg-slate-800 rounded-xl shadow-2xl text-center flex flex-col items-center">
        <CharacterDisplay emotion={CharacterEmotion.SUCCESS} dialogue={sparkyState.dialogue} />
        <p className="mt-4 text-2xl text-green-400 font-semibold">CONGRATULATIONS!</p>
        <p className="text-slate-300 mb-6">You've successfully navigated the world of prompt engineering!</p>
        <Button onClick={handleRestartGame} variant="success">Play Again?</Button>
      </div>
    );
  }
  
  if (!currentLevel) {
     return <div className="text-center p-8"><CharacterDisplay emotion={CharacterEmotion.ERROR} dialogue="Oh no! We've lost track of the levels. Please refresh." /></div>;
  }


  return (
    <div className="w-full max-w-3xl p-4 md:p-6 bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-xl space-y-8 border border-slate-700">
      <div className="grid md:grid-cols-2 gap-6 items-start">
        <div className="md:sticky md:top-6">
           <CharacterDisplay emotion={sparkyState.emotion} dialogue={sparkyState.dialogue} />
        </div>
        
        <div className="space-y-6">
            <div className="p-4 bg-slate-700/70 rounded-lg">
                <h2 className="text-2xl font-bold text-sky-400 mb-2">Level {currentLevel.id}: {currentLevel.title}</h2>
                <p className="text-slate-300 mb-1"><strong className="text-slate-100">Scenario:</strong> {currentLevel.scenario}</p>
                <p className="text-slate-300"><strong className="text-slate-100">Your Objective:</strong> {currentLevel.objective}</p>
                <div className="mt-3">
                    <h4 className="font-semibold text-sky-300">Hints:</h4>
                    <ul className="list-disc list-inside text-slate-400 text-sm">
                        {currentLevel.hints.map((hint, i) => <li key={i}>{hint}</li>)}
                    </ul>
                </div>
            </div>

            <PromptInputForm 
              onSubmit={handlePromptSubmit} 
              isLoading={isLoading} 
              placeholderPrompt={currentLevel.placeholderPrompt}
              currentLevelId={currentLevel.id}
            />
        </div>
      </div>

      {(geminiResponse || gameFeedback) && (
        <GeminiResponseView 
            geminiResponse={geminiResponse} 
            feedback={gameFeedback} 
            isSuccess={levelCompleted ? true : (geminiResponse ? false : undefined)}
        />
      )}

      {levelCompleted && !isGameFinished && (
        <div className="text-center mt-6">
          <Button onClick={handleNextLevel} variant="success" className="animate-pulse">
            Next Level &rarr;
          </Button>
        </div>
      )}
    </div>
  );
};

export default GameManager;
