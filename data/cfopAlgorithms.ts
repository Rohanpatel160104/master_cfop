
export type Stage = 'F2L' | 'OLL' | 'PLL';

export interface AlgorithmCase {
  id: string;
  name: string;
  stage: Stage;
  algs: string[];
}

export const CFOP_ALGORITHMS: AlgorithmCase[] = [
  // --- PLL ---
  { 
    id: 'H', 
    name: 'H Permutation', 
    stage: 'PLL', 
    algs: [
      "M2' U M2' U2 M2' U M2'",
      "M2' U' M2' U2' M2' U' M2'",
      "M2' U2 M2' U M2' U2 M2'",
      "M2' U2 M2' U' M2' U' M2'",
      "R' U' R U' R U R U' R' U R U R2 U' R'"
    ] 
  },
  { 
    id: 'Ua', 
    name: 'U Permutation : a', 
    stage: 'PLL', 
    algs: [
      "R U R' U R' U' R2 U' R' U R' U R",
      "(U2) M2' U M U2 M' U M2'",
      "(U2) R U' R U R U R U' R' U' R2"
    ] 
  },
  { 
    id: 'Ub', 
    name: 'U Permutation : b', 
    stage: 'PLL', 
    algs: [
      "R' U R' U' R3 U' R' U R U R2",
      "(U2) M2 U' M U2 M' U' M2",
      "(U2) R2' U R U R' U' R3 U' R' U R'"
    ] 
  },
  { 
    id: 'Z', 
    name: 'Z Permutation', 
    stage: 'PLL', 
    algs: [
      "(U) M' U M2' U M2' U M' U2 M2'",
      "M2' U M2' U M' U2 M2' U2 M'",
      "M2' U2 M U M2' U M2' U M",
      "R' U' R U' R U R U' R' U R U R2 U' R'"
    ] 
  },
  { 
    id: 'Aa', 
    name: 'Aa Permutation', 
    stage: 'PLL', 
    algs: [
      "(U') x R' U R' D2 R U' R' D2 R2 x'",
      "x' R2 D2 R' U' R D2 R' U R' x",
      "(U2) x L2 D2' L' U' L D2' L' U L' x'",
      "(U) R' D R U' R' D' R U' R' D R U2 R' D' R"
    ] 
  },
  { 
    id: 'Ab', 
    name: 'Ab Permutation', 
    stage: 'PLL', 
    algs: [
      "(U') x R2' D2 R U R' D2 R U' R x'",
      "x' R U' R D2 R' U R D2 R2' x",
      "(U2) x L U' L D2' L' U L D2' L2' x'",
      "(U) R' D R U2 R' D' R U R' D R U R' D' R"
    ] 
  },
  { 
    id: 'E', 
    name: 'E Permutation', 
    stage: 'PLL', 
    algs: [
      "(U) x' R U' R' D R U R' D' R U R' D R U' R' D' x",
      "R' D' R U' R' D R U R' D' R U2 R' D R U' R' D' R U R' D R"
    ] 
  },
  { 
    id: 'F', 
    name: 'F Permutation', 
    stage: 'PLL', 
    algs: [
      "y L R2 U R U R2 U' R' U' R2 U' R U2 L' U R'",
      "(y) R' U' F' (R U R' U') R' F R2 (U' R' U') R U R' U R",
      "(y x) R' B' U' l U R' U' R' F R2 U' R' U' R U R' U R",
      "y2 R' U2 R' d' R' F' R2 U' R' U R' F R U' F",
      "R' U R U' R2 F' U' F U R F R' F' R2 U'",
      "M' U2 L F' R U2 r' U r' R2 U2 R2",
      "(R' U R U') R2 (F' U' F U) (R F R' F') R2 U'",
      "(y) R2 (F R F' R') (U' F' U F) R2 (U R' U' R) U",
      "y2 R U' R' U R U F R U R' U' x' D' R2 D R D'",
      "y2 R U' R' U R U F R U R' U' x U' R2 U R U'",
      "R' U R U' R2 (y') R' U' R U (y x) R U R' U' R2 (x')",
      "(y2) R' U2 R' d' R' F' R2 U' R' U R' F R U' F",
      "(y') F r2 R' U2 r U' r' U2 (x') R2 U' R' U r2 u' (z')",
      "B' U' R' B U B' U' B' R B2 U' B' U' B U B' U B",
      "(y) R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R",
      "L U' L' U L2 F U F' U' L' F' L F L2 U",
      "(y2) R U' R' U R2 (y) R U R' U' (x) U' R' U R U2 (x')",
      "(y' z) R U R' U' R U2 (z' y') R U R' U' (y' x') R' U' R U R2 (x)",
      "L F R' F' L' F' D2 B' L' B D2 F' R F2"
    ] 
  },
  { 
    id: 'Ga', 
    name: 'Ga Permutation', 
    stage: 'PLL', 
    algs: [
      "(y) R2 U (R' U R' U') R U' R2 (D U' R' U) R D'",
      "(y) R2' u (R' U R' U' R) u' R2 (y') R' U R",
      "(y) R2 U (R' U R' U' R) U' R2 D (U' R' U R) D'",
      "(y2) F2' D (R' U R' U' R) D' F2 L' U L",
      "R L U2 R' L' (y') R' U L' U2 R U' L",
      "R U2' R' U' F' R U R2 U' R' F R U R2 U2' R'",
      "(R U R' U' R') U F (R U R U' R') F' U R' U2 R",
      "(y2 z) U R U' R' U' R B U R U R' U' B' R U' R2 U (z' y2')",
      "(y) L F2 R (F' L' F U) R' U' (F' L F' L')",
      "(y) R2' S2 U l2' U' l2' u R2 U' r2' F2"
    ] 
  },
  { 
    id: 'Gb', 
    name: 'Gb Permutation', 
    stage: 'PLL', 
    algs: [
      "R' U' R U D' R2 U R' U R U' R U' R2 D",
      "R' U' R (y) R2 u (R' U R U' R) u' R2",
      "(y) F' U' F R2 u (R' U R U' R) u' R2'",
      "(y2) R' U2 R U' F R U R' U' R' F' U' R U R U' R' (y2')",
      "R' U' R B2 D (L' U L U' L) D' B2",
      "(y2) L' U' L (y') R2' u (R' U R U' R) u' R2",
      "(y') R' U L' U2 R U' L (y) R L U2 L' R'",
      "R2 D L2 D F2 L D R' D2 L D' R' U2"
    ] 
  },
  { 
    id: 'Gc', 
    name: 'Gc Permutation', 
    stage: 'PLL', 
    algs: [
      "(y) R2 U' R U' R U R' U R2 D' U R U' R' D",
      "(y') R2 F2 R U2 R U2 R' F R U R' U' R' F R2",
      "(y) R2' u' (R U' R U R') u R2 (y) R U' R'",
      "(y) R2' u' (R U' R U R') u R2 B U' B'",
      "(y) R2' U' (R U' R U R') U R2 (D' U R U' R' D)",
      "(y) R2' D' F U' F U F' D R2 B U' B'",
      "(y2) F2' D' L U' L U L' D F2 R U' R'",
      "L' U' L U L U' F' L' U' L' U L F U' L U2 L'",
      "(y2) R' U' R U R U' B' R' U' R' U R B U' R U2 R' (y2')",
      "(z) U' R' U R U R' F' U' R' U' R U F R' U R2 U' (z')",
      "L' R' U2 L R (y) L U' R U2 L' U R'",
      "B2 L2 U' B2 D B2 D' R2 U M2 F2 (x2)",
      "(y') R2' F2 R U2 R U2 R' F R U R' U' R' F R2",
      "(y') l' U2' L' U l F' U' L U F R' F R",
      "(y) U F2 R2 L2 U' L2 U L2 D' L2 D R2 F2 U'",
      "(y') (z)  U2 (r' U R' U R U' r) U2 F R' F' (z') (y)"
    ] 
  },
  { 
    id: 'Gd', 
    name: 'Gd Permutation', 
    stage: 'PLL', 
    algs: [
      "(y2) R U R' U' D R2 U' R U' R' U R' U R2 D'",
      "(y2) D' R U R' U' D R2 U' R U' R' U R' U R2",
      "(y2) R U R' (y') R2 u' (R U' R' U R') u R2",
      "(y2) R U R' F2 D' L U' L' U L' D F2",
      "(y2) (F U' R' F) (R2 U' R' U') (R U R' F')2",
      "(y2) (F R U' R')2 (U R U R2') (F' R U F')",
      "(y2) R' U2 R U R' U2' L U' R U L'",
      "L' U R' U2 L U' R U L' U R' U2 L U' R",
      "y2 R' U2 R U R' U2 L U' R U L'",
      "(y) (R' U L') U2 (R U' R') U2 R L",
      "(y2) F U' R U' R' U' R U R' F' R U R' U' R' F R U F'",
      "B2 R' U' R B2 L' D L' D' L2",
      "(y2) F2 L' U' L F2 R' D R' D' R2",
      "(y2) F2 L' U' L b2 L' U L' U' r2",
      "(y2) R' U2 R U R' (z) R2' U R' D R U' (z')",
      "(y2) R' U2' R U R' (z) R2 U R' D R U' (z')",
      "(z) D R' U' R D' R (R U R' U') R2 U (z')",
      "R U' L' U R' U2 L U' L' U2' L",
      "R' L' U2 L U L' U2 R U' L U",
      "L' U2 L U L' U2 R U' L U R'",
      "R' d' R U R' U F U F' U' R U2 R' U F U",
      "(y2) (M' D2 M') R U R' F' R U R' U' R' F R2 U' R' (M D2 M)",
      "L' U' L  F L' U' L U L F' L2 U L U",
      "(y2) (R' U L' U2 R U' L) U (R' U L' U2 R U' L)"
    ] 
  },
  { 
    id: 'Ja', 
    name: 'Ja Permutation', 
    stage: 'PLL', 
    algs: [
      "(y2) x R2' F R F' R U2 r' U r U2 x'",
      "(y2) L U' R' U L' U2 R U' R' U2 R",
      "U R U R' U' R' F R2 U' R' U2 R U R' F' R U R' U' R' F R F'",
      "(y) U R' U' R B R' U' R U l U' R2' F R (x)",
      "(y2) (F U' R' F) (R2 U' R' U') (R U R' F')2",
      "(y2) (F R U' R')2 (U R U R2') (F' R U F')",
      "(y2) R' U2 R U R' U2' L U' R U L'",
      "L' U R' U2 L U' R U L' U R' U2 L U' R",
      "y2 R' U2 R U R' U2 L U' R U L'",
      "(y) (R' U L') U2 (R U' R') U2 R L",
      "(y2) F U' R U' R' U' R U R' F' R U R' U' R' F R U F'",
      "B2 R' U' R B2 L' D L' D' L2",
      "(y2) F2 L' U' L F2 R' D R' D' R2",
      "(y2) F2 L' U' L b2 L' U L' U' r2",
      "(y' x') L2 u L u' L2 (x' y) (L U' L U) r2",
      "(y2 x) U2 l U l' U2 r (U' L U) r2",
      "R U' L U2 R' U L' U' R U' L U2 R' U L'",
      "B2 U D' B2 U B2 U' B2 D B2 U' B2 U",
      "(y') L2 (U D') L2 U L2 U' L2 D L2 U' L2",
      "R U R' F' R U R' U' l' U l2 F' l' U'",
      "R U2 R' U' R U2 L' U R' U' L",
      "R2 U F U F' R2 F U' F' R2 U' R2 U'"
    ] 
  },
  { 
    id: 'Jb', 
    name: 'Jb Permutation', 
    stage: 'PLL', 
    algs: [
      "R U R' F' R U R' U' R' F R2 U' R' U'",
      "(y2) R' U L U' R U2' L' U L U2 L'",
      "R U R' F' R U R' U' R' F R2 U' R' U'",
      "R U2 R' U' R U2 L' U R' U' r x",
      "R U2 (R' U' R) U2 L' (U R' U') L",
      "(y) (R U' L) U2 (R' U R) U2 L' R'",
      "L' U R U' L U2 R' U R U2 R'",
      "B2 (L U L') B2 (R D' R D) R2",
      "(y2) F2 (R U R') F2 (L D' L D) L2",
      "(y2) F2 (R U R') b2 (R U' R U) l2'",
      "(y' x') L2 u L u' L2 (x' y) (L U' L U) r2",
      "(y2 x) U2 l U l' U2 r (U' L U) r2",
      "R U' L U2 R' U L' U' R U' L U2 R' U L'",
      "B2 U D' B2 U B2 U' B2 D B2 U' B2 U",
      "(y') L2 (U D') L2 U L2 U' L2 D L2 U' L2",
      "R U R' F' R U R' U' l' U l2 F' l' U'",
      "R U2 R' U' R U2 L' U R' U' L",
      "R2 U F U F' R2 F U' F' R2 U' R2 U'"
    ] 
  },
  { 
    id: 'Na', 
    name: 'Na Permutation', 
    stage: 'PLL', 
    algs: [
      "(r' D r U2)5",
      "(r' D' r U2)5",
      "(l' D l U2)5",
      "(l' D' l U2)5",
      "R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'",
      "F' R U R' U' R' F R2 F U' R' U' R U F' R'",
      "R F U' R' U R U F' R2 F' R U R U' R' F",
      "(z) U' F R F' R' F' U F2' U R' F' R' F R U' F' (z')",
      "(z) B' U R U' R' U' B U2' B R' U' R' U R B' U' (z')",
      "(z) F U' R' U R U F' U2 F' R U R U' R' F U (z')",
      "z D' R U' R2 D R' U D' R U' R2 D R' U z'",
      "(z) (U' R D' R2' U R' D)2 (z')",
      "z U' R D' R2 U R' D U' R D' R2 U R' D z'",
      "(z) U' R2 U (R U R' F' R U R' U' R' F R2 U' R' ) U2 R2 U z'",
      "L' U R' d2 R U' L R' U L' U2 l F' r",
      "r' D' F r U' r' F' D r2 U r' U' r' F r F'",
      "R2 D R' U R D' R2 U' R U' R' U' F R U R' U' R' F' R "
    ] 
  },
  { 
    id: 'Nb', 
    name: 'Nb Permutation', 
    stage: 'PLL', 
    algs: [
      "(r D r' U2)5",
      "(r D' r' U2)5",
      "(l D l' U2)5",
      "(l D' l' U2)5",
      "R' (U r' F2 R F') M' (U r' F2 R F') r U",
      "(R' U R U') R' F' U' F (R U R' F) (R' F' R U') R",
      "(R' U R U') R' F' U' F (R U R' U') (R U' f R f')",
      "(R' U L' U2 R U' L)2 U",
      "(z) (D' R U' R2' D R' U)2 (z')",
      "B R' U' R U R B' R2' B' U R U R' U' B R",
      "(x') U R' F' R F R U' R2' U' F R F R' F' U R (x)",
      "R' B' U R U' R' U' B R2 B R' U' R' U R B'",
      "(x') R' U' F R F' R' F' U R2' U R' F' R' F R U' (x)",
      "(z) U' F' (R U R' U' R' F) U2' F (U' R' U' R U F') (z')",
      "(z) B' U' R B R' B' R' U B2' U B' R' B' R B U' (z')",
      "(z) F U' R' U R U F' U2 F' R U R U' R' F U (z')",
      "z D' R U' R2 D R' U D' R U' R2 D R' U z'",
      "(z) (U' R D' R2' U R' D)2 (z')",
      "z U' R D' R2 U R' D U' R D' R2 U R' D z'",
      "(z) U' R2 U (R U R' F' R U R' U' R' F R2 U' R' ) U2 R2 U z'",
      "L' U R' d2 R U' L R' U L' U2 l F' r",
      "r' D' F r U' r' F' D r2 U r' U' r' F r F'",
      "R2 D R' U R D' R2 U' R U' R' U' F R U R' U' R' F' R "
    ] 
  },
  { 
    id: 'Ra', 
    name: 'Ra Permutation', 
    stage: 'PLL', 
    algs: [
      "(y') R U' R' U' R U R D R' U' R D' R' U2 R'",
      "(y') R U R' F' R U2 R' U2 R' F R U R U2 R' U'",
      "R U2 R' U2 R B' R' U' R U R B R2 U",
      "R U2 R' U2 R B' R' U' R U l U R2 (x)",
      "(y2 z) U R2 U' R2 U F' U' R' U R U F U2 (z')",
      "(y2) L U2 L' U2 L F' L' U' L U L F L2",
      "(y') R2 B' R' U' R' U R B R' U2 R U2 R'",
      "(y) L2 F' L' U' L' U L F L' U2 L U2 L'",
      "F2 R' F' U' F' U F R F' U2 F U2 F'",
      "(y' x') R2 U' l' U' R' U l U l' U2 R U2 R'",
      "(y') R l U' l' U' R' U l U l' U2 R U2' R'",
      "F2 L2 U F U F' U' F' U' L2 F' U F' U'",
      "R U' R F2 U R U R U' R' U' F2 R2 U",
      "(y') R2 F2 U R U R' U' R' U' F2 R' U R'",
      "(y') R U R' F' R U2 R' U2 R' F R U R U2 R' U'",
      "R U2 R' U' R' F' R U2 R U2 R' F R U' R' U"
    ] 
  },
  { 
    id: 'Rb', 
    name: 'Rb Permutation', 
    stage: 'PLL', 
    algs: [
      "R' U2 R U2 R' F (R U R' U') R' F' R2' U'",
      "(y') L' U' L F L' U2 L U2 L F' L' U' L' U2 L U",
      "R' U2 R U2 R' F (R U R' U') l' U' R2 (x')",
      "(z') U' L2 U L2 U' F U L U' L' U' F' U2 (z)",
      "R' U2 R U2 R' F R U R' U' R' F' R2",
      "R' U2 R' D' R U' R' D R U R U' R' U' R",
      "y' R U2 R' U2 R' F R2 U' R' U' R U R' F' R U R' U R U2 R'",
      "y R2 F R U R U' R' F' R U2 R' U2 R",
      "(y x) R2 U l U R U' l' U' l U2 R' U2 R",
      "(y') r' L' U r U L U' r' U' r U2 L' U2 L",
      "(y') L' U' L F L' U2 L U2 L F' L' U' L' U2 L U",
      "(y2) L' U2 L U L F L' U2 L' U2 L F' L' U L U'"
    ] 
  },
  { 
    id: 'T', 
    name: 'T Permutation', 
    stage: 'PLL', 
    algs: [
      "R U R' U' R' F R2 U' R' U' R U R' F'",
      "F R U' R' U R U R2 F' R U R U' R'",
      "R U R' U' R' F R2 U' R' U F' L' U L",
      "R2 U R2 U' R2 U' D R2 U' R2 U R2 D'",
      "(y2) L' U' L U L F' L2 U L U L' U' L F"
    ] 
  },
  { 
    id: 'V', 
    name: 'V Permutation', 
    stage: 'PLL', 
    algs: [
      "R' U R' U' R D' R' D R' U D' R2 U' R2 D R2",
      "(y) R U' R U R' D R D' R U' D R2 U R2 D' R2",
      "(y) R' U R' U' R D' R' D R3 U D' R2 U' R2' D R2",
      "R' U R U' R' f' U' (R U2 R' U' R U' R') f R",
      "R' f' (R U R' U R U2 R') U f (R U R' U') R",
      "R' U R' U' B' R' B2 U' B' U B' R B R",
      "R' U R' d' R' F' R2 U' R' U R' F R F",
      "R' U R' U' (y) R' F' R2 U' R' U R' F R F",
      "(y2 z) U' R U' R' F' U' F2 l' U' l F' U F U (z' y2')",
      "(y2 x) R U R U' B U' B' U2' R' U' B' R' B R' (x' y2')",
      "R' U R' U' B' l' (x2' y') U2 R' U' R (y) U' R U R (x)",
      "(z) D' R2 D R2 U R' D' R U' R U R' D R U'",
      "R U2 R' D R U' R U' R U R2 D R' U' R D2",
      "R' U R' U' R D' R' D R' U D' R2 U' R2 D R2",
      "(y') F' U F' U' R' F' R2 U' R' U R' F R F",
      "R2' D' R2 U R2' U' D R D' R D R' U R U' R"
    ] 
  },
  { 
    id: 'Y', 
    name: 'Y Permutation', 
    stage: 'PLL', 
    algs: [
      "F R U' R' U' R U R' F' R U R' U' R' F R F'",
      "R' U' R U' L R U2 R' U' R U2 L' U R2 U R",
      "R2 U' R' U R U' x D' R' U R' U' R' D R",
      "F R' F R2 U' R' U' R U R' F' R U R' U' F'",
      "R' U' R F2 R' U R d R2 U' R2' U' R2",
      "R2 U' R2 U' R2 U R' F' R U R2 U' R' F R",
      "R2 U' R2 U' R2 d R U R' B2 R U' R'",
      "R2 U' R2 U' R2 U y' R U R' B2 R U' R'",
      "F2 D R2 U R2 D' R' U' R F2 R' U R",
      "(y') R2 u R2' U R2 D' R' U' R F2' R' U R",
      "(R U R' U') (R' F R F') (R U R' U') R' F (R2 U' R' U) (R U R' F')",
      "R2' U' R2 U' R2' U R2 D' R2' U R2 U' R2' D R2"
    ] 
  },

  // --- OLL ---
  { id: 'OLL1', name: 'Runway', stage: 'OLL', algs: ["R U2' R2' F R F' U2 R' F R F'", "(U) R U' R2 D' r U' r' D R2 U R'"] },
  { id: 'OLL2', name: 'Zamboni', stage: 'OLL', algs: ["(U') R U' R2' D' r U r' D R2 U R", "F R U R' U' S R U R' U' f'", "(U2) f' U R U' R' S' U R U' R' F'"] },
  { id: 'OLL3', name: 'Anti-Pinwheel', stage: 'OLL', algs: ["(U) f (R U R' U') f' U' F (R U R' U') F'", "(U2) r' R2 U R' U r U2 r' U M'", "(U2) L' l U l' U2 l U L' U L M'", "(U') R' F2 R2 U2' R' F R U2' R2' F2 R"] },
  { id: 'OLL4', name: 'Pinwheel', stage: 'OLL', algs: ["f R U R' U' f' U F R U R' U' F'", "(U) l L2' U' L U' l' U2 l U' M'", "(U) R r' U' r U2 r' U' R U' R2' r", "R' F2 R2 U2' R' F' R U2' R2' F2 R"] },
  { id: 'OLL5', name: 'Right Back Wide Antisune', stage: 'OLL', algs: ["(U2) l' U2 L U L' U l", "r' U2' R U R' U r"] },
  { id: 'OLL6', name: 'Right Front Wide Antisune', stage: 'OLL', algs: ["(U2) r U2 R' U' R U' r'"] },
  { id: 'OLL7', name: 'Lightning', stage: 'OLL', algs: ["r U R' U R U2 r'"] },
  { id: 'OLL8', name: 'Wide Left Sune', stage: 'OLL', algs: ["l' U' L U' L' U2 l", "(U2) r' U' R U' R' U2 r", "R U2' R' U2 R' F R F'"] },
  { id: 'OLL9', name: 'Kite', stage: 'OLL', algs: ["(U') R U R' U' R' F R2 U R' U' F'"] },
  { id: 'OLL10', name: 'Anti-Kite', stage: 'OLL', algs: ["(U') R U R' U R' F R F' R U2' R'", "F U F' R' F R U' R' F' R"] },
  { id: 'OLL11', name: 'Downstairs', stage: 'OLL', algs: ["(U') r' R2 U R' U R U2' R' U M'", "(U) r U R' U R' F R F' R U2' r'"] },
  { id: 'OLL12', name: 'Upstairs', stage: 'OLL', algs: ["(U') r R2' U' R U' R' U2 R U' r' R", "(U) l L2' U' L U' L' U2 L U' M'"] },
  { id: 'OLL13', name: 'Gun', stage: 'OLL', algs: ["F U R U2' R' U' R U R' F'", "F U R U' R2' F' R U R U' R'", "r U' r' U' r U r' F' U F"] },
  { id: 'OLL14', name: 'Anti-Gun', stage: 'OLL', algs: ["R' F R U R' F' R F U' F'"] },
  { id: 'OLL15', name: 'Squeegee', stage: 'OLL', algs: ["(U2) l' U' l L' U' L U l' U l", "r' U' r R' U' R U r' U r"] },
  { id: 'OLL16', name: 'Anti-Squeegee', stage: 'OLL', algs: ["(U2) r U r' R U R' U' r U' r'"] },
  { id: 'OLL17', name: 'Slash', stage: 'OLL', algs: ["R U R' U R' F R F' U2 R' F R F'", "(U2) F R' F' R U S' R U' R' S"] },
  { id: 'OLL18', name: 'Crown', stage: 'OLL', algs: ["R U2 R2 F R F' U2 M' U R U' r'", "(U) R U R2 F' U' F U R U2' R' F R F'", "(U) F R U R' d R' U2 (R' F R F')", "(U') r U R' U R U2 r2' U' R U' R' U2 r"] },
  { id: 'OLL19', name: 'Bunny', stage: 'OLL', algs: ["S' R U R' S U' R' F R F'", "(U') r' R U R U R' U' r R2 F R F'"] },
  { id: 'OLL20', name: 'X', stage: 'OLL', algs: ["r' R U R U R' U' r R' M' U R U' r'", "r U R' U' r R' M' U R U' R' U' M'", "S' R U R' S U' M' U R U' r'"] },
  { id: 'OLL21', name: 'H', stage: 'OLL', algs: ["R U R' U R U' R' U R U2 R'", "(U) R U2' R' U' R U R' U' R U' R'"] },
  { id: 'OLL22', name: 'Pi', stage: 'OLL', algs: ["R U2' R2' U' R2 U' R2' U2' R"] },
  { id: 'OLL23', name: 'Headlights', stage: 'OLL', algs: ["R2' D' R U2 R' D R U2 R", "(U2) R2 D R' U2 R D' R' U2 R'"] },
  { id: 'OLL24', name: 'T', stage: 'OLL', algs: ["r U R' U' r' F R F'", "(U2) l' U' L U l F' L' F"] },
  { id: 'OLL25', name: 'Bowtie', stage: 'OLL', algs: ["(U2) F R' F' r U R U' r'", "(U') F' r U R' U' r' F R"] },
  { id: 'OLL26', name: 'Antisune', stage: 'OLL', algs: ["(U2) R' U' R U' R' U2 R", "(U') R U2' R' U' R U' R'", "L' U' L U' L' U2 L"] },
  { id: 'OLL27', name: 'Sune', stage: 'OLL', algs: ["R U R' U R U2' R'", "(U') R' U2' R U R' U R"] },
  { id: 'OLL28', name: 'Stealth', stage: 'OLL', algs: ["r U R' U' r' R U R U' R'"] },
  { id: 'OLL29', name: 'Spotted Chameleon', stage: 'OLL', algs: ["(U) R U R' U' R U' R' F' U' F R U R'", "(U) R U R' U' R' F R F' R U R' U' M' U R U' r'", "r2' D' r U r' D r2 U' r' U' r"] },
  { id: 'OLL30', name: 'Anti-Spotted Chameleon', stage: 'OLL', algs: ["(U2) F U R U2' R' U' R U2 R' U' F'", "(U') r' D' r U' r' D r2 U' r' U r U r'", "(U2) F R' F R2 U' R' U' R U R' F2'"] },
  { id: 'OLL31', name: 'Couch', stage: 'OLL', algs: ["(U2) R' U' F U R U' R' F' R"] },
  { id: 'OLL32', name: 'Anti-Couch', stage: 'OLL', algs: ["S R U R' U' R' F R f'", "(U2) L U F' U' L' U L F L'", "R U B' U' R' U R B R'"] },
  { id: 'OLL33', name: 'Tying Shoelaces', stage: 'OLL', algs: ["R U R' U' R' F R F'"] },
  { id: 'OLL34', name: 'City', stage: 'OLL', algs: ["R U R2' U' R' F R U R U' F'", "R U R' U' y l' U' L U L' l", "(U') f R f' U' r' U' R U M'"] },
  { id: 'OLL35', name: 'Fish Salad', stage: 'OLL', algs: ["R U2' R2' F R F' R U2' R'"] },
  { id: 'OLL36', name: 'Sea-Mew', stage: 'OLL', algs: ["(U2) L' U' L U' L' U L U L F' L' F", "(U2) R U R' F' R U R' U' R' F R U' R' F R F'", "(U) R' F' U' F2 U R U' R' F' R", "(U) R U R2' F' U' F U R2 U2' R'"] },
  { id: 'OLL37', name: 'Mounted Fish', stage: 'OLL', algs: ["(U) F R' F' R U R U' R'"] },
  { id: 'OLL38', name: 'Mario', stage: 'OLL', algs: ["(U2) R U R' U R U' R' U' R' F R F'"] },
  { id: 'OLL39', name: 'Fung', stage: 'OLL', algs: ["L F' L' U' L U F U' L'", "(U2) R U R' F' U' F U R U2' R'", "(U2) f' r U r' U' r' F r S"] },
  { id: 'OLL40', name: 'Anti-Fung', stage: 'OLL', algs: ["R' F R U R' U' F' U R"] },
  { id: 'OLL41', name: 'Awkward Fish', stage: 'OLL', algs: ["(U2) R U R' U R U2 R' F R U R' U' F'"] },
  { id: 'OLL42', name: 'Lefty Awkward Fish', stage: 'OLL', algs: ["R' U' R U' R' U2' R F R U R' U' F'", "R' U' R U' R' U2' R U R' F' U' F U R", "(U) R' F R F' R' F R F' R U R' U' R U R'", "(U) F R' F' R U2 R' U' R2 U' R2' U2' R"] },
  { id: 'OLL43', name: 'Anti-P', stage: 'OLL', algs: ["(U) R' U' F' U F R"] },
  { id: 'OLL44', name: 'P', stage: 'OLL', algs: ["(U2) F (U R U' R') F'", "f (R U R' U') f'"] },
  { id: 'OLL45', name: 'Suit up', stage: 'OLL', algs: ["F R U R' U' F'"] },
  { id: 'OLL46', name: 'Seein\' Headlights', stage: 'OLL', algs: ["R' U' R' F R F' U R"] },
  { id: 'OLL47', name: 'Anti-Breakneck', stage: 'OLL', algs: ["(U') F R' F' R U2 R U' R' U R U2' R'", "R' U' R' F R F' R' F R F' U R", "F' L' U' L U L' U' L U F", "(U') R' F' U' F U F' U' F U R"] },
  { id: 'OLL48', name: 'Breakneck', stage: 'OLL', algs: ["F R U R' U' R U R' U' F'"] },
  { id: 'OLL49', name: 'Right back squeezy', stage: 'OLL', algs: ["(U2) r U' r2' U r2 U r2' U' r", "R B' R2' F R2 B R2' F' R"] },
  { id: 'OLL50', name: 'Right front squeezy', stage: 'OLL', algs: ["(U2) R' F R2 B' R2' F' R2 B R'", "r' U r2 U' r2' U' r2 U r'"] },
  { id: 'OLL51', name: 'Bottlecap', stage: 'OLL', algs: ["F U R U' R' U R U' R' F'", "(U2) f R U R' U' R U R' U' f'", "(U) R' U' R' F R F' R U2' R' U2 R"] },
  { id: 'OLL52', name: 'Rice Cooker', stage: 'OLL', algs: ["R U R' U R U' B U' B' R'", "(U2) R' F' U' F U' R U R' U R"] },
  { id: 'OLL53', name: 'Frying Pan', stage: 'OLL', algs: ["l' U' L U' L' U L U' L' U2 l", "(U') r' U2' R U R' U' R U R' U r", "(U2) r' U' R U' R' U R U' R' U2 r"] },
  { id: 'OLL54', name: 'Anti-Frying Pan', stage: 'OLL', algs: ["r U R' U R U' R' U R U2' r'", "(U') r U2' R' U' R U R' U' R U' r'"] },
  { id: 'OLL55', name: 'Highway', stage: 'OLL', algs: ["(U) R' F R U R U' R2' F' R2 U' R' U R U R'", "(U) R' F U R U' R2' F' R2 U R' U' R", "(U) r U2' R' U' r' R2 U R' U' r U' r'"] },
  { id: 'OLL56', name: 'Streetlights', stage: 'OLL', algs: ["r U r' U R U' R' U R U' R' r U' r'", "r U r' U R U' R' M' U R U2' r'"] },
  { id: 'OLL57', name: 'Mummy', stage: 'OLL', algs: ["R U R' U' M' U R U' r'"] },

  // --- F2L ---
  { id: 'F2L1', name: 'F2L 1', stage: 'F2L', algs: ["U (R U' R')", "R' F R F'", "U2 (R U2 R')"] },
  { id: 'F2L2', name: 'F2L 2', stage: 'F2L', algs: ["y' U' (R' U R)", "U' (F' U F)", "F R' F' R", "y U' (L' U L)", "d' L' U L"] },
  { id: 'F2L3', name: 'F2L 3', stage: 'F2L', algs: ["F' U' F", "y' (R' U' R)", "y (L' U' L)"] },
  { id: 'F2L4', name: 'F2L 4', stage: 'F2L', algs: ["(R U R')", "y F U F'", "y' f R f'"] },
  { id: 'F2L5', name: 'F2L 5', stage: 'F2L', algs: ["(U' R U R') U2 (R U' R')", "(U' R U R') U (R' F R F')", "U' (R U R') U' R U2 R'", "U F' R' F' R F", "U R F R' F' R'"] },
  { id: 'F2L6', name: 'F2L 6', stage: 'F2L', algs: ["d (R' U' R) U2' (R' U R)", "y' (U R' U' R) U2 (R' U R)", "U' (r U' R' U) (R U r')", "y F2 (R U R' U') F2", "U' F' R' F R F", "U' R F R F' R'"] },
  { id: 'F2L7', name: 'F2L 7', stage: 'F2L', algs: ["U' (R U2' R') U2 (R U' R')", "(U' R U2 R')2"] },
  { id: 'F2L8', name: 'F2L 8', stage: 'F2L', algs: ["d (R' U2 R) U2' (R' U R)", "y' U (R' U2 R) U2 (R' U R)", "U (R' F R F')2 (R U' R')", "(r' U2) (R2 U R2 U r)"] },
  { id: 'F2L9', name: 'F2L 9', stage: 'F2L', algs: ["U' R U' R' d R' U' R", "U' R U' R' U (F' U' F)", "d (R' U' R U') (R' U' R)", "F (R U R' U') F' R U' R'", "y F2 (U R U' R') F2", "R' U' R F' U' F", "F U' F2' U' F"] },
  { id: 'F2L10', name: 'F2L 10', stage: 'F2L', algs: ["U' (R U R' U)(R U R')", "R d' R U R' U2 F'", "U F' U F U' R U R'", "d R' U R d' R U R'", "y2 B2 (U' R' U R) B2", "F U F' R U R'", "R' U R2 U R'"] },
  { id: 'F2L11', name: 'F2L 11', stage: 'F2L', algs: ["U' (R U2' R') d (R' U' R)", "U' (R U2' R') U (F' U' F)", "(y') R U2 R2 U' R2 U' R'", "L U2 L2 U' L"] },
  { id: 'F2L12', name: 'F2L 12', stage: 'F2L', algs: ["R U' R' U R U' R' U2 R U' R'", "R U2 R' U2' R U2' R' U2' R U' R'", "R' U2 R2 U R2 U R", "(U R U' R') U' (R U R' U') (R U R')", "R U R' U (R' F R F') (R U R')", "R' U2 R2 U R'"] },
  { id: 'F2L13', name: 'F2L 13', stage: 'F2L', algs: ["d (R' U R U') (R' U' R)", "y' U (R' U R U') (R' U' R)", "(R U' R') U (R' F R F') (R U' R')", "F U F' R' U' R"] },
  { id: 'F2L14', name: 'F2L 14', stage: 'F2L', algs: ["U' (R U' R' U) (R U R')", "F U' F' R U R'"] },
  { id: 'F2L15', name: 'F2L 15', stage: 'F2L', algs: ["R' D' R U' R' D R U (R U' R')", "(F' U F) U2 (R U R')", "U (R' F R F') U (R U R')", "R U2 R' U R U R' U R U' R'", "R U R' U2 R U' R' U R U' R'", "R U' R U2' R2' U' R2 U' R2'", "U' R2 U2 R U' R' U R' U2 R2", "U2 (R U R' U') R U2 R' U R U R'", "U' R' U2 R' U R' U' R U2 R", "R U' R U2 R2 U' R2 U' R2"] },
  { id: 'F2L16', name: 'F2L 16', stage: 'F2L', algs: ["(R U' R' U) d (R' U' R)", "(R U' R') U2 (F' U' F)", "(U) R (F R U R' U' F') R'", "y' U R U2 R U' R U R' U2 R'", "F' R' U' R U F"] },
  { id: 'F2L17', name: 'F2L 17', stage: 'F2L', algs: ["(R U2 R') U' (R U R')"] },
  { id: 'F2L18', name: 'F2L 18', stage: 'F2L', algs: ["y' (R' U2 R) U (R' U' R)", "y (L' U2 L) U (L' U' L)", "(R U R' U') (R U R' U') F R' F' R", "(R' F R F') (R U' R' U) (R U' R')"] },
  { id: 'F2L19', name: 'F2L 19', stage: 'F2L', algs: ["U (R U2 R') U (R U' R')", "(R U' R' U)2 R U R'"] },
  { id: 'F2L20', name: 'F2L 20', stage: 'F2L', algs: ["y' U' (R' U2 R) U' (R' U R)", "U' (R U' R2' F R F') (R U' R')", "y' (R' U R U')2 R' U' R"] },
  { id: 'F2L21', name: 'F2L 21', stage: 'F2L', algs: ["(R U' R') U2 (R U R')", "U2 (R U R' U)(R U' R')"] },
  { id: 'F2L22', name: 'F2L 22', stage: 'F2L', algs: ["y' (R' U R) U2 (R' U' R)", "y' U2 (R' U' R U') (R' U R)", "r U' r' U2 r U r'", "U (F R U R' U' F') R U R' U2'"] },
  { id: 'F2L23', name: 'F2L 23', stage: 'F2L', algs: ["U2 R2 U2 (R' U' R U') R2", "U (F R' F' R) U (R U R')", "U R U' R' U' R U' R' U R U' R'", "(R U R' U') U' (R U R' U')(R U R')", "R U' R' U' (R U R') U2 (R U R')", "R2 U R' U R U2 R' U' R'"] },
  { id: 'F2L24', name: 'F2L 24', stage: 'F2L', algs: ["(R U R') d (R' U R U') (R' U R)", "y' (R' U' R U) U (R' U' R U)(R' U' R)", "y' U2 R2 U2 (R U R' U) R2", "U' (R U) (R2' F R F') (R U' R')", "F U (R U' R' F')(R U' R')", "(R U R' U) (R U R' U') (F R' F' R)", "(R U R' U) (R U2 R') F' U2 F"] },
  { id: 'F2L25', name: 'F2L 25', stage: 'F2L', algs: ["U' (R' F R F') (R U R')", "R' U' R' U' R' U R U R", "U' (F' U F) U (R U' R')", "R' F' R U R U' R' F", "(U') F' R U R' U' R' F R", "(R U' R' U') (R U' R' U) (R U R')", "(U) (R' U' R' U') R2 (U R U R)", "(U2) (R' U' R' U' R U R U R)", "R2 U' R' U R2", "U D' R U' R' D"] },
  { id: 'F2L26', name: 'F2L 26', stage: 'F2L', algs: ["y' R U R U R U' R' U' R'", "U (R U' R') U' (F' U F)", "U (R U' R') (F R' F' R)", "y' (U') R U R U R2 U' R' U' R'", "y' (U2) R U R U R' U' R' U' R'", "r U r' U2 r U r' U2 r U' r'"] },
  { id: 'F2L27', name: 'F2L 27', stage: 'F2L', algs: ["(R U' R' U)(R U' R')", "(R U' R2)(F R F')"] },
  { id: 'F2L28', name: 'F2L 28', stage: 'F2L', algs: ["(R U R' U') F R' F' R", "(R U R') d (R' U2 R)", "y (L' U L U') (L' U L)", "y' (R' U R U')(R' U R)", "(R U R') U (F' U2 F)"] },
  { id: 'F2L29', name: 'F2L 29', stage: 'F2L', algs: ["y' (R' U' R U)(R' U' R)", "U2 (R U' R') y' (R' U' R)", "(R' F R F')2", "(R' F R F') (U R U' R')"] },
  { id: 'F2L30', name: 'F2L 30', stage: 'F2L', algs: ["(R U R' U')(R U R')", "U2 (F' U F)(R U R')", "U' (R U2 R')U2 (R U R')"] },
  { id: 'F2L31', name: 'F2L 31', stage: 'F2L', algs: ["(R U' R') d (R' U R)", "(R U' R' U)(F' U F)", "U' (R' F R F') (R U' R')", "R U2 R' U' F R' F' R"] },
  { id: 'F2L32', name: 'F2L 32', stage: 'F2L', algs: ["(R U R' U')2 (R U R')", "(U R U' R')3", "U' (R U R' U') (R U R' U) (R U' R')"] },
  { id: 'F2L33', name: 'F2L 33', stage: 'F2L', algs: ["U' (R U' R') U2' (R U' R')", "(U' R U' R') U2 (R U' R')", "y U' (L' U' L) U2 (L' U' L)", "u R U' R' u'", "E F' U' F u"] },
  { id: 'F2L34', name: 'F2L 34', stage: 'F2L', algs: ["U (F' U F) U2 (F' U F)", "U' (R U2' R') U (R U R')", "U (R U R') U2 (R U R')", "d (R' U R) U2 (R' U R)", "y (U L' U L) U2 (L' U L)", "U y F U2 R U2 R' F'", "E' R U R' E", "u' F' U F u"] },
  { id: 'F2L35', name: 'F2L 35', stage: 'F2L', algs: ["U' R U R' U (F' U' F)", "(U' R U R') d (R' U' R)", "U2 (R U' R') U' (F' U' F)"] },
  { id: 'F2L36', name: 'F2L 36', stage: 'F2L', algs: ["U F' U' F U' (R U R')", "U2 (R' F R F') U2 (R U R')", "y' U (R' U' R U') y (R U R')"] },
  { id: 'F2L37', name: 'F2L 37 (Solved)', stage: 'F2L', algs: [] }, // Assuming user knows it's solved or simple insert
  { id: 'F2L38', name: 'F2L 38', stage: 'F2L', algs: ["(R' F R F') (R U' R' U) (R U' R' U2) (R U' R')", "(R U' R') d (R' U2 R) U2' (R' U R)", "(R U R') U2 (R U2 R') d (R' U' R)", "(R2 U2) (F R2 F') (U2 R' U R')", "R U' R2 U2 R U' F' U F", "R U' R2 U2 R F R' F' R", "R U' R2 U2 R U2 F' U2 F"] },
  { id: 'F2L39', name: 'F2L 39', stage: 'F2L', algs: ["(R U' R') U' (R U R') U2 (R U' R')", "y' (R' U' R) U2 (R' U R U') (R' U' R)", "(R U R' U') (R U2 R') U' (R U R')"] },
  { id: 'F2L40', name: 'F2L 40', stage: 'F2L', algs: ["(R U' R' U)(R U2' R') U (R U' R')", "(R U R') U2 (R U' R' U)(R U R')", "(R U2) (R U R' U) (R U2 R2')", "y' R2 U2 R U R' U R U2 R"] },
  { id: 'F2L41', name: 'F2L 41', stage: 'F2L', algs: ["(r U' r') U2 (r U r') (R U R')", "(R U' R') d (R' U' R U') (R' U' R)", "R U' R' U' R U' R' d R' U' R", "R (F U R U' R' F') U' R'", "R U' R2 U' R y' R' U' R y"] },
  { id: 'F2L42', name: 'F2L 42', stage: 'F2L', algs: ["(R U' R') (r U' r') U2 (r U r')", "(R U' R' U) d (R' U' R U') (R' U R)", "(R U' R' U2) y' (R' U' R U' R' U R)", "(R U R' U') (R U' R') U2 (F' U' F)", "R U (F R U R' U' F') R'", "y' R' U R2 U R' y R U R'"] }
];
