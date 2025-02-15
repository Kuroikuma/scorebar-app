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
  }
]
