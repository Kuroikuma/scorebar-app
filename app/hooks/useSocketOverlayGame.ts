import { useEffect } from 'react';
import socket from '../service/socket';
import { Game, IBase, useGameStore } from '../store/gameStore';
import { Player, Team, useTeamsStore } from '../store/teamsStore';
import { useOverlayStore } from '../store/overlayStore';

export interface ISocketDataPlayer {
  teamIndex: number;
  strikes: number;
  balls: number;
  team: Team;
  bases: IBase[];
  socketId: string;
}

export interface ISocketDataInning {
  inning: number;
  isTopInning: boolean;
  balls: number;
  strikes: number;
  outs: number;
  bases: IBase[];
  socketId: string;
}

interface ISocketDataAdvanceBatter {
  teamIndex: number;
  currentBatter: number;
  socketId: string;
}

interface ISocketUpdatePlayer {
  teamIndex: number;
  lineup: Player[];
  lineupSubmitted: boolean;
  socketId: string;
}

interface ISocketBalls {
  balls: number;
  socketId: string;
}

interface ISocketBase {
  baseIndex: number;
  isOccupied: boolean;
  socketId: string;
}

interface ISocketChangeCurrentBatter {
  teamIndex: number;
  currentBatter: number;
  socketId: string;
}

interface ISocketChangeIsDHEnabled {
  isDHEnabled: boolean;
  socketId: string;
}

interface ISocketErrorsGame {
  errors: number;
  teamIndex: number;
  socketId: string;
}

interface ISocketHits {
  hits: number;
  teamIndex: number;
  socketId: string;
}

interface ISocketOut {
  outs: number;
  strikes: number;
  balls: number;
  socketId: string;
}

interface ISocketDataUpdateGame {
  game: Omit<Game, 'userId'>;
}

interface ISocketDataPastAndFutureGame {
  past: Partial<Omit<Game, 'userId'>>[];
  future: Partial<Omit<Game, 'userId'>>[];
  socketId: string;
}

interface ISocketStrikes {
  strikes: number;
  socketId: string;
}

interface ISocketTeamColor {
  teamIndex: number;
  color: string;
  socketId: string;
}

interface ISocketTeamTextColor {
  teamIndex: number;
  textColor: string;
  socketId: string;
}

interface ISocketTeamName {
  name: string;
  teamIndex: number;
  socketId: string;
}

interface ISocketShortName {
  shortName: string;
  teamIndex: number;
  socketId: string;
}

interface ISocketRuns {
  teamIndex: number;
  runs: number;
  runsInning: number;
  socketId: string;
}

export const useSocketOverlayGame = (id: string) => {
  const { advanceBatter } = useTeamsStore();

  const { isTopInning } = useGameStore();

  const {
    changeLineupOverlay,
    handlePlayerOverlay,
    changeBallsCountOveraly,
    changeBasesRunnersOverlay,
    changeCurrentBatter,
    setIsDHEnabled,
    changeErrorsGameOverlay,
    changeHitsCountOverlay,
    changeInningCountOverlay,
    changeOutCountOverlay,
    updateGameOverlay,
    changePastAndFutureGameOverlay,
    changeStrikesCountOveraly,
    changeTeamColorOverlay,
    changeTeamTextColorOverlay,
    changeTeamNameOverlay,
    changeShortNameOverlay,
    incrementRunsOverlay,
  } = useOverlayStore();

  const teamIndex = isTopInning ? 0 : 1;

  useEffect(() => {
    const eventNameRuns = `server:scoreRun/${id}`;
    const eventNameShortName = `server:teamShortName/${id}`;
    const eventNameTeamName = `server:teamName/${id}`;
    const eventNameStrike = `server:strikeCount/${id}`;
    const eventNameUpdatePlayer = `server:updatePlayer/${id}`;
    const eventNameHandlePlay = `server:handlePlay/${id}`;
    const eventNameAdvancedBatter = `server:AdvanceBatter/${id}/${teamIndex}`;
    const eventNameBalls = `server:ballCount/${id}`;
    const eventNameBase = `server:baseRunner/${id}`;
    const eventNameChangeCurrentBatter = `server:changeCurrentBatter/${id}`;
    const eventNameChangeIsDHEnabled = `server:DHEnable/${id}`;
    const eventNameError = `server:errorsCount/${id}`;
    const eventNameHits = `server:hitsCount/${id}`;
    const eventNameInning = `server:inning/${id}`;
    const eventNameOut = `server:outCount/${id}`;
    const eventNameUpdateGame = `server:updateGame/${id}`;
    const eventNamePastAndFutureGame = `server:changePastAndFutureGame/${id}`;
    const eventNameColor = `server:teamColor/${id}`;
    const eventNameTextColor = `server:teamTextColor/${id}`;

    const socketId = socket.id;

    const refreshLineup = (socketData: ISocketUpdatePlayer) => {
      if (socketData.socketId !== socketId) {
        changeLineupOverlay(socketData.teamIndex, socketData.lineup, socketData.lineupSubmitted);
      }
    };

    const updatePlayerOverlay = (socketData: ISocketDataPlayer) => {
      if (socketData.socketId !== socketId) {
        handlePlayerOverlay(socketData);
      }
    };

    const advancedBatterSocket = (socketData: ISocketDataAdvanceBatter) => {
      if (socketData.socketId !== socketId) {
        advanceBatter(socketData.teamIndex, false);
      }
    };

    const updateBalls = (socketData: ISocketBalls) => {
      console.log("updateBalls", socketData.balls);
      if (socketData.socketId !== socket.id) {
        
        changeBallsCountOveraly(socketData.balls);
      }
    };

    const updateBaseRunners = (socketData: ISocketBase) => {
      if (socketData.socketId !== socket.id) {
        changeBasesRunnersOverlay(socketData.baseIndex, socketData.isOccupied);
      }
    };

    const updateCurrentBatter = (socketData: ISocketChangeCurrentBatter) => {
      if (socketData.socketId !== socket.id) {
        changeCurrentBatter(socketData.currentBatter);
      }
    };

    const updateIsDHEnabled = (socketData: ISocketChangeIsDHEnabled) => {
      if (socketData.socketId !== socket.id) {
        setIsDHEnabled(socketData.isDHEnabled);
      }
    };

    const refreshErrorsGameOverlay = (socketData: ISocketErrorsGame) => {
      if (socketData.socketId !== socket.id) {
        changeErrorsGameOverlay(socketData.errors, socketData.teamIndex);
      }
    };

    const refreshHitsCountOverlay = (socketData: ISocketHits) => {
      if (socketData.socketId !== socket.id) {
        changeHitsCountOverlay(socketData.hits, socketData.teamIndex);
      }
    };

    const updateInningCountOverlay = (socketData: ISocketDataInning) => {
      if (socketData.socketId !== socket.id) {
        changeInningCountOverlay(socketData);
      }
    };

    const updateOuts = (socketData: ISocketOut) => {
      if (socketData.socketId !== socket.id) {
        changeOutCountOverlay(socketData.outs, socketData.strikes, socketData.balls);
      }
    };

    const updateGameSocket = (socketData: ISocketDataUpdateGame) => {
      if ((socketData.game as any).socketId !== socketId) {
        updateGameOverlay(socketData.game);
      }
    };

    const updatePastAndFutureGame = (socketData: ISocketDataPastAndFutureGame) => {
      if (socketData.socketId !== socketId) {
        changePastAndFutureGameOverlay(socketData.past, socketData.future);
      }
    };

    const updateStrikes = (socketData: ISocketStrikes) => {
      if (socketData.socketId !== socket.id) {
        changeStrikesCountOveraly(socketData.strikes);
      }
    };

    const updateTeamColor = (socketData: ISocketTeamColor) => {
      if (socketData.socketId !== socket.id) {
        changeTeamColorOverlay(socketData.teamIndex, socketData.color);
      }
    };

    const updateTeamTextColor = (socketData: ISocketTeamTextColor) => {
      if (socketData.socketId !== socket.id) {
        changeTeamTextColorOverlay(socketData.teamIndex, socketData.textColor);
      }
    };

    const modifyTeamName = (socketData: ISocketTeamName) => {
      if (socketData.socketId !== socket.id) {
        changeTeamNameOverlay(socketData.teamIndex, socketData.name);
      }
    };

    const updateShortNameOverlay = (socketData: ISocketShortName) => {
      if (socketData.socketId !== socket.id) {
        changeShortNameOverlay(socketData.shortName, socketData.teamIndex);
      }
    };

    const updateRuns = (socketData: ISocketRuns) => {
      if (socketData.socketId !== socket.id) {
        incrementRunsOverlay(socketData.teamIndex, socketData.runs, socketData.runsInning);
      }
    };

    socket.on(eventNameRuns, updateRuns);
    socket.on(eventNameShortName, updateShortNameOverlay);
    socket.on(eventNameTeamName, modifyTeamName);
    socket.on(eventNameColor, updateTeamColor);
    socket.on(eventNameTextColor, updateTeamTextColor);
    socket.on(eventNameStrike, updateStrikes);
    socket.on(eventNameUpdateGame, updateGameSocket);
    socket.on(eventNameOut, updateOuts);
    socket.on(eventNameInning, updateInningCountOverlay);
    socket.on(eventNameHits, refreshHitsCountOverlay);
    socket.on(eventNameError, refreshErrorsGameOverlay);
    socket.on(eventNameBase, updateBaseRunners);
    socket.on(eventNameBalls, updateBalls);
    socket.on(eventNameHandlePlay, updatePlayerOverlay);
    socket.on(eventNameUpdatePlayer, refreshLineup);
    socket.on(eventNameAdvancedBatter, advancedBatterSocket);
    socket.on(eventNameChangeCurrentBatter, updateCurrentBatter);
    socket.on(eventNameChangeIsDHEnabled, updateIsDHEnabled);
    socket.on(eventNamePastAndFutureGame, updatePastAndFutureGame);

    return () => {
      socket.off(eventNameUpdatePlayer, refreshLineup);
      socket.off(eventNameHandlePlay, updatePlayerOverlay);
      socket.off(eventNameAdvancedBatter, advancedBatterSocket);
      socket.off(eventNameBalls, updateBalls);
      socket.off(eventNameBase, updateBaseRunners);
      socket.off(eventNameChangeCurrentBatter, updateCurrentBatter);
      socket.off(eventNameChangeIsDHEnabled, updateIsDHEnabled);
      socket.off(eventNameError, refreshErrorsGameOverlay);
      socket.off(eventNameHits, refreshHitsCountOverlay);
      socket.off(eventNameInning, updateInningCountOverlay);
      socket.off(eventNameOut, updateOuts);
      socket.off(eventNameUpdateGame, updateGameSocket);
      socket.off(eventNamePastAndFutureGame, updatePastAndFutureGame);
      socket.off(eventNameStrike, updateStrikes);
      socket.off(eventNameColor, updateTeamColor);
      socket.off(eventNameTextColor, updateTeamTextColor);
      socket.off(eventNameTeamName, modifyTeamName);
      socket.off(eventNameShortName, updateShortNameOverlay);
      socket.off(eventNameRuns, updateRuns);
    };
  }, []);
};
