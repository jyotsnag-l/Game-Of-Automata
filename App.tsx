import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Automaton, Puzzle, Level } from './types';
import { generatePuzzle } from './services/geminiService';
import AutomatonGraph from './components/AutomatonGraph';
import Controls from './components/Controls';
import PuzzlePanel from './components/PuzzlePanel';
import { InfoIcon, LoadingSpinner } from './components/icons';

const levels: Level[] = ['easy', 'medium', 'hard'];
const levelStyles: Record<Level, { base: string, active: string }> = {
  easy: { base: 'border-green-500/50 hover:bg-green-500/10 hover:border-green-500/80', active: 'bg-green-500/20 border-green-500 text-green-300' },
  medium: { base: 'border-yellow-500/50 hover:bg-yellow-500/10 hover:border-yellow-500/80', active: 'bg-yellow-500/20 border-yellow-500 text-yellow-300' },
  hard: { base: 'border-red-500/50 hover:bg-red-500/10 hover:border-red-500/80', active: 'bg-red-500/20 border-red-500 text-red-300' },
};

const LevelSelector: React.FC<{ currentLevel: Level; onLevelChange: (level: Level) => void; }> = ({ currentLevel, onLevelChange }) => {
  return (
    <div className="flex justify-center items-center gap-2 sm:gap-3">
      {levels.map((level) => (
        <button
          key={level}
          onClick={() => onLevelChange(level)}
          className={`px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base font-semibold capitalize transition-all duration-200 ease-in-out border-2
            ${currentLevel === level
              ? `${levelStyles[level].active}`
              : `text-gray-300 ${levelStyles[level].base}`
            }
          `}
        >
          {level}
        </button>
      ))}
    </div>
  );
};


const App: React.FC = () => {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [currentAutomaton, setCurrentAutomaton] = useState<Automaton | null>(null);
  const [history, setHistory] = useState<Automaton[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [level, setLevel] = useState<Level>('easy');
  const [showInstructions, setShowInstructions] = useState<boolean>(true);
  const [justClickedStateId, setJustClickedStateId] = useState<string | null>(null);

  useEffect(() => {
    if (justClickedStateId) {
      const timer = setTimeout(() => {
        setJustClickedStateId(null);
      }, 500); // Animation duration
      return () => clearTimeout(timer);
    }
  }, [justClickedStateId]);

  const checkSolution = useCallback((automaton: Automaton) => {
    if (!puzzle) return false;
    const currentFinalStates = new Set(automaton.finalStates);
    const solutionFinalStates = new Set(puzzle.solution.finalStates);

    if (currentFinalStates.size !== solutionFinalStates.size) {
      return false;
    }

    for (const state of currentFinalStates) {
      if (!solutionFinalStates.has(state)) {
        return false;
      }
    }

    return true;
  }, [puzzle]);

  const fetchNewPuzzle = useCallback(async (currentLevel: Level) => {
    setIsLoading(true);
    setError(null);
    setPuzzle(null);
    setCurrentAutomaton(null);
    setHistory([]);
    setIsSolved(false);
    setShowHint(false);

    try {
      const newPuzzle = await generatePuzzle(currentLevel);
      setPuzzle(newPuzzle);
      setCurrentAutomaton(newPuzzle.automaton);
      setHistory([newPuzzle.automaton]);
    } catch (err) {
      setError('Failed to generate a new puzzle. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNewPuzzle(level);
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  const handleLevelChange = (newLevel: Level) => {
    if (newLevel !== level) {
      setLevel(newLevel);
    }
  };

  const handleStateClick = (stateId: string) => {
    if (isSolved || !currentAutomaton) return;
    
    setJustClickedStateId(stateId);

    const newAutomaton = JSON.parse(JSON.stringify(currentAutomaton)) as Automaton;
    const finalStatesSet = new Set(newAutomaton.finalStates);

    if (finalStatesSet.has(stateId)) {
      finalStatesSet.delete(stateId);
    } else {
      finalStatesSet.add(stateId);
    }
    newAutomaton.finalStates = Array.from(finalStatesSet);

    setHistory(prev => [...prev, newAutomaton]);
    setCurrentAutomaton(newAutomaton);

    if (checkSolution(newAutomaton)) {
      setIsSolved(true);
    }
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    const newHistory = history.slice(0, -1);
    setHistory(newHistory);
    setCurrentAutomaton(newHistory[newHistory.length - 1]);
    setIsSolved(false);
    setShowHint(false);
  };
  
  const handleReset = () => {
    if (!puzzle) return;
    setCurrentAutomaton(puzzle.automaton);
    setHistory([puzzle.automaton]);
    setIsSolved(false);
    setShowHint(false);
  };

  const handleShowHint = () => {
    setShowHint(true);
  };
  
  const handleNewGame = () => {
    fetchNewPuzzle(level);
  };

  const memoizedAutomatonGraph = useMemo(() => {
    return currentAutomaton ? (
      <AutomatonGraph 
        automaton={currentAutomaton} 
        onStateClick={handleStateClick}
        pulseStateId={justClickedStateId}
      />
    ) : null;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAutomaton, justClickedStateId]);

  return (
    <>
      {showInstructions && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[var(--bg-navy)] border border-[var(--ui-stroke)] rounded-lg max-w-lg w-full p-6 text-center shadow-2xl shadow-black/50 animate-fade-slide-up relative">
             <div className="absolute -top-px -left-px -right-px h-1.5 bg-gradient-to-r from-transparent via-[var(--accent-amber)] to-transparent"></div>
            <h2 className="text-2xl font-bold text-[var(--accent-amber)] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Welcome to the Game of Automata!</h2>
            <p className="text-[var(--text-primary)] mb-2">Your mission is to fix a broken Finite Automaton.</p>
            <p className="text-[var(--text-primary)] mb-4">The automaton's logic is correct, but one or more of its <strong className="text-[var(--accent-amber)] font-semibold">final states</strong> are wrong. Your goal is to identify which states should be final (glowing double circles) and which should not be.</p>
            <p className="text-[var(--text-muted)] text-sm mb-6">Click on a state to toggle its final status.</p>
            <button
              onClick={() => setShowInstructions(false)}
              className="bg-[var(--accent-amber)] hover:brightness-110 text-black font-bold py-2 px-8 rounded-lg transition-all"
            >
              Begin
            </button>
          </div>
        </div>
      )}

      <div className="min-h-screen flex flex-col items-center p-4 sm:p-6">
        <header className="w-full max-w-7xl text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--accent-amber)] tracking-wide" style={{ fontFamily: 'var(--font-heading)' }}>Game of Automata</h1>
          <p className="text-[var(--text-muted)] mt-2">Find and fix the error in the Finite Automaton!</p>
        </header>

        <LevelSelector currentLevel={level} onLevelChange={handleLevelChange} />
        
        <main className="w-full max-w-7xl flex-grow flex flex-col lg:flex-row gap-6 mt-6">
          <div className="w-full lg:w-2/3 bg-[var(--bg-navy)]/80 backdrop-blur-sm rounded-lg border border-[var(--ui-stroke)] shadow-2xl shadow-black/50 flex items-center justify-center p-4 min-h-[350px] sm:min-h-[450px] lg:min-h-0 relative">
             <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-[var(--ui-stroke)]"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-[var(--ui-stroke)]"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-[var(--ui-stroke)]"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-[var(--ui-stroke)]"></div>

            {isLoading && <div className="flex flex-col items-center gap-4 text-lg text-[var(--text-muted)]"><LoadingSpinner className="w-16 h-16" /><p>Generating New Puzzle...</p></div>}
            {error && <p className="text-red-400 text-lg">{error}</p>}
            {!isLoading && !error && memoizedAutomatonGraph}
            <button onClick={() => setShowInstructions(true)} className="absolute top-2 right-2 text-[var(--text-muted)] hover:text-[var(--accent-amber)] transition-colors p-2" aria-label="Show instructions">
              <InfoIcon className="w-6 h-6"/>
            </button>
          </div>
          
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <PuzzlePanel 
              puzzle={puzzle} 
              isSolved={isSolved} 
              showHint={showHint}
            />
            <Controls 
              onUndo={handleUndo} 
              onReset={handleReset} 
              onHint={handleShowHint} 
              onNewGame={handleNewGame}
              undoDisabled={history.length <= 1}
            />
          </div>
        </main>
      </div>
    </>
  );
};

export default App;