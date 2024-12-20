import { Game, GameState } from '@/store/gameStore';
import { TeamsState } from '@/store/teamsStore';
import axios, { AxiosInstance } from 'axios';

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
