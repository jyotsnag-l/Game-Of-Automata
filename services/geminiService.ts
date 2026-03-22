import { GoogleGenAI, Type } from "@google/genai";
import { Puzzle, Level } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const puzzleSchema = {
  type: Type.OBJECT,
  properties: {
    description: {
      type: Type.STRING,
      description: "A description of the language the CORRECT automaton accepts.",
    },
    automaton: {
      type: Type.OBJECT,
      description: "The INCORRECT automaton to be presented to the user.",
      properties: {
        states: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: { id: { type: Type.STRING } },
            required: ['id'],
          },
        },
        alphabet: { type: Type.ARRAY, items: { type: Type.STRING } },
        transitions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              from: { type: Type.STRING },
              to: { type: Type.STRING },
              label: { type: Type.STRING },
            },
            required: ['from', 'to', 'label'],
          },
        },
        startState: { type: Type.STRING },
        finalStates: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ['states', 'alphabet', 'transitions', 'startState', 'finalStates'],
    },
    solution: {
      type: Type.OBJECT,
      description: "The CORRECT automaton.",
      properties: {
        states: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: { id: { type: Type.STRING } },
            required: ['id'],
          },
        },
        alphabet: { type: Type.ARRAY, items: { type: Type.STRING } },
        transitions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              from: { type: Type.STRING },
              to: { type: Type.STRING },
              label: { type: Type.STRING },
            },
            required: ['from', 'to', 'label'],
          },
        },
        startState: { type: Type.STRING },
        finalStates: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
       required: ['states', 'alphabet', 'transitions', 'startState', 'finalStates'],
    },
    errorDescription: {
        type: Type.STRING,
        description: "A brief explanation of the error in the initial automaton."
    },
    hint: {
        type: Type.STRING,
        description: "A hint to help the user find the solution."
    },
  },
  required: ['description', 'automaton', 'solution', 'errorDescription', 'hint'],
};

const getPromptForLevel = (level: Level): string => {
  let promptDetails = '';
  switch (level) {
    case 'medium':
      promptDetails = `
        - Generate a simple Deterministic Finite Automaton (DFA) with 4 to 5 states.
        - The automaton should have at least one cycle.
        - The error should involve one or two incorrect final states.
      `;
      break;
    case 'hard':
      promptDetails = `
        - Generate a more complex Deterministic Finite Automaton (DFA) with 5 states.
        - The structure should involve branching and cycles to make it less obvious.
        - The error should involve one or two incorrect final states, but the reason should be more subtle (e.g., related to an edge case in the language).
      `;
      break;
    case 'easy':
    default:
      promptDetails = `
        - Generate a very simple, **strictly linear** Deterministic Finite Automaton (DFA) with exactly 3 states, named 'q0', 'q1', and 'q2'.
        - The structure MUST be a straight line: transitions should primarily go from q0 to q1, and from q1 to q2.
        - **Crucially, there must be NO backward transitions** between different states (e.g., no transition from q2 to q1, or q1 to q0).
        - Self-loops (e.g., a transition from q1 to q1) are allowed.
        - The error presented to the user **MUST be exactly one incorrect final state**. This means the 'automaton' and 'solution' objects differ by only a single state being either added to or removed from the 'finalStates' array. For example, if the solution has final state ['q2'], the incorrect automaton might have ['q1'] or ['q2', 'q0']. Do not make more than one change.
        - The language description should be very simple to match the automaton's simplicity, for instance "Accepts strings of length 2" or "Accepts strings ending in '00'".
      `;
      break;
  }

  return `
    You are an expert in automata theory. Your task is to generate a finite automaton puzzle for a user to solve.

    Your instructions for this puzzle are:
    ${promptDetails}
    
    General Rules:
    - The alphabet must be {0, 1}.
    - The user can only fix the puzzle by adding or removing states from the set of final states. Do not introduce any other type of error (like wrong transitions or start state).
    - Provide the puzzle details in a valid JSON format that conforms to the schema.
    - The 'automaton' object should represent the INCORRECT DFA that the user will see.
    - The 'solution' object should represent the CORRECT DFA.
    - The 'description' should clearly and simply explain the language the CORRECT DFA is supposed to accept.
    - The 'errorDescription' should explain what is wrong with the initial automaton's final states.
    - The 'hint' should guide the user toward finding the error without explicitly stating the solution.

    Example Language Descriptions:
    - "Accepts all strings ending in '01'."
    - "Accepts all strings with an even number of 0s."
    - "Accepts all strings that do not contain the substring '11'."

    Ensure all state IDs used in 'transitions', 'startState', and 'finalStates' are defined in the 'states' array.
  `;
};

export const generatePuzzle = async (level: Level): Promise<Puzzle> => {
  const prompt = getPromptForLevel(level);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: puzzleSchema,
      },
    });

    const jsonString = response.text;
    const puzzleData = JSON.parse(jsonString);
    
    // Basic validation
    if (!puzzleData.description || !puzzleData.automaton || !puzzleData.solution) {
      throw new Error("Generated puzzle is missing required fields.");
    }

    return puzzleData as Puzzle;
  } catch (error) {
    console.error("Error generating puzzle from Gemini API:", error);
    throw new Error("Failed to parse puzzle from Gemini API response.");
  }
};