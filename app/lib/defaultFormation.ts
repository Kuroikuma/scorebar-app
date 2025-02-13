import { FormationFootball } from "@/matchStore/interfaces";

// defaultFormation.ts
export const defaultFormation:FormationFootball[] = [
  {
    name: "4-4-2",
    positions: [
      { name: "POR", assigned: false, y:75, x:45 },
      { name: "LI", assigned: false, y:60, x:8 },
      { name: "DFC1", assigned: false, y:50, x:32 },
      { name: "DFC2", assigned: false, y:50, x:60 },
      { name: "LD", assigned: false, y:60, x:82 },

      { name: "MI", assigned: false, y:34, x:10 },
      { name: "MC1", assigned: false, y:22, x:32 },
      { name: "MC2", assigned: false, y:22, x:58 },
      { name: "MD", assigned: false, y:34, x:80 },
      { name: "DEL1", assigned: false, y:5, x:36 },
      { name: "DEL2", assigned: false, y:5, x:54 },
    ],
  }
]
