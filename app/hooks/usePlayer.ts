import { useGameStore } from '../store/gameStore'
import { ITurnAtBat, Player, TypeAbbreviatedBatting, useTeamsStore } from '../store/teamsStore'

interface IReturneUsePlayer {
  position: string
  number: string
  name: string
  battingOrder: number
  turnsAtBat: ITurnAtBat[]
  defensiveOrder: number
  totalTurnsAtBat: number
  numberOfHits: number
  logo: string
}

const usePlayer = (): IReturneUsePlayer => {
  const { getCurrentBatter, inning, isTopInning } = useGameStore()
  const { teams } = useTeamsStore()
  const teamIndex = isTopInning ? 0 : 1
  const currentTeam = teams[teamIndex]

  const player = getCurrentBatter() as Player | undefined

  if (!player) {
    // Manejar el caso en que no haya jugador actual
    return {
      position: '',
      number: '',
      name: '',
      battingOrder: 0,
      turnsAtBat: [],
      defensiveOrder: 0,
      totalTurnsAtBat: 0,
      numberOfHits: 0,
      logo: ''
    }
  }

  const { position, number, name, battingOrder, turnsAtBat, defensiveOrder } =
    player

  const totalTurnsAtBat = turnsAtBat.filter(
    (turnAtBat) =>
      ![
        TypeAbbreviatedBatting.BaseBayBall,
        TypeAbbreviatedBatting.HitByPitch,
        TypeAbbreviatedBatting.ErrorPlay,
      ].includes(turnAtBat.typeAbbreviatedBatting)
  ).length

  // Filtramos los turnos que representan un hit válido
  const numberOfHits = turnsAtBat.filter(
    (turnAtBat) =>
      ![
        TypeAbbreviatedBatting.Out,
        TypeAbbreviatedBatting.BaseBayBall,
        TypeAbbreviatedBatting.HitByPitch,
        TypeAbbreviatedBatting.ErrorPlay,
      ].includes(turnAtBat.typeAbbreviatedBatting)
  ).length

  const returnedData = {
    position,
    number,
    name,
    battingOrder,
    turnsAtBat,
    defensiveOrder,
    totalTurnsAtBat,
    numberOfHits,
    logo: currentTeam.logo as string,
  }

  return returnedData
}

export default usePlayer
