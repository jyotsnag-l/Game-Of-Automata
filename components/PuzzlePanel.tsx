import React from 'react';
import { Puzzle } from '../types';
import { CheckCircleIcon, HintIcon } from './icons';

interface PuzzlePanelProps {
  puzzle: Puzzle | null;
  isSolved: boolean;
  showHint: boolean;
}

const PuzzlePanel: React.FC<PuzzlePanelProps> = ({ puzzle, isSolved, showHint }) => {
  return (
    <div className="bg-[var(--bg-navy)]/80 backdrop-blur-sm rounded-lg p-5 border border-[var(--ui-stroke)] flex-grow flex flex-col justify-between shadow-2xl shadow-black/50">
      <div>
        <h2 className="text-xl font-bold text-[var(--accent-amber)] border-b-2 border-[var(--ui-stroke)] pb-2 mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          OBJECTIVE
        </h2>
        <p className="text-[var(--text-primary)] text-base leading-relaxed">
          {puzzle ? puzzle.description : 'Loading description...'}
        </p>
        <p className="text-[var(--text-muted)] text-sm mt-4 p-3 bg-[var(--bg-deep-navy)]/50 rounded-md border border-[var(--ui-stroke)]">
            <strong>Controls:</strong> Click a state to toggle its final status (a glowing ring).
        </p>
      </div>
      
      <div className="mt-4 pt-4 border-t-2 border-[var(--ui-stroke)] min-h-[120px] flex items-center justify-center">
        {isSolved ? (
          <div key="solved" className="text-center animate-fade-slide-up w-full">
            <div className="flex flex-col justify-center items-center gap-2 text-[var(--accent-teal)]">
              <CheckCircleIcon className="w-10 h-10"/>
              <h3 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>SOLVED</h3>
            </div>
            <p className="text-sm mt-2 text-gray-300">{puzzle?.errorDescription}</p>
          </div>
        ) : showHint ? (
          <div key="hint" className="bg-blue-500/10 border-l-4 border-blue-400 text-blue-200 p-4 w-full animate-fade-slide-up flex gap-3">
            <HintIcon className="w-6 h-6 flex-shrink-0 mt-0.5"/>
            <div>
              <h3 className="font-bold text-lg leading-tight">Hint</h3>
              <p className="text-base">{puzzle?.hint}</p>
            </div>
          </div>
        ) : (
             <div key="default" className="text-[var(--text-muted)] text-center text-base p-3 animate-fade-slide-up">
                <p>Adjust the final states to match the objective.</p>
             </div>
        )}
      </div>
    </div>
  );
};

export default PuzzlePanel;