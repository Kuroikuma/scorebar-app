import { Status } from "@/app/store/gameStore"

export interface PlayerFootball {
  id: string
  name: string
  number: number
  position: string
  image?: string
}

let __initOverlays = {
  x: 100,
  y: 100,
  scale: 100,
  visible: false,
};

export type IOverlays = {
  visible: boolean;
  x: number;
  y: number;
  scale: number;
  id: string;
}

export interface StaffFootball {
  manager: string
  assistantManager: string
  physio: string
}

export interface PositionFormationFootball {
  name: string
  assigned: boolean
  x: number
  y: number
}

export interface FormationFootball {
  name: string // e.g. "4-4-2", "4-3-3"
  positions: PositionFormationFootball[]
}

export type TeamRole = "home" | "away"

export interface MatchEventFootball {
  id: string
  type: "goal" | "yellowCard" | "redCard" | "substitution"
  minute: number
  teamId: TeamRole
  playerId: string
  assistById?: string // for goals
  replacedById?: string // for substitutions
}

export interface SubstitutionFootball {
  id: string
  minute: number
  teamId: TeamRole
  playerOutId: string
  playerInId: string
}

export interface TeamFootball {
  name: string
  shortName: string
  score: number
  color: string
  textColor: string
  logo: string
  logoFit: "contain" | "cover"
  players: PlayerFootball[]
  staff: StaffFootball
  formation: FormationFootball
  teamRole : TeamRole
  primaryColor: string
  secondaryColor: string
}

export interface TimeFootball {
  minutes: number
  seconds: number
  stoppage: number
  isRunning: boolean
}


export type PeriodNameFootball = "1st Half" | "2nd Half" | "1st Extra" | "2nd Extra"
interface PeriodFootball {
  name: PeriodNameFootball
  active: boolean
}

export interface IMatchFootball {
  homeTeam: TeamFootball
  awayTeam: TeamFootball
  events: MatchEventFootball[]
  time: TimeFootball
  period: PeriodFootball[]
  substitutions: SubstitutionFootball[]
  scoreboardUpOverlay: IOverlays
  formationOverlay: IOverlays
  goalsDownOverlay: IOverlays
  scoreBoardDownOverlay: IOverlays
  previewOverlay: IOverlays
  leagueName: string
  leagueLogo: string
  stadiumName: string
  matchDate: string
  id: string
}

export interface MatchState2 {
  homeTeam: TeamFootball
  awayTeam: TeamFootball
  events: MatchEventFootball[]
  time: TimeFootball
  period: PeriodFootball[]
  overlay: {
    enabled: boolean
    horizontalPosition: number
    verticalPosition: number
    showEvents: boolean
    eventDuration: number
  }
  substitutions: SubstitutionFootball[]
}

export interface EventState {
  events: MatchEventFootball[]
  overlay: {
    enabled: boolean
    horizontalPosition: number
    verticalPosition: number
    showEvents: boolean
    eventDuration: number
  }
  substitutions: SubstitutionFootball[]
}

export interface TimeState {
  time: TimeFootball
  period: PeriodFootball[]
}

export interface OverlayState {
  scoreboardUpOverlay: IOverlays
  formationOverlay: IOverlays
  goalsDownOverlay: IOverlays
  scoreBoardDownOverlay: IOverlays
  previewOverlay: IOverlays
}

export interface TeamState {
  homeTeam: TeamFootball
  awayTeam: TeamFootball
}

export interface MatchState {
  leagueName: string
  leagueLogo: string
  stadiumName: string
  matchDate: string
  id: string
  status: string
  userId: string
  past: Partial<Omit<IFootballMatch, "userId">>[];
  future: Partial<Omit<IFootballMatch, "userId">>[];
}

export interface IFootballMatch {
  homeTeam: TeamFootball
  awayTeam: TeamFootball
  status: Status
  events: MatchEventFootball[]
  time: TimeFootball
  period: PeriodFootball[]
  substitutions: SubstitutionFootball[]
  scoreboardUpOverlay: IOverlays
  formationOverlay: IOverlays
  goalsDownOverlay: IOverlays
  scoreBoardDownOverlay: IOverlays
  previewOverlay: IOverlays
  leagueName: string
  leagueLogo: string
  stadiumName: string
  matchDate: string
  userId:string
  past: Partial<Omit<IFootballMatch, "userId">>[];
  future: Partial<Omit<IFootballMatch, "userId">>[];
  id?: string
}