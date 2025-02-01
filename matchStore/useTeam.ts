import { FormationFootball, PlayerFootball, StaffFootball, TeamFootball, TeamRole, TeamState } from "@/matchStore/interfaces"
import { create } from "zustand"

const defaultFormation: FormationFootball = {
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

const defaultStaff: StaffFootball = {
  manager: "Alexander Ampie",
  assistantManager: "",
  physio: "",
}

const initialState: TeamState = {
  homeTeam: {
    name: "Home Team",
    score: 0,
    color: "#06c12",
    primaryColor:"#c2a770",
    secondaryColor:"",
    textColor: "#ffffff",
    logo: "/placeholder.svg",
    logoFit: "contain",
    players: [
      {
        id: "1",
        name: "J. Hart",
        number: 1,
        position: "GK",
      },
      {
        id: "2",
        name: "Junior Hurtado",
        number: 2,
        position: "RB",
      },
      {
        id: "3",
        name: "J. Stones",
        number: 5,
        position: "CB1",
      },
      {
        id: "4",
        name: "H. Maguire",
        number: 6,
        position: "CB2",
      },
      {
        id: "5",
        name: "L. Shaw",
        number: 3,
        position: "LB",
      },
      {
        id: "6",
        name: "K. Phillips",
        number: 14,
        position: "CM1",
      },
      {
        id: "7",
        name: "D. Rice",
        number: 4,
        position: "CM2",
      },
      {
        id: "8",
        name: "R. Sterling",
        number: 7,
        position: "LM",
      },
      {
        id: "9",
        name: "H. Kane",
        number: 9,
        position: "ST1",
      },
      {
        id: "10",
        name: "P. Foden",
        number: 20,
        position: "RM",
      },
      {
        id: "11",
        name: "J. Sancho",
        number: 11,
        position: "ST2",
      },
    ],
    staff: defaultStaff,
    formation: defaultFormation,
    teamRole: "home",
    shortName:"H"
  },
  awayTeam: {
    name: "Away Team",
    shortName:"A",
    score: 0,
    color: "#b60218",
    textColor: "#ffffff",
    logo: "/placeholder.svg",
    primaryColor:"#852b35",
    secondaryColor:"#9da1a2",
    logoFit: "contain",
    players: [
      {
        id: "1",
        name: "J. Hart",
        number: 1,
        position: "GK",
      },
      {
        id: "2",
        name: "Junior Hurtado",
        number: 2,
        position: "RB",
      },
      {
        id: "3",
        name: "J. Stones",
        number: 5,
        position: "CB1",
      },
      {
        id: "4",
        name: "H. Maguire",
        number: 6,
        position: "CB2",
      },
      {
        id: "5",
        name: "L. Shaw",
        number: 3,
        position: "LB",
      },
      {
        id: "6",
        name: "K. Phillips",
        number: 14,
        position: "CM1",
      },
      {
        id: "7",
        name: "D. Rice",
        number: 4,
        position: "CM2",
      },
      {
        id: "8",
        name: "R. Sterling",
        number: 7,
        position: "LM",
      },
      {
        id: "9",
        name: "H. Kane",
        number: 9,
        position: "ST1",
      },
      {
        id: "10",
        name: "P. Foden",
        number: 20,
        position: "RM",
      },
      {
        id: "11",
        name: "J. Sancho",
        number: 11,
        position: "ST2",
      },
    ],
    staff: defaultStaff,
    formation: defaultFormation,
    teamRole: "away"
  }
}

interface TeamStore extends TeamState {
  addPlayer: (teamRole: TeamRole, player: Omit<PlayerFootball, "id">) => void
  updateTeam: (team: TeamRole, updates: Partial<TeamFootball>) => void
  updateStaff: (team: TeamRole, updates: Partial<StaffFootball>) => void
  updateFormation: (team: TeamRole, formation: FormationFootball) => void
  updateTeamName: (team: TeamRole, name: string) => void
}

export const useTeamStore = create<TeamStore>((set, get) => ({
  ...initialState,
  addPlayer: (teamRole, playerData) => {
    const { homeTeam, awayTeam } = get()

    let team = teamRole === "home" ? homeTeam : awayTeam;

    const updatedFormation = team.formation.positions.map((pos) => {
      if (!pos.assigned && pos.name === playerData.position) {
        return { ...pos, assigned: true };
      }
      return pos;
    });

    set(({
      [teamRole === "home" ? "homeTeam" : "awayTeam"]: {
        ...team,
        players: [
          ...team.players,
          { ...playerData, id: Date.now().toString() },
        ],
        formation: {
          ...team.formation,
          positions: updatedFormation,
        },
      },
    }))
  },
  updateTeam: (team, updates) =>
    set((state) => ({
      [team === "home" ? "homeTeam" : "awayTeam"]: {
        ...state[team === "home" ? "homeTeam" : "awayTeam"],
        ...updates,
      },
    })),
  updateTeamName: (team, name) =>
    set((state) => ({
      [team === "home" ? "homeTeam" : "awayTeam"]: {
        ...state[team === "home" ? "homeTeam" : "awayTeam"],
        name,
      },
    })),
  updateStaff: (team, updates) =>
    set((state) => ({
      [team === "home" ? "homeTeam" : "awayTeam"]: {
        ...state[team === "home" ? "homeTeam" : "awayTeam"],
        staff: {
          ...state[team === "home" ? "homeTeam" : "awayTeam"].staff,
          ...updates,
        },
      },
    })),
  updateFormation: (team, formation) =>
    set((state) => ({
      [team === "home" ? "homeTeam" : "awayTeam"]: {
        ...state[team === "home" ? "homeTeam" : "awayTeam"],
        formation,
      },
    })),
}))

