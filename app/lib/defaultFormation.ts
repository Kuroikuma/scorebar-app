import { FormationFootball } from "@/matchStore/interfaces";

// defaultFormation.ts
export const defaultFormation:FormationFootball[] = [
  {
    name: "4-4-2",
    positions: [
      { name: "GK", assigned: false, y:5, x:46 },
      { name: "LB", assigned: false, y:24, x:24 },
      { name: "CB1", assigned: false, y:16, x:38 },
      { name: "CB2", assigned: false, y:16, x:55 },
      { name: "RB", assigned: false, y:24, x:68 },
      { name: "LM", assigned: false, y:55, x:24 },
      { name: "CM1", assigned: false, y:45, x:38 },
      { name: "CM2", assigned: false, y:45, x:55 },
      { name: "RM", assigned: false, y:55, x:68 },
      { name: "ST1", assigned: false, y:75, x:36 },
      { name: "ST2", assigned: false, y:75, x:54 },
    ],
  }
]
