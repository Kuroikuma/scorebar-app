import { useConfigStore } from '@/store/configStore';
import { Game, GameState, useGameStore } from '@/store/gameStore';
import { TeamsState } from '@/store/teamsStore';
import axios, { AxiosInstance } from 'axios';

function abbreviateCity(city: string): string {
  // Dividir el nombre de la ciudad en palabras y tomar la primera letra de cada palabra
  const words = city.split(" ");
  const abbreviation = words.map(word => word.charAt(0).toUpperCase()).join("");
  
  return abbreviation;
}

export const axiosInstance = (id:string): AxiosInstance => {
  return axios.create({
    baseURL: `https://app.overlays.uno/apiv2/controlapps/${id}/api`,
  });
}

export const SetOverlayContent = (id: string, contentId: string, content: any) => {
  return axiosInstance(id).put('', {
    command: 'SetOverlayContent',
    id: contentId,
    content: content,
  })
}

export const toogleVisibleOverlay = (id: string, contentId: string, command: string) => {
  return axiosInstance(id).put('', {
    command: command ,
    id: contentId,
  })
}

export const updateOverlayContent = (id: string, contentId: string, game: Game) => {

  let content ={
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
  let validate = fieldId.includes("Team 1")
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

  let validate = fieldId.includes("Team 1")

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

export const setCustomationFieldAll = ( fieldId: string, newName: string, newColor: string, newTextColor: string) => {
  const scorebugId = useConfigStore.getState().currentConfig?.scorebug.overlayId as string;

  const value = fieldId.includes("Name") ? newName : fieldId.includes("Color") ? newColor : newTextColor;

  Promise.all([
    setCustomizationField(scorebugId, fieldId, value),
    updateNameScorebarMinimal(fieldId, newName),
    updateNameLineup(fieldId, newName, newColor, newTextColor)
  ]).then(() => {
    console.log("Customization field set")
  })
}
