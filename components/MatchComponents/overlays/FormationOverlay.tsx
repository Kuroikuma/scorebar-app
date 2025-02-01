import { useTeamStore } from '@/matchStore/useTeam'
import FormationSVG from '../svg/formation'
import JerseySVG from '../svg/jersey'
import PlayerPlate from '../formation/PlayerPlate'
import TeamPlate from '../formation/TeamPlate'
import ManagerPlate from '../formation/ManagerPlate'

export const FormationOverlay = () => {
  const formation = useTeamStore((state) => state.homeTeam.formation)
  const teamHome = useTeamStore((state) => state.homeTeam)
  const players = useTeamStore((state) => state.homeTeam.players)
  const teamName = teamHome.name

  return (
    <div className="relative w-full h-full font-['Roboto_Condensed'] bg-transparent">
      {/* Nombre del equipo */}

      <div className="grid grid-cols-3 grid-rows-1 gap-4">
        <div className="flex flex-col items-center justify-between pb-3">
          <TeamPlate logo="/logoEquipo.svg" name={teamName} primaryColor={teamHome.primaryColor} secondaryColor={teamHome.secondaryColor} textColor={teamHome.textColor} />
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
        <div className="col-span-2">
          {/* <div className="text-center text-white text-2xl font-bold mb-4">
            {teamName}
          </div> */}

          {/* Campo de fútbol */}
          {/* Campo de fútbol */}
          <div className="relative w-full h-[calc(100vh)] bg-transparent rounded-lg">
            {/* Líneas del campo */}
            <div className="absolute inset-0 flex flex-col">
              <FormationSVG />
            </div>

            {/* Posiciones de los jugadores */}
            {formation.positions.map((position, index) => {
              const player = players.find(
                (player) => player.position === position.name
              )
              return (
                <div
                  key={position.name}
                  className="absolute flex flex-col items-center"
                  style={{ top: `${position.y}%`, left: `${position.x}%` }}
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
