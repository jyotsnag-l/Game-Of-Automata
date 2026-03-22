import React, { useMemo, useState, useEffect } from 'react';
import { Automaton, State as StateType } from '../types';

interface AutomatonGraphProps {
  automaton: Automaton;
  onStateClick: (stateId: string) => void;
  pulseStateId: string | null;
}

const STATE_RADIUS = 25;
const FINAL_STATE_OFFSET = 4;

interface PositionedState extends StateType {
  x: number;
  y: number;
}

interface SimulatedState extends PositionedState {
    dx: number;
    dy: number;
}

const AutomatonGraph: React.FC<AutomatonGraphProps> = ({ automaton, onStateClick, pulseStateId }) => {
  const [positionedStates, setPositionedStates] = useState<PositionedState[]>([]);

  useEffect(() => {
    if (!automaton || automaton.states.length === 0) {
      setPositionedStates([]);
      return;
    }

    const { states, transitions } = automaton;

    const WIDTH = 550;
    const HEIGHT = 450;
    const PADDING = STATE_RADIUS + 10;
    const ITERATIONS = 150;

    const stateIndexMap = new Map(states.map((s, i) => [s.id, i]));
    const numStates = states.length;
    const k = Math.sqrt((WIDTH * HEIGHT) / numStates) * 0.9;

    const attractiveForce = (d: number) => (d * d) / k;
    const repulsiveForce = (d: number) => (k * k) / d;

    let simulationStates: SimulatedState[] = states.map((state, i) => ({
      ...state,
      x: WIDTH / 2 + (WIDTH / 3.5) * Math.cos((2 * Math.PI * i) / numStates),
      y: HEIGHT / 2 + (HEIGHT / 3.5) * Math.sin((2 * Math.PI * i) / numStates),
      dx: 0,
      dy: 0,
    }));

    let temp = WIDTH / 10;

    for (let i = 0; i < ITERATIONS; i++) {
      // Calculate repulsive forces
      for (let u = 0; u < numStates; u++) {
        simulationStates[u].dx = 0;
        simulationStates[u].dy = 0;
        for (let v = 0; v < numStates; v++) {
          if (u === v) continue;
          const dx = simulationStates[u].x - simulationStates[v].x;
          const dy = simulationStates[u].y - simulationStates[v].y;
          const distance = Math.max(0.1, Math.sqrt(dx * dx + dy * dy));
          const force = repulsiveForce(distance) / distance;
          simulationStates[u].dx += dx * force;
          simulationStates[u].dy += dy * force;
        }
      }

      // Calculate attractive forces
      for (const transition of transitions) {
        const uIndex = stateIndexMap.get(transition.from);
        const vIndex = stateIndexMap.get(transition.to);
        if (uIndex === undefined || vIndex === undefined || uIndex === vIndex) continue;

        const u = simulationStates[uIndex];
        const v = simulationStates[vIndex];

        const dx = u.x - v.x;
        const dy = u.y - v.y;
        const distance = Math.max(0.1, Math.sqrt(dx * dx + dy * dy));
        const force = attractiveForce(distance) / distance;

        const ddx = dx * force;
        const ddy = dy * force;

        u.dx -= ddx;
        u.dy -= ddy;
        v.dx += ddx;
        v.dy += ddy;
      }

      // Update positions
      for (let u = 0; u < numStates; u++) {
        const { x, y, dx, dy } = simulationStates[u];
        const displacement = Math.max(0.1, Math.sqrt(dx * dx + dy * dy));
        
        const newX = x + (dx / displacement) * Math.min(displacement, temp);
        const newY = y + (dy / displacement) * Math.min(displacement, temp);

        simulationStates[u].x = Math.max(PADDING, Math.min(WIDTH - PADDING, newX));
        simulationStates[u].y = Math.max(PADDING, Math.min(HEIGHT - PADDING, newY));
      }
      temp *= (1 - i / ITERATIONS);
    }

    setPositionedStates(simulationStates);
  }, [automaton]);
  
  const stateMap = useMemo(() => {
    return new Map(positionedStates.map(s => [s.id, s]));
  }, [positionedStates]);

  const renderedTransitions = useMemo(() => {
    const pairCounts = new Map<string, number>();
    automaton.transitions.forEach(({ from, to }) => {
      if (from === to) return;
      const key = [from, to].sort().join(',');
      pairCounts.set(key, (pairCounts.get(key) || 0) + 1);
    });

    return automaton.transitions.map(({ from, to, label }, i) => {
      const fromState = stateMap.get(from);
      const toState = stateMap.get(to);
      if (!fromState || !toState) return null;

      const key = `${from}-${to}-${label}-${i}`;

      if (fromState.id === toState.id) {
        const angle = Math.PI / 4;
        const startX = fromState.x - STATE_RADIUS * Math.sin(angle);
        const startY = fromState.y - STATE_RADIUS * Math.cos(angle);
        const endX = fromState.x + STATE_RADIUS * Math.sin(angle);
        const endY = fromState.y - STATE_RADIUS * Math.cos(angle);
        const controlX = fromState.x;
        const controlY = fromState.y - STATE_RADIUS * 2.5;

        const endVecX = endX - controlX;
        const endVecY = endY - controlY;
        const endVecLen = Math.sqrt(endVecX * endVecX + endVecY * endVecY);
        const finalEndX = endX - (endVecX / endVecLen) * 8;
        const finalEndY = endY - (endVecY / endVecLen) * 8;

        const path = `M ${startX} ${startY} Q ${controlX},${controlY} ${finalEndX} ${finalEndY}`;
        
        return (
            <g key={key}>
              <path d={path} stroke="var(--ui-stroke)" fill="none" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
              <text x={controlX} y={controlY - 8} fill="var(--text-primary)" textAnchor="middle" fontSize="14" paintOrder="stroke" stroke="var(--bg-navy)" strokeWidth="6px" strokeLinejoin="round">{label}</text>
            </g>
        );
      }
      
      const dx = toState.x - fromState.x;
      const dy = toState.y - fromState.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const nx = dx / distance;
      const ny = dy / distance;

      const startX = fromState.x + nx * STATE_RADIUS;
      const startY = fromState.y + ny * STATE_RADIUS;
      const endX = toState.x - nx * (STATE_RADIUS + 8);
      const endY = toState.y - ny * (STATE_RADIUS + 8);
      
      const pairKey = [from, to].sort().join(',');
      let bend = 0.3;
      if ((pairCounts.get(pairKey) || 1) > 1 && from > to) {
          bend = -0.3;
      }

      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2;
      const perpX = -ny;
      const perpY = nx;
      const controlX = midX + perpX * distance * bend;
      const controlY = midY + perpY * distance * bend;
      const textYOffset = bend > 0 ? 16 : -8;
      
      const path = `M ${startX} ${startY} Q ${controlX},${controlY} ${endX} ${endY}`;

      return (
          <g key={key}>
            <path d={path} stroke="var(--ui-stroke)" fill="none" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
            <text x={controlX} y={controlY + textYOffset} fill="var(--text-primary)" textAnchor="middle" fontSize="14" paintOrder="stroke" stroke="var(--bg-navy)" strokeWidth="6px" strokeLinejoin="round">{label}</text>
          </g>
      );
    });
  }, [automaton.transitions, stateMap]);

  const startStateObj = stateMap.get(automaton.startState);

  return (
    <svg viewBox="0 0 550 450" className="w-full h-full">
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="8" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="var(--ui-stroke)" />
        </marker>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {startStateObj && (
         <path d={`M ${startStateObj.x - STATE_RADIUS - 40},${startStateObj.y} L ${startStateObj.x - STATE_RADIUS - 5},${startStateObj.y}`} stroke="var(--ui-stroke)" strokeWidth="2" markerEnd="url(#arrowhead)" />
      )}

      <g>{renderedTransitions}</g>
      
      {positionedStates.map(state => {
        const isFinal = automaton.finalStates.includes(state.id);
        const shouldPulse = state.id === pulseStateId;
        return (
          <g 
            key={state.id} 
            onClick={() => onStateClick(state.id)} 
            className={`cursor-pointer group origin-center ${shouldPulse ? 'animate-pulse-once' : ''}`} 
            aria-label={`State ${state.id}`}
            style={{ transformBox: 'fill-box' }}
          >
            {isFinal && (
               <circle cx={state.x} cy={state.y} r={STATE_RADIUS} fill="var(--accent-amber)" stroke="var(--accent-amber)" strokeWidth="2" filter="url(#glow)" className="transition-all duration-300 opacity-50"/>
            )}
            <circle 
              cx={state.x} 
              cy={state.y} 
              r={STATE_RADIUS} 
              fill="var(--bg-deep-navy)" 
              stroke="var(--ui-stroke)" 
              strokeWidth="2"
              className="group-hover:stroke-[var(--accent-amber)] transition-all duration-300"
            />
             {isFinal && (
              <circle cx={state.x} cy={state.y} r={STATE_RADIUS - FINAL_STATE_OFFSET} fill="none" stroke="var(--accent-amber)" strokeWidth="1.5" className="transition-all duration-300"/>
            )}
            <text x={state.x} y={state.y} textAnchor="middle" dy="0.3em" fill="var(--text-primary)" className="select-none font-bold text-lg" style={{fontFamily: 'Roboto Mono, monospace'}}>{state.id}</text>
          </g>
        );
      })}
    </svg>
  );
};

export default AutomatonGraph;