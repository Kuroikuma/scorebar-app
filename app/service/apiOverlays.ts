import { useConfigStore } from '@/app/store/configStore';
import { Game, useGameStore } from '@/app/store/gameStore';
import axios, { AxiosInstance } from 'axios';
import { Player, useTeamsStore } from '../store/teamsStore';

// function abbreviateCity(city: string): string {
//   // Dividir el nombre de la ciudad en palabras y tomar la primera letra de cada palabra
//   const words = city.split(" ");
//   const abbreviation = words.map(word => word.charAt(0).toUpperCase()).join("");
  
//   return abbreviation;
// }

export const axiosInstance = (id:string): AxiosInstance => {
  return axios.create({
    baseURL: `https://app.overlays.uno/apiv2/controlapps/${id}/api`,
  });
}

export const SetOverlayContent = (id: string, contentId: string, content: Object) => {
  return axiosInstance(id).put('', {
    command: 'SetOverlayContent',
    id: contentId,
    content: content,
  })
}

export const setActiveNumber = (currentBatter: number, teamIndex: number) => {
  const overlayIdA = useConfigStore.getState().currentConfig?.battingOrderA.overlayId as string;
  const overlayIdB = useConfigStore.getState().currentConfig?.battingOrderB.overlayId as string;

  const overlayId = teamIndex === 0 ? overlayIdA : overlayIdB;

  return axiosInstance(overlayId).put('', {
    command: "SetActiveNumber",
    value: currentBatter
  })
}

export const setOverlayBattingOrder = (id: string, content: any) => {
  return axiosInstance(id).put('', {
    command: 'SetData',
    value: content,
  })
}

export const toogleVisibleOverlay = (id: string, contentId: string, command: string) => {
  return axiosInstance(id).put('', {
    command: command ,
    id: contentId,
  })
}

let timeoutId: NodeJS.Timeout | null = null;

export const showBattingOrder = () => {
  const { isTopInning } = useGameStore.getState();
  const { battingOrderA, battingOrderB } = useConfigStore.getState().currentConfig || {};
  const overlayId = isTopInning ? battingOrderA?.overlayId : battingOrderB?.overlayId;

  if (!overlayId) {
    console.error('Overlay ID is missing');
    return;
  }

  const sendOverlayCommand = (command: 'ShowOverlay' | 'HideOverlay') => {
    axiosInstance(overlayId).put('', { command });
  };

  // Limpiar temporizador anterior si existe
  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  sendOverlayCommand('ShowOverlay');

  // Configurar un nuevo temporizador
  timeoutId = setTimeout(() => {
    sendOverlayCommand('HideOverlay');
    timeoutId = null; // Restablecer referencia después de ejecución
  }, 10000);
};


export const updateOverlayContent = (id: string, contentId: string, game: Omit<Game, "userId">) => {

  const content ={
    "1st Base Runner": game.bases[0],
    "2nd Base Runner": game.bases[1],
    "3rd Base Runner": game.bases[2],
    "Balls": game.balls,
    "Inning": game.inning,
    "Outs": `${game.outs} OUT`,
    "Strikes": game.strikes,
    "Team 1 Runs": game.teams[0].runs,
    "Team 2 Runs": game.teams[1].runs,
    "topOrBottomInning": game.isTopInning ? "top" : "bottom"
  }

  return SetOverlayContent(id, contentId, content)
}

export const setCustomizationField = (id: string, fieldId: string, value: string | number) => {
  return axiosInstance(id).put('', {
    command: 'SetCustomizationField',
    fieldId: fieldId,
    value: value,
  })
}

const updateNameLineup = (fieldId: string, newName: string, newColor: string, newTextColor: string) => {
  const validate = fieldId.includes("Team 1")
  const overlayIdA = useConfigStore.getState().currentConfig?.formationA.overlayId as string;
  const OverlayIdB = useConfigStore.getState().currentConfig?.formationB.overlayId as string;
  const modelIdA = useConfigStore.getState().currentConfig?.formationA.modelId as string;
  const modelIdB = useConfigStore.getState().currentConfig?.formationB.modelId as string;

  const content = {
    Title: newName,
    ["Team Color"]: newColor,
    ["Team Text Color"]: newTextColor,
  }

  if (validate) { 
    SetOverlayContent(overlayIdA, modelIdA, content)
  } else {
    SetOverlayContent(OverlayIdB, modelIdB, content)
  }
}

const updateNameScorebarMinimal = (fieldId: string, value: string) => {
  const overlayId = useConfigStore.getState().currentConfig?.scoreboardMinimal.overlayId as string;
  const modelId = useConfigStore.getState().currentConfig?.scoreboardMinimal.modelId as string;

  const validate = fieldId.includes("Team 1")

  if (validate) {
    const content = {
      aTeam: value,
      aCity: value,
    } 

    SetOverlayContent(overlayId, modelId, content)
  } else  {
    const content = {
      bTeam: value,
      bCity: value,
    }

    SetOverlayContent(overlayId, modelId, content)
  }
}

export const setInningMinimal = (newInning: number) => {
  const overlayId = useConfigStore.getState().currentConfig?.scoreboardMinimal.overlayId as string;
  const modelId = useConfigStore.getState().currentConfig?.scoreboardMinimal.modelId as string;

  function getInningLabel(inning: number): string {
    const ordinalNumbers: { [key: number]: string } = {
      1: "PRIMER",
      2: "SEGUNDO",
      3: "TERCER",
      4: "CUARTO",
      5: "QUINTO",
      6: "SEXTO",
      7: "SÉPTIMO",
      8: "OCTAVO",
      9: "NOVENO",
    };
  
    if (ordinalNumbers[inning]) {
      return `${ordinalNumbers[inning]} INNING`;
    } else {
      return "INNING NO VÁLIDO"; // Mensaje para casos fuera de rango
    }
  }

  const content = {
    "Game State": getInningLabel(newInning),
  }
  SetOverlayContent(overlayId, modelId, content)
}

export const setCustomationFieldAll = ( fieldId: string, newName: string, newColor: string, newTextColor: string) => {
  const scorebugId = useConfigStore.getState().currentConfig?.scorebug.overlayId as string;

  const value = fieldId.includes("Name") ? newName : fieldId.includes("Text") ? newTextColor : newColor;

  Promise.all([
    setCustomizationField(scorebugId, fieldId, value),
    updateNameScorebarMinimal(fieldId, newName),
    updateNameLineup(fieldId, newName, newColor, newTextColor)
  ]).then(() => {
    console.log("Customization field set")
  })
}


const resetOverlayScoreBug = () => {
  const scorebugId = useConfigStore.getState().currentConfig?.scorebug.overlayId as string;
  const modelId = useConfigStore.getState().currentConfig?.scorebug.modelId as string;

  const content = {
    '1st Base Runner': false,
    '2nd Base Runner': false,
    '3rd Base Runner': false,
    'Balls': 0,
    'Inning': 1,
    'Outs': '0 OUT',
    'Strikes': 0,
    'topOrBottomInning': 'top',
    'Team 1 Runs': 0,
    'Team 2 Runs': 0,
  }

  return SetOverlayContent(scorebugId, modelId, content)
}

const resetOverlayScoreBoard = () => {
  const scoreboardId = useConfigStore.getState().currentConfig?.scoreboard.overlayId as string;
  const modelId = useConfigStore.getState().currentConfig?.scoreboard.modelId as string;

  const content = {
    "1T1": 0,
    "1T2": 0,
    "2T1": 0,
    "2T2": 0,
    "3T1": 0,
    "3T2": 0,
    "4T1": 0,
    "4T2": 0,
    "5T1": 0,
    "5T2": 0,
    "6T1": 0,
    "6T2": 0,
    "7T1": 0,
    "7T2": 0,
    "8T1": 0,
    "8T2": 0,
    "9T1": 0,
    "9T2": 0,
    "Team 1 Errors": 0,
    "Team 1 Hits": 0,
    "Team 2 Errors": 0,
    "Team 2 Hits": 0,
}

  return SetOverlayContent(scoreboardId, modelId, content)
}

const resetOverlayScoreBoardMinimal = () => {
  const scoreboardMinimalId = useConfigStore.getState().currentConfig?.scoreboardMinimal.overlayId as string;
  const modelId = useConfigStore.getState().currentConfig?.scoreboardMinimal.modelId as string;

  const content = {
    "Game State": "PRIMER INNING",
    "aScore": 0,
    "bScore": 0,
  }

  return SetOverlayContent(scoreboardMinimalId, modelId, content)
}

export const resetOverlays = () => {
  resetOverlayScoreBug()
  resetOverlayScoreBoard()
  resetOverlayScoreBoardMinimal()
}

function createPlayerObject(players: Player[]): Record<string, string> {
  const playerObject: Record<string, string> = {};

  players.forEach((player) => {
    playerObject[player.position] = player.name;
  });

  return playerObject;
}

const setBattingOrder = (players: Player[], teamIndex: number) => {

  const logo = useTeamsStore.getState().teams[teamIndex].logo;
  const overlayIdA = useConfigStore.getState().currentConfig?.battingOrderA.overlayId as string;
  const overlayIdB = useConfigStore.getState().currentConfig?.battingOrderB.overlayId as string;
  const overlayId = teamIndex === 0 ? overlayIdA : overlayIdB;

  const lineup = players.map((player) => {
    let name = player.name.split(" ")[0];
    let lastname = player.name.split(" ")[1];

    return {
      "Number": player.number,
      "Position": player.position,
      "Logo URL": logo || "",
      "Name": name,
      "Lastname": lastname,
      "Stat 1 Title":"OPS",
      "Stat 1":0.928,
      "Stat 2 Title":"BA",
      "Stat 2":0.266,
      "Stat 3 Title":"HR",
      "Stat 3":32,
      "Stat 4 Title":"RBI",
      "Stat 4":71,
  }
  });

  setOverlayBattingOrder(overlayId, lineup)
}

export const setLineupOverlay = (lineup: Player[], teamIndex: number) => {
  const overlayIdA = useConfigStore.getState().currentConfig?.formationA.overlayId as string;
  const modelIdA = useConfigStore.getState().currentConfig?.formationA.modelId as string;
  const modelIdB = useConfigStore.getState().currentConfig?.formationB.modelId as string;
  const overlayB = useConfigStore.getState().currentConfig?.formationB.overlayId as string;
  

  let content = createPlayerObject(lineup);

  let overlayId = teamIndex === 0 ? overlayIdA : overlayB;
  let modelId = teamIndex === 0 ? modelIdA : modelIdB;

  SetOverlayContent(overlayId, modelId, content)
  setBattingOrder(lineup, teamIndex)
}