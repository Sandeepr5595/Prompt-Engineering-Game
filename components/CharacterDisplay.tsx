
import React from 'react';
import { CharacterEmotion } from '../types';
import { SparkySVGs } from '../constants';

interface CharacterDisplayProps {
  emotion: CharacterEmotion;
  dialogue: string;
}

const CharacterDisplay: React.FC<CharacterDisplayProps> = ({ emotion, dialogue }) => {
  return (
    <div className="flex flex-col items-center p-6 bg-slate-800 rounded-xl shadow-2xl w-full max-w-md">
      <div className="mb-4 transform hover:scale-105 transition-transform duration-300">
        {SparkySVGs[emotion] || SparkySVGs[CharacterEmotion.NEUTRAL]}
      </div>
      <div className="mt-2 p-4 bg-slate-700 rounded-lg text-center min-h-[60px] w-full">
        <p className="text-slate-200 text-sm md:text-base italic">"{dialogue}"</p>
      </div>
    </div>
  );
};

export default CharacterDisplay;
