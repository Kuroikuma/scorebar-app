import { FormationFootball } from "@/matchStore/interfaces";

// defaultFormation.ts
export const defaultFormation:FormationFootball[] = [
  {
    name: "4-4-2 Plana",
    positions: [
      { name: "POR", assigned: false, y:75, x:45 },

      //4
      { name: "LI", assigned: false, y:58, x:8 },
      { name: "DFC1", assigned: false, y:60, x:32 },
      { name: "DFC2", assigned: false, y:60, x:60 },
      { name: "LD", assigned: false, y:58, x:82 },

      //4
      { name: "MI", assigned: false, y:28, x:10 },
      { name: "MC1", assigned: false, y:32, x:33 },
      { name: "MC2", assigned: false, y:32, x:56 },
      { name: "MD", assigned: false, y:28, x:79 },

      //2
      { name: "DEL1", assigned: false, y:5, x:36 },
      { name: "DEL2", assigned: false, y:5, x:54 },
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
      { name: "MCO", assigned: false, y:30, x:45 },
      { name: "MC2", assigned: false, y:32, x:75 },
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
      { name: "MI", assigned: false, y:30, x:9 },
      { name: "MCO1", assigned: false, y:15, x:27 },
      { name: "MC", assigned: false, y:30, x:45 },
      { name: "MCO2", assigned: false, y:15, x:63 },
      { name: "MD", assigned: false, y:30, x:81 },

      //1
      { name: "DEL", assigned: false, y:3, x:45 },
    ],
  },
  {
    name: "4-2-2-2",
    positions: [
      { name: "POR", assigned: false, y:80, x:45 },
      //4
      { name: "LI", assigned: false, y:62, x:8 },
      { name: "DFC1", assigned: false, y:64, x:25 },
      { name: "DFC2", assigned: false, y:64, x:65 },
      { name: "LD", assigned: false, y:62, x:82 },

      //2
      { name: "MCD1", assigned: false, y:42, x:32 },
      { name: "MCD2", assigned: false, y:42, x:58 },

      //2
      { name: "MCO1", assigned: false, y:23, x:15 },
      { name: "MCO2", assigned: false, y:23, x:75 },

      //2
      { name: "DEL1", assigned: false, y:4, x:30 },
      { name: "DEL2", assigned: false, y:4, x:60 },
    ],
  },
  {
    name: "4-3-3",
    positions: [
      { name: "POR", assigned: false, y:75, x:45 },
      { name: "LI", assigned: false, y:58, x:8 },
      { name: "DFC1", assigned: false, y:60, x:32 },
      { name: "DFC2", assigned: false, y:60, x:60 },
      { name: "LD", assigned: false, y:58, x:82 },
      { name: "MC1", assigned: false, y:32, x:15 },
      { name: "MC2", assigned: false, y:32, x:45 },
      { name: "MC3", assigned: false, y:32, x:75 },
      { name: "EI", assigned: false, y:5, x:25 },
      { name: "DEL", assigned: false, y:3, x:45 },
      { name: "ED", assigned: false, y:5, x:65 },
    ],
  },
  {
    name: "5-4-1",
    positions: [
      { name: "POR", assigned: false, y:80, x:45 },
      //5
      { name: "LI", assigned: false, y:51, x:8 },
      { name: "DFC1", assigned: false, y:53, x:25 },
      { name: "DFC2", assigned: false, y:53, x:45 },
      { name: "DFC3", assigned: false, y:53, x:65 },
      { name: "LD", assigned: false, y:51, x:82 },

      //4
      { name: "MI", assigned: false, y:15, x:15 },
      { name: "MCD", assigned: false, y:26, x:30 },
      { name: "MCO", assigned: false, y:15, x:60 },
      { name: "MD", assigned: false, y:26, x:75 },

      //1
      { name: "DEL", assigned: false, y:3, x:45 },
    ],
  },
  {
    name: "5-2-1-2",
    positions: [
      { name: "POR", assigned: false, y:80, x:45 },

      //5
      { name: "LI", assigned: false, y:51, x:8 },
      { name: "DFC1", assigned: false, y:53, x:25 },
      { name: "DFC2", assigned: false, y:53, x:45 },
      { name: "DFC3", assigned: false, y:53, x:65 },
      { name: "LD", assigned: false, y:51, x:82 },

      //2
      { name: "MC1", assigned: false, y:29, x:21 },
      { name: "MC2", assigned: false, y:29, x:69 },

      //
      { name: "MCO", assigned: false, y:16, x:45 },

      //2
      { name: "DEL1", assigned: false, y:3, x:30 },
      { name: "DEL2", assigned: false, y:3, x:60 },
    ],
  },
  {
    name: "4-5-1 Plana",
    positions: [
      { name: "POR", assigned: false, y:80, x:45 },
      //4
      { name: "LI", assigned: false, y:62, x:8 },
      { name: "DFC1", assigned: false, y:64, x:28 },
      { name: "DFC2", assigned: false, y:64, x:62 },
      { name: "LD", assigned: false, y:62, x:82 },

      //5
      { name: "MI", assigned: false, y:28, x:9 },
      { name: "MC1", assigned: false, y:30, x:27 },
      { name: "MC2", assigned: false, y:32, x:45 },
      { name: "MC3", assigned: false, y:30, x:63 },
      { name: "MD", assigned: false, y:28, x:81 },

      //1
      { name: "DEL", assigned: false, y:3, x:45 },
    ],
  },
  {
    name: "3-5-1-1",
    positions: [
      { name: "POR", assigned: false, y:80, x:45 },

      //3
      { name: "DFC1", assigned: false, y:55, x:15 },
      { name: "DFC2", assigned: false, y:55, x:45 },
      { name: "DFC3", assigned: false, y:55, x:75 },

      //5
      { name: "MI", assigned: false, y:25, x:9 },
      { name: "MCD1", assigned: false, y:30, x:30 },
      { name: "MC", assigned: false, y:25, x:45 },
      { name: "MCD2", assigned: false, y:30, x:60 },
      { name: "MD", assigned: false, y:25, x:81 },

      //1
      { name: "DEL", assigned: false, y:3, x:30 },

      //1
      { name: "SD", assigned: false, y:5, x:55 },
    ],
  },
  {
    name: "4-1-2-1-2 Amplia",
    positions: [
      { name: "POR", assigned: false, y:80, x:45 },
      //4
      { name: "LI", assigned: false, y:62, x:8 },
      { name: "DFC1", assigned: false, y:64, x:28 },
      { name: "DFC2", assigned: false, y:64, x:62 },
      { name: "LD", assigned: false, y:62, x:82 },

      //1
      { name: "MCD", assigned: false, y:43, x:45 },

      //2
      { name: "MI", assigned: false, y:26, x:10 },
      { name: "MD", assigned: false, y:26, x:80 },

      //1
      { name: "MCO", assigned: false, y:15, x:45 },

      //2
      { name: "DEL1", assigned: false, y:3, x:30 },
      { name: "DEL2", assigned: false, y:3, x:60 },
    ],
  },
  {
    name: "4-3-3 Contención",
    positions: [
      { name: "POR", assigned: false, y:75, x:45 },
      { name: "LI", assigned: false, y:58, x:8 },
      { name: "DFC1", assigned: false, y:60, x:32 },
      { name: "DFC2", assigned: false, y:60, x:60 },
      { name: "LD", assigned: false, y:58, x:82 },
      { name: "MC1", assigned: false, y:32, x:15 },
      { name: "MCD", assigned: false, y:36, x:45 },
      { name: "MC2", assigned: false, y:32, x:75 },
      { name: "EI", assigned: false, y:5, x:25 },
      { name: "DEL", assigned: false, y:3, x:45 },
      { name: "ED", assigned: false, y:5, x:65 },
    ],
  },
  {
    name: "3-5-2",
    positions: [
      { name: "POR", assigned: false, y:80, x:45 },

      //3
      { name: "DFC1", assigned: false, y:55, x:15 },
      { name: "DFC2", assigned: false, y:55, x:45 },
      { name: "DFC3", assigned: false, y:55, x:75 },

      //5
      { name: "MI", assigned: false, y:25, x:9 },
      { name: "MCD1", assigned: false, y:30, x:30 },
      { name: "MCO", assigned: false, y:20, x:45 },
      { name: "MCD2", assigned: false, y:30, x:60 },
      { name: "MD", assigned: false, y:25, x:81 },

      //1
      { name: "DEL1", assigned: false, y:5, x:30 },
      { name: "DEL2", assigned: false, y:5, x:60 },
    ],
  },
  {
    name: "4-3-3 Defensa",
    positions: [
      { name: "POR", assigned: false, y:75, x:45 },
      { name: "LI", assigned: false, y:58, x:8 },
      { name: "DFC1", assigned: false, y:60, x:32 },
      { name: "DFC2", assigned: false, y:60, x:60 },
      { name: "LD", assigned: false, y:58, x:82 },
      { name: "MCD1", assigned: false, y:36, x:15 },
      { name: "MC", assigned: false, y:32, x:45 },
      { name: "MCD2", assigned: false, y:36, x:75 },
      { name: "EI", assigned: false, y:5, x:25 },
      { name: "DEL", assigned: false, y:3, x:45 },
      { name: "ED", assigned: false, y:5, x:65 },
    ],
  },
  {
    name: "5-3-2",
    positions: [
      { name: "POR", assigned: false, y:80, x:45 },

      //5
      { name: "LI", assigned: false, y:51, x:8 },
      { name: "DFC1", assigned: false, y:53, x:25 },
      { name: "DFC2", assigned: false, y:53, x:45 },
      { name: "DFC3", assigned: false, y:53, x:65 },
      { name: "LD", assigned: false, y:51, x:82 },

      //3
      { name: "MC1", assigned: false, y:29, x:21 },
      { name: "MC2", assigned: false, y:29, x:45 },
      { name: "MC3", assigned: false, y:29, x:69 },

      //2
      { name: "DEL1", assigned: false, y:3, x:30 },
      { name: "DEL2", assigned: false, y:3, x:60 },
    ],
  },
  {
    name: "4-2-3-1 AMPLIA",
    positions: [
      { name: "POR", assigned: false, y:80, x:45 },
      //4
      { name: "LI", assigned: false, y:62, x:8 },
      { name: "DFC1", assigned: false, y:64, x:25 },
      { name: "DFC2", assigned: false, y:64, x:65 },
      { name: "LD", assigned: false, y:62, x:82 },

      //2
      { name: "MCD1", assigned: false, y:41, x:27 },
      { name: "MCD2", assigned: false, y:41, x:63 },

      //3
      { name: "MI", assigned: false, y:28, x:9 },
      { name: "MCO", assigned: false, y:28, x:45 },
      { name: "MD", assigned: false, y:28, x:81 },

      //1
      { name: "DEL", assigned: false, y:3, x:45 },
    ],
  }
]
