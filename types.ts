import React from 'react';

export interface AlgorithmAnalysis {
  explanation: string;
  fingertricks: string;
  difficulty: string;
}

export interface SolveRecord {
    id: string;
    caseId: string;
    stage: string;
    time: number; // milliseconds
    timestamp: number;
    scramble?: string;
}

export interface UserData {
    favorites: Record<string, string>;
    customAlgs: Record<string, string[]>;
    learned: string[];
    history: SolveRecord[];
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'twisty-player': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        alg?: string;
        "experimental-setup-alg"?: string;
        "experimental-stickering"?: string;
        background?: string;
        "control-panel"?: string;
        visualization?: string;
        tempo?: number;
        "camera-latitude"?: number;
        "camera-longitude"?: number;
        "camera-distance"?: number;
      };
    }
  }
}