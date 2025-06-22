
export enum CharacterEmotion {
  NEUTRAL = 'neutral',
  THINKING = 'thinking',
  HAPPY = 'happy',
  CONFUSED = 'confused',
  SUCCESS = 'success',
  ERROR = 'error',
  GUIDE = 'guide',
}

export interface GameLevel {
  id: number;
  title: string;
  scenario: string; // The problem/task Sparky or another character faces
  initialDialogue: string; // What Sparky says to introduce the problem
  objective: string; // What the user needs to achieve with their prompt
  hints: string[]; // Tips for crafting a good prompt
  successCritera: (prompt: string, geminiResponse: string) => boolean; // Function to check if response is good
  successFeedback: string; // Feedback on success
  retryFeedback: string; // Feedback on needing improvement
  placeholderPrompt: string; // Example prompt to guide user
}

export interface Message {
  sender: 'user' | 'gemini' | 'sparky';
  text: string;
  emotion?: CharacterEmotion; // For Sparky's messages
}

export interface SparkyState {
  emotion: CharacterEmotion;
  dialogue: string;
}

export interface GroundingChunkWeb {
  uri: string;
  title: string;
}

export interface GroundingChunk {
 web: GroundingChunkWeb;
}
