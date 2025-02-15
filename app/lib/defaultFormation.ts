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
    name: "4-3-3",
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
  }
]
