
import React from 'react';
import { GameLevel, CharacterEmotion } from './types';

export const GEMINI_MODEL_NAME = "gemini-2.5-flash-preview-04-17";
export const API_KEY_ERROR_MESSAGE = "API_KEY not found. Please ensure the process.env.API_KEY environment variable is set.";

// Sparky Character SVGs
const SparkyBase: React.FC<{ children?: React.ReactNode, eyeContent: React.ReactNode, mouthContent: React.ReactNode, colorClass?: string }> = ({ children, eyeContent, mouthContent, colorClass = "fill-sky-400" }) => (
  <svg viewBox="0 0 100 100" className={`w-32 h-32 transition-all duration-300 ease-in-out ${colorClass}`}>
    {/* Head */}
    <rect x="20" y="10" width="60" height="50" rx="10" className={colorClass} />
    {/* Antenna */}
    <line x1="50" y1="10" x2="50" y2="0" strokeWidth="2" className="stroke-slate-400"/>
    <circle cx="50" cy="0" r="3" className="fill-amber-400"/>
    {/* Eyes */}
    {eyeContent}
    {/* Mouth */}
    {mouthContent}
    {/* Body */}
    <rect x="30" y="60" width="40" height="30" rx="5" className={colorClass} />
    {/* Arms */}
    <rect x="15" y="65" width="10" height="20" rx="3" className={colorClass} />
    <rect x="75" y="65" width="10" height="20" rx="3" className={colorClass} />
    {children}
  </svg>
);

export const SparkySVGs: Record<CharacterEmotion, React.ReactNode> = {
  [CharacterEmotion.NEUTRAL]: (
    <SparkyBase
      eyeContent={<><circle cx="38" cy="35" r="5" className="fill-slate-900" /><circle cx="62" cy="35" r="5" className="fill-slate-900" /></>}
      mouthContent={<line x1="40" y1="50" x2="60" y2="50" strokeWidth="3" className="stroke-slate-900" />}
    />
  ),
  [CharacterEmotion.GUIDE]: ( // Similar to neutral, but could be slightly more engaging
    <SparkyBase
      eyeContent={<><circle cx="38" cy="35" r="5" className="fill-slate-900" /><circle cx="62" cy="35" r="5" className="fill-slate-900" /></>}
      mouthContent={<path d="M 40 50 Q 50 55 60 50" strokeWidth="3" className="stroke-slate-900 fill-transparent" />}
    />
  ),
  [CharacterEmotion.THINKING]: (
    <SparkyBase
      eyeContent={<><circle cx="38" cy="35" r="4" className="fill-slate-900 animate-pulse" /><circle cx="62" cy="35" r="4" className="fill-slate-900 animate-pulse" /></>}
      mouthContent={<ellipse cx="50" cy="50" rx="5" ry="2" className="fill-slate-900" />}
    >
      <text x="70" y="30" fontSize="12" className="fill-slate-100">...</text>
    </SparkyBase>
  ),
  [CharacterEmotion.HAPPY]: (
    <SparkyBase
      eyeContent={<><path d="M 30 35 Q 38 30 46 35" strokeWidth="3" className="stroke-slate-900 fill-transparent" /><path d="M 54 35 Q 62 30 70 35" strokeWidth="3" className="stroke-slate-900 fill-transparent" /></>}
      mouthContent={<path d="M 35 48 Q 50 60 65 48" strokeWidth="3" className="stroke-slate-900 fill-transparent" />}
    />
  ),
  [CharacterEmotion.CONFUSED]: (
    <SparkyBase
      eyeContent={<><circle cx="38" cy="35" r="5" className="fill-slate-900" /><circle cx="62" cy="32" r="3" className="fill-slate-900" /></>}
      mouthContent={<path d="M 40 52 Q 50 48 60 52" strokeWidth="3" className="stroke-slate-900 fill-transparent" />}
    >
       <text x="30" y="25" fontSize="15" className="fill-slate-100">?</text>
    </SparkyBase>
  ),
  [CharacterEmotion.SUCCESS]: (
    <SparkyBase colorClass="fill-green-500"
      eyeContent={<><circle cx="38" cy="35" r="5" className="fill-slate-900" /><circle cx="62" cy="35" r="5" className="fill-slate-900" /></>}
      mouthContent={<path d="M 35 48 Q 50 60 65 48" strokeWidth="3" className="stroke-slate-900 fill-transparent" />}
    >
      <text x="50" y="85" textAnchor="middle" fontSize="10" className="fill-yellow-300 font-bold">🎉</text>
    </SparkyBase>
  ),
  [CharacterEmotion.ERROR]: (
    <SparkyBase colorClass="fill-red-500"
      eyeContent={<><line x1="33" y1="30" x2="43" y2="40" strokeWidth="3" className="stroke-slate-900" /><line x1="43" y1="30" x2="33" y2="40" strokeWidth="3" className="stroke-slate-900" /><line x1="57" y1="30" x2="67" y2="40" strokeWidth="3" className="stroke-slate-900" /><line x1="67" y1="30" x2="57" y2="40" strokeWidth="3" className="stroke-slate-900" /></>}
      mouthContent={<rect x="40" y="48" width="20" height="5" className="fill-slate-900" />}
    />
  ),
};


export const GAME_LEVELS: GameLevel[] = [
  {
    id: 1,
    title: "The Recipe Request",
    scenario: "Sparky wants to bake a cake for his robo-dog, Bolt, but needs a simple recipe.",
    initialDialogue: "Hi there, prompt adventurer! Bolt's birthday is soon and I want to bake him a special robo-dog cake. Can you help me ask the AI for a simple recipe? It should be safe for dogs!",
    objective: "Craft a prompt to get a simple, dog-safe cake recipe from the AI.",
    hints: [
      "Be specific: mention 'dog-safe' and 'simple'.",
      "Ask for ingredients and instructions.",
      "You can specify the type of cake, e.g., 'peanut butter cake'."
    ],
    placeholderPrompt: "Can you give me a simple recipe for a dog-safe peanut butter cake? Include ingredients and step-by-step instructions.",
    successCritera: (prompt, geminiResponse) => {
      const lowerResponse = geminiResponse.toLowerCase();
      return lowerResponse.includes("ingredients") && lowerResponse.includes("instructions") && (lowerResponse.includes("dog-safe") || lowerResponse.includes("dog friendly") || lowerResponse.includes("safe for dogs"));
    },
    successFeedback: "Woof-tastic! This recipe looks perfect for Bolt. You clearly stated what you needed. Great job specifying 'dog-safe'!",
    retryFeedback: "Hmm, this isn't quite right. Try being more specific. Remember to ask for 'ingredients' and 'instructions', and make sure it's 'dog-safe'!"
  },
  {
    id: 2,
    title: "The Storyteller's Spark",
    scenario: "Sparky needs a short, happy bedtime story for a young robot.",
    initialDialogue: "My little cousin, Geary, is having trouble sleeping. Can you help me generate a short, happy bedtime story about a friendly robot who explores a magical garden? About 50 words.",
    objective: "Prompt the AI to create a short (approx. 50 words), happy bedtime story about a friendly robot in a magical garden.",
    hints: [
      "Specify the main character (friendly robot) and setting (magical garden).",
      "Mention the desired tone (happy) and length (short, e.g., 'around 50 words').",
      "Use 'role-playing': 'Tell me a story as if you are a children's storyteller.'"
    ],
    placeholderPrompt: "Tell me a short, happy bedtime story (around 50 words) about a friendly robot named Zip who discovers a glowing flower in a magical crystal garden.",
     successCritera: (prompt, geminiResponse) => {
      const lowerResponse = geminiResponse.toLowerCase();
      const wordCount = geminiResponse.split(/\s+/).length;
      return (lowerResponse.includes("robot") || lowerResponse.includes("bot")) && 
             (lowerResponse.includes("garden") || lowerResponse.includes("magical")) &&
             (lowerResponse.includes("happy") || lowerResponse.includes("joy") || lowerResponse.includes("smile") || !lowerResponse.includes("sad")) &&
             (wordCount > 20 && wordCount < 100); // Approximate length check
    },
    successFeedback: "Zzz... That's a wonderful story! It's short, happy, and perfect for Geary. You gave clear instructions on the theme, tone, and length!",
    retryFeedback: "This story isn't quite what Geary needs. Is it happy? Is it short enough? Does it feature a robot in a magical garden? Try refining your prompt with more details about tone and length."
  },
  {
    id: 3,
    title: "The Code Explainer",
    scenario: "Sparky is learning Python and needs a simple explanation of a 'for loop'.",
    initialDialogue: "I'm trying to learn Python, but 'for loops' are confusing! Can you ask the AI to explain what a 'for loop' is in Python, in simple terms, like I'm a beginner?",
    objective: "Generate a prompt to get a simple, beginner-friendly explanation of Python 'for loops'.",
    hints: [
        "Clearly state the topic: 'Python for loop'.",
        "Specify the target audience: 'beginner', 'simple terms', 'easy to understand'.",
        "You could ask for an analogy or a very small code example."
    ],
    placeholderPrompt: "Explain what a 'for loop' is in Python. Use simple terms and provide a small code example, as if explaining to a complete beginner.",
    successCritera: (prompt, geminiResponse) => {
        const lowerResponse = geminiResponse.toLowerCase();
        return (lowerResponse.includes("for loop") || lowerResponse.includes("looping")) &&
               lowerResponse.includes("python") &&
               (lowerResponse.includes("iterate") || lowerResponse.includes("repeat") || lowerResponse.includes("each item")) &&
               (lowerResponse.includes("example") || lowerResponse.includes("e.g.") || lowerResponse.includes("```python"));
    },
    successFeedback: "Eureka! I think I get 'for loops' now! Your prompt asked for a simple explanation and an example, which was super helpful. Fantastic work!",
    retryFeedback: "That explanation is still a bit too complex for my circuits. Try asking for it in 'simple terms' or 'for a beginner', and maybe request a 'small code example'."
  }
];
