import { FormationFootball } from "@/matchStore/interfaces";

// defaultFormation.ts
export const defaultFormation:FormationFootball[] = [
  {
    name: "4-4-2",
    positions: [
      { name: "POR", assigned: false, y:5, x:47 },
      { name: "LI", assigned: false, y:24, x:20 },
      { name: "DFC1", assigned: false, y:16, x:36 },
      { name: "DFC2", assigned: false, y:16, x:58 },
      { name: "LD", assigned: false, y:24, x:73 },
      { name: "MI", assigned: false, y:55, x:18 },
      { name: "MC1", assigned: false, y:45, x:36 },
      { name: "MC2", assigned: false, y:45, x:58 },
      { name: "MD", assigned: false, y:55, x:74 },
      { name: "DEL1", assigned: false, y:75, x:36 },
      { name: "DEL2", assigned: false, y:75, x:58 },
    ],
  }
]
