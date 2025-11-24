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
