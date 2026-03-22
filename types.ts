export interface State {
  id: string;
}

export interface Transition {
  from: string;
  to: string;
  label: string;
}

export interface Automaton {
  states: State[];
  alphabet: string[];
  transitions: Transition[];
  startState: string;
  finalStates: string[];
}

export interface Puzzle {
  description: string;
  automaton: Automaton;
  solution: Automaton;
  errorDescription: string;
  hint: string;
}

export type Level = 'easy' | 'medium' | 'hard';
