import { useTeamStore } from '@/matchStore/useTeam'
import FormationSVG from '../svg/formation'
import JerseySVG from '../svg/jersey'
import PlayerPlate from '../formation/PlayerPlate'
import TeamPlate from '../formation/TeamPlate'
import ManagerPlate from '../formation/ManagerPlate'

export type FormationConfig = {
  name: string
  positions: {
    name: string
    gridX: number // 1-12 (como sistema de columnas)
    gridY: number // 1-8
  }[]
}

export const FORMATIONS: Record<string, FormationConfig> = {
  '4-4-2': {
    name: '4-4-2',
    positions: [
      { name: 'GK', gridX: 6.5, gridY: 1.8 },
      { name: 'LB', gridX: 2, gridY: 4 },
      { name: 'CB1', gridX: 5, gridY: 3 },
      { name: 'CB2', gridX: 8, gridY: 3 },
      { name: 'RB', gridX: 11, gridY: 4 },
      { name: 'LM', gridX: 2, gridY: 6 },
      { name: 'CM1', gridX: 5, gridY: 5 },
      { name: 'CM2', gridX: 8, gridY: 5 },
      { name: 'RM', gridX: 11, gridY: 6 },
      { name: 'ST1', gridX: 5, gridY: 7 },
      { name: 'ST2', gridX: 8, gridY: 7 },
    ]
  },
  '4-3-3': {
    name: '4-3-3',
    positions: [
      { name: 'GK', gridX: 6, gridY: 1 },
      // ... otras posiciones
    ]
  }
  // Agregar más formaciones aquí
}

export const convertGridToPercentage = (gridX: number, gridY: number) => {
  const FIELD_COLUMNS = 12
  const FIELD_ROWS = 8
  return {
    x: ((gridX - 1) / (FIELD_COLUMNS - 1)) * 100,
    y: ((gridY - 1) / (FIELD_ROWS - 1)) * 100
  }
}

export const FormationOverlay = () => {
  const formation = useTeamStore((state) => state.homeTeam.formation)
  const teamHome = useTeamStore((state) => state.homeTeam)
  const players = useTeamStore((state) => state.homeTeam.players).filter((player) => player.position !== 'SUP')
  const logo = useTeamStore((state) => state.homeTeam.logo)
  const teamName = teamHome.name

  const currentFormation = FORMATIONS[formation.name] || FORMATIONS['4-4-2']

  return (
    <div className="relative w-full h-full font-['Roboto_Condensed'] bg-transparent">
      {/* Nombre del equipo */}

      <div className="grid grid-cols-7 grid-rows-1 gap-4">
        <div className="flex flex-col items-center justify-between pb-3 col-span-3">
          <TeamPlate logo={logo} name={teamName} primaryColor={teamHome.primaryColor} secondaryColor={teamHome.secondaryColor} textColor={teamHome.textColor} />
          <div className="flex flex-col gap-1">
            {players.map((player, index) => (
              <PlayerPlate
                key={index}
                number={player.number}
                name={player.name}
                primaryColor={teamHome.primaryColor}
                secondaryColor={teamHome.secondaryColor}
                textColor={teamHome.textColor}
              />
            ))}
          </div>
          <ManagerPlate textColor={teamHome.textColor} name={teamHome.staff.manager} primaryColor={teamHome.primaryColor} secondaryColor={teamHome.secondaryColor} />
        </div>
        <div className="col-span-4 col-start-4">
          {/* <div className="text-center text-white text-2xl font-bold mb-4">
            {teamName}
          </div> */}

          {/* Campo de fútbol */}
          <div className="relative w-full h-[calc(100vh)] bg-transparent rounded-lg">
            {/* Líneas del campo */}
            <div className="absolute inset-0 flex flex-col rotate-180">
              {/* <FormationSVG /> */}
              <img src="/field-vectorizado.svg" alt="formation" className="w-full h-full object-contain" />
            </div>

            {/* Posiciones de los jugadores */}
            {currentFormation.positions.map((position, index) => {
              const player = players.find(
                (player) => player.position === position.name
              )

              const { x, y } = convertGridToPercentage(position.gridX, position.gridY)
              return (
                <div
                  key={position.name}
                  className="absolute flex flex-col items-center"
                  style={{ top: `${y}%`, left: `${x}%`, transform: 'translate(-50%, -50%)'  }}
                >
                  {/* Camiseta SVG */}
                  <div className="relative">
                    <JerseySVG primaryColor={teamHome.primaryColor} secondaryColor={teamHome.secondaryColor} />
                    {/* Número del jugador */}
                    <div className="absolute inset-0 flex items-center justify-center font-bold text-xl" style={{color: teamHome.textColor}}>
                      {player?.number ?? '?'}
                    </div>
                  </div>
                  {/* Nombre del jugador */}
                  <div className="text-sm font-semibold text-center" style={{color: teamHome.textColor}}>
                    {player?.name ?? 'Sin asignar'}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Nombre del entrenador */}
          {/* <div className="mt-4 text-center text-white text-lg font-semibold">
            Junior
          </div> */}
        </div>
      </div>
    </div>
  )
}
