import { FormationFootball } from "@/matchStore/interfaces";

// defaultFormation.ts
export const defaultFormation:FormationFootball[] = [
  {
    name: "4-4-2",
    positions: [
      { name: "GK", assigned: false, y:5, x:47 },
      { name: "LB", assigned: false, y:24, x:20 },
      { name: "CB1", assigned: false, y:16, x:36 },
      { name: "CB2", assigned: false, y:16, x:58 },
      { name: "RB", assigned: false, y:24, x:73 },
      { name: "LM", assigned: false, y:55, x:18 },
      { name: "CM1", assigned: false, y:45, x:36 },
      { name: "CM2", assigned: false, y:45, x:58 },
      { name: "RM", assigned: false, y:55, x:74 },
      { name: "ST1", assigned: false, y:75, x:36 },
      { name: "ST2", assigned: false, y:75, x:58 },
    ],
  }
]
