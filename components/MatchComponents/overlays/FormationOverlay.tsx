import { useTeamStore } from '@/matchStore/useTeam'
import FormationSVG from '../svg/formation'
import JerseySVG from '../svg/jersey'
import PlayerPlate from '../formation/PlayerPlate'
import TeamPlate from '../formation/TeamPlate'
import ManagerPlate from '../formation/ManagerPlate'
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'
import { deleteNumbers, formatName } from '@/app/utils/cropImage'
import PlayerCard from '../formation/playerCard'
import { defaultFormation } from '@/app/lib/defaultFormation'
import { PlayerFootball } from '@/matchStore/interfaces'

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
    ],
  },
  '4-3-3': {
    name: '4-3-3',
    positions: [
      { name: 'GK', gridX: 6, gridY: 1 },
      // ... otras posiciones
    ],
  },
  // Agregar más formaciones aquí
}

export const convertGridToPercentage = (gridX: number, gridY: number) => {
  const FIELD_COLUMNS = 12
  const FIELD_ROWS = 8
  return {
    x: ((gridX - 1) / (FIELD_COLUMNS - 1)) * 100,
    y: ((gridY - 1) / (FIELD_ROWS - 1)) * 100,
  }
}

interface IFormationOverlayProps {
  overlayId: 'formationA' | 'formationB'
  visible: boolean
}

export const FormationOverlay = React.memo(({ overlayId, visible }: IFormationOverlayProps) => {
  const { homeTeam, awayTeam } = useTeamStore()
  let currentTeam = overlayId === 'formationA' ? homeTeam : awayTeam
  const formation = currentTeam.formation
  const players = currentTeam.players.filter((player) => player.position !== 'SUP')
  const logo = currentTeam.logo
  const teamName = currentTeam.name

  const currentFormation = FORMATIONS[formation.name] || FORMATIONS['4-4-2']

  return (
    <AnimatePresence initial={false}>
      {visible ? (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="relative w-full h-full font-['Roboto_Condensed'] bg-transparent">
            {/* Nombre del equipo */}
            {/* Nombre del equipo */}

            <div className="grid grid-cols-7 grid-rows-1 gap-4">
              <div className="flex flex-col items-center justify-between pb-3 col-span-3">
                <TeamPlate
                  logo={logo}
                  name={teamName}
                  primaryColor={currentTeam.primaryColor}
                  secondaryColor={currentTeam.secondaryColor}
                  textColor={currentTeam.textColor}
                />
                <div className="flex flex-col gap-1">
                  {players.map((player, index) => (
                    <PlayerPlate
                      key={index}
                      number={player.number}
                      name={player.name}
                      primaryColor={currentTeam.primaryColor}
                      secondaryColor={currentTeam.secondaryColor}
                      textColor={currentTeam.textColor}
                    />
                  ))}
                </div>
                <ManagerPlate
                  textColor={currentTeam.textColor}
                  name={currentTeam.staff.manager}
                  primaryColor={currentTeam.primaryColor}
                  secondaryColor={currentTeam.secondaryColor}
                />
              </div>
              <div className="col-span-4 col-start-4">
                {/* <div className="text-center text-white text-2xl font-bold mb-4">
              {teamName}
            </div> */}

                {/* Campo de fútbol */}
                <div className="relative w-full h-[calc(100vh)] bg-transparent rounded-lg">
                  {/* Líneas del campo */}
                  <div className="absolute inset-0 flex flex-col scale-x-125">
                    <FormationSVG />
                  </div>

                  {/* Posiciones de los jugadores */}
                  {defaultFormation[24].positions.map((position, index) => {
                    const player = players.find((player) => player.position === position.name) as PlayerFootball

                    // const { x, y } = convertGridToPercentage(position.gridX, position.gridY)
                    return (
                      <div
                        key={position.name}
                        className="absolute flex flex-col items-center"
                        style={{ top: `${position.y}%`, left: `${position.x}%` }}
                      >
                        {/* Camiseta SVG */}
                        <PlayerCard position={player?.position} name={player?.name} number={player?.number} image={player?.image} />
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
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
})
