// src/types/GameState.ts
export interface GameState {
    status: 'started' | 'nextMiniGame' | 'nextSequence' | 'ended';
    data: any;
  }
  