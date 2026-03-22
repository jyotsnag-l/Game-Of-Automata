import React from 'react';
import { UndoIcon, ResetIcon, HintIcon, NewGameIcon } from './icons';

interface ControlsProps {
  onUndo: () => void;
  onReset: () => void;
  onHint: () => void;
  onNewGame: () => void;
  undoDisabled: boolean;
}

const ControlButton: React.FC<{ onClick: () => void; disabled?: boolean; children: React.ReactNode; className?: string }> = ({ onClick, disabled, children, className }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-lg text-base font-semibold transition-all duration-200 ease-in-out border-b-4 active:border-b-2 active:mt-0.5 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  >
    {children}
  </button>
);

const Controls: React.FC<ControlsProps> = ({ onUndo, onReset, onHint, onNewGame, undoDisabled }) => {
  return (
    <div className="bg-[var(--bg-navy)]/80 backdrop-blur-sm rounded-lg p-4 border border-[var(--ui-stroke)] space-y-3 shadow-2xl shadow-black/50">
      <div className="grid grid-cols-2 gap-3">
        <ControlButton onClick={onUndo} disabled={undoDisabled} className="bg-yellow-700 hover:bg-yellow-600 text-yellow-100 border-yellow-900 active:bg-yellow-700">
          <UndoIcon className="w-5 h-5" /> Undo
        </ControlButton>
        <ControlButton onClick={onReset} className="bg-orange-700 hover:bg-orange-600 text-orange-100 border-orange-900 active:bg-orange-700">
          <ResetIcon className="w-5 h-5" /> Reset
        </ControlButton>
      </div>
      <ControlButton onClick={onHint} className="bg-blue-700 hover:bg-blue-600 text-blue-100 border-blue-900 active:bg-blue-700">
        <HintIcon className="w-5 h-5" /> Get a Hint
      </ControlButton>
      <ControlButton onClick={onNewGame} className="bg-[var(--accent-amber)] hover:brightness-110 text-black border-yellow-700 active:bg-[var(--accent-amber)]">
        <NewGameIcon className="w-5 h-5" /> New Puzzle
      </ControlButton>
    </div>
  );
};

export default Controls;