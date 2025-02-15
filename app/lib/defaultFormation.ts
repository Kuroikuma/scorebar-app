import { FormationFootball } from "@/matchStore/interfaces";

// defaultFormation.ts
export const defaultFormation:FormationFootball[] = [
  {
    name: "4-4-2",
    positions: [
      { name: "POR", assigned: false, y:75, x:45 },
      { name: "LI", assigned: false, y:65, x:8 },
      { name: "DFC1", assigned: false, y:55, x:32 },
      { name: "DFC2", assigned: false, y:55, x:60 },
      { name: "LD", assigned: false, y:65, x:82 },
      { name: "MI", assigned: false, y:39, x:10 },
      { name: "MC1", assigned: false, y:27, x:32 },
      { name: "MC2", assigned: false, y:27, x:58 },
      { name: "MD", assigned: false, y:39, x:80 },
      { name: "DEL1", assigned: false, y:0, x:36 },
      { name: "DEL2", assigned: false, y:0, x:54 },
    ],
  },
  {
    name: "4-3-3 Ataque",
    positions: [
      { name: "POR", assigned: false, y:75, x:45 },
      { name: "LI", assigned: false, y:58, x:8 },
      { name: "DFC1", assigned: false, y:60, x:32 },
      { name: "DFC2", assigned: false, y:60, x:60 },
      { name: "LD", assigned: false, y:58, x:82 },
      { name: "MC1", assigned: false, y:32, x:15 },
      { name: "MC2", assigned: false, y:30, x:45 },
      { name: "MC3", assigned: false, y:32, x:75 },
      { name: "EI", assigned: false, y:5, x:25 },
      { name: "DEL", assigned: false, y:3, x:45 },
      { name: "ED", assigned: false, y:5, x:65 },
    ],
  },
  {
    name: "3-4-3 Plana",
    positions: [
      { name: "POR", assigned: false, y:78, x:45 },
      { name: "DFC1", assigned: false, y:55, x:25 },
      { name: "DFC2", assigned: false, y:55, x:45 },
      { name: "DFC3", assigned: false, y:55, x:65 },
      { name: "MI", assigned: false, y:30, x:10 },
      { name: "MC1", assigned: false, y:30, x:33 },
      { name: "MC2", assigned: false, y:30, x:56 },
      { name: "MD", assigned: false, y:30, x:79 },
      { name: "EI", assigned: false, y:5, x:25 },
      { name: "DEL", assigned: false, y:3, x:45 },
      { name: "ED", assigned: false, y:5, x:65 },
    ],
  },
  {
    name: "4-2-3-1 Estrecha",
    positions: [
      { name: "POR", assigned: false, y:80, x:45 },
      { name: "LI", assigned: false, y:62, x:8 },
      { name: "DFC1", assigned: false, y:64, x:25 },
      { name: "DFC2", assigned: false, y:64, x:65 },
      { name: "LD", assigned: false, y:62, x:82 },
      { name: "MCD1", assigned: false, y:41, x:17 },
      { name: "MCD2", assigned: false, y:41, x:73 },
      { name: "MCO1", assigned: false, y:20, x:27 },
      { name: "MCO2", assigned: false, y:28, x:45 },
      { name: "MCO3", assigned: false, y:20, x:63 },
      { name: "DEL", assigned: false, y:3, x:45 },
    ],
  },
  {
    name: "4-1-4-1",
    positions: [
      //1
      { name: "POR", assigned: false, y:80, x:45 },
      //4
      { name: "LI", assigned: false, y:62, x:8 },
      { name: "DFC1", assigned: false, y:64, x:28 },
      { name: "DFC2", assigned: false, y:64, x:62 },
      { name: "LD", assigned: false, y:62, x:82 },

      //1
      { name: "MCD", assigned: false, y:43, x:45 },

      //4
      { name: "MI", assigned: false, y:22, x:10 },
      { name: "MC1", assigned: false, y:22, x:30 },
      { name: "MC2", assigned: false, y:22, x:60 },
      { name: "MD", assigned: false, y:22, x:80 },

      //1
      { name: "DEL", assigned: false, y:3, x:45 },
    ],
  },
  {
    name: "5-2-2-1",
    positions: [
      { name: "POR", assigned: false, y:80, x:45 },

      //5
      { name: "LI", assigned: false, y:51, x:8 },
      { name: "DFC1", assigned: false, y:53, x:25 },
      { name: "DFC2", assigned: false, y:53, x:45 },
      { name: "DFC3", assigned: false, y:53, x:65 },
      { name: "LD", assigned: false, y:51, x:82 },

      //2
      { name: "MC1", assigned: false, y:29, x:32 },
      { name: "MC2", assigned: false, y:29, x:58 },

      //2
      { name: "EI", assigned: false, y:5, x:25 },
      { name: "ED", assigned: false, y:5, x:65 },

      //1
      { name: "DEL", assigned: false, y:3, x:45 },
    ],
  },
  {
    name: "4-1-2-1-2 Estrecha",
    positions: [
      { name: "POR", assigned: false, y:80, x:45 },
      //4
      { name: "LI", assigned: false, y:62, x:8 },
      { name: "DFC1", assigned: false, y:64, x:28 },
      { name: "DFC2", assigned: false, y:64, x:62 },
      { name: "LD", assigned: false, y:62, x:82 },

      //1
      { name: "MCD", assigned: false, y:47, x:45 },

      //2
      { name: "MC1", assigned: false, y:30, x:25 },
      { name: "MC2", assigned: false, y:30, x:65 },

      //1
      { name: "MCO", assigned: false, y:15, x:45 },

      //2
      { name: "DEL1", assigned: false, y:3, x:30 },
      { name: "DEL2", assigned: false, y:3, x:60 },
    ],
  },
  {
    name: "4-5-1",
    positions: [
      { name: "POR", assigned: false, y:80, x:45 },
      //4
      { name: "LI", assigned: false, y:62, x:8 },
      { name: "DFC1", assigned: false, y:64, x:28 },
      { name: "DFC2", assigned: false, y:64, x:62 },
      { name: "LD", assigned: false, y:62, x:82 },

      //5
      { name: "MI", assigned: false, y:30, x:10 },
      { name: "MCO1", assigned: false, y:15, x:25 },
      { name: "MC", assigned: false, y:30, x:45 },
      { name: "MCO2", assigned: false, y:15, x:60 },
      { name: "MD", assigned: false, y:30, x:75 },

      //1
      { name: "DEL2", assigned: false, y:3, x:45 },
    ],
  }
]
