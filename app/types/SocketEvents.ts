import { IBase } from '../store/gameStore';
import { Player, Team } from '../store/teamsStore';

// Tipo base para todos los eventos de socket
export interface BaseSocketEvent {
  socketId: string;
}

// Interfaces para eventos específicos
export interface ISocketDataPlayer extends BaseSocketEvent {
  teamIndex: number;
  strikes: number;
  balls: number;
  team: Team;
  bases: IBase[];
}

export interface ISocketDataInning extends BaseSocketEvent {
  inning: number;
  isTopInning: boolean;
  balls: number;
  strikes: number;
  outs: number;
  bases: IBase[];
}

export interface ISocketDataAdvanceBatter extends BaseSocketEvent {
  teamIndex: number;
  currentBatter: number;
}

export interface ISocketUpdatePlayer extends BaseSocketEvent {
  teamIndex: number;
  lineup: Player[];
  lineupSubmitted: boolean;
}

export interface ISocketBalls extends BaseSocketEvent {
  balls: number;
}

export interface ISocketStrikes extends BaseSocketEvent {
  strikes: number;
}

export interface ISocketBase extends BaseSocketEvent {
  baseIndex: number;
  isOccupied: boolean;
}

export interface ISocketChangeCurrentBatter extends BaseSocketEvent {
  teamIndex: number;
  currentBatter: number;
}

export interface ISocketChangeIsDHEnabled extends BaseSocketEvent {
  isDHEnabled: boolean;
}

export interface ISocketErrorsGame extends BaseSocketEvent {
  errors: number;
  teamIndex: number;
}

export interface ISocketHits extends BaseSocketEvent {
  hits: number;
  teamIndex: number;
}

export interface ISocketOut extends BaseSocketEvent {
  outs: number;
  strikes: number;
  balls: number;
}

export interface ISocketDataUpdateGame extends BaseSocketEvent {
  game: any; // Usar tipo Game apropiado
}

export interface ISocketDataPastAndFutureGame extends BaseSocketEvent {
  past: any[];
  future: any[];
}

export interface ISocketTeamColor extends BaseSocketEvent {
  teamIndex: number;
  color: string;
}

export interface ISocketTeamTextColor extends BaseSocketEvent {
  teamIndex: number;
  textColor: string;
}

export interface ISocketTeamName extends BaseSocketEvent {
  name: string;
  teamIndex: number;
}

export interface ISocketShortName extends BaseSocketEvent {
  shortName: string;
  teamIndex: number;
}

export interface ISocketRuns extends BaseSocketEvent {
  teamIndex: number;
  runs: number;
  runsInning: number;
}

// Mapa de eventos de socket
export interface SocketEventMap {
  'ballCount': ISocketBalls;
  'strikeCount': ISocketStrikes;
  'outCount': ISocketOut;
  'inning': ISocketDataInning;
  'baseRunner': ISocketBase;
  'handlePlay': ISocketDataPlayer;
  'updatePlayer': ISocketUpdatePlayer;
  'AdvanceBatter': ISocketDataAdvanceBatter;
  'changeCurrentBatter': ISocketChangeCurrentBatter;
  'DHEnable': ISocketChangeIsDHEnabled;
  'errorsCount': ISocketErrorsGame;
  'hitsCount': ISocketHits;
  'updateGame': ISocketDataUpdateGame;
  'changePastAndFutureGame': ISocketDataPastAndFutureGame;
  'teamColor': ISocketTeamColor;
  'teamTextColor': ISocketTeamTextColor;
  'teamName': ISocketTeamName;
  'teamShortName': ISocketShortName;
  'scoreRun': ISocketRuns;
}

export type SocketEventName = keyof SocketEventMap;