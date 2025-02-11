import { useTeamStore } from '@/matchStore/useTeam'
import { useMatchStore } from '@/matchStore/matchStore'
import { IOverlays } from '@/matchStore/interfaces'
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'

interface PreviewOverlayProps {
  item: IOverlays
}

const PreviewOverlay = ({ item }: PreviewOverlayProps) => {
  const { homeTeam, awayTeam } = useTeamStore()
  const { stadiumName, leagueLogo } = useMatchStore()

  return (
    <AnimatePresence initial={false}>
      {item.visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="relative font-['Roboto_Condensed'] w-[70vw] h-[70vh] rounded-3xl flex items-center"
          style={{
            background: `linear-gradient(to right, rgba(32, 0, 199) 0%, rgb(14, 0, 95) 40%, rgb(14, 0, 95) 60%, rgb(32, 0, 199) 100%)`,
          }}
        >
          <div className="h-[70%] w-[40%] flex flex-col">
            <div className="w-[100%] h-[80%]">
              <img src={homeTeam.logo} alt="Logo" className="h-full w-full object-contain" />
            </div>
            <div className="text-white text-center text-2xl font-bold">
              <span className="text-white text-center text-2xl font-bold">{homeTeam.name}</span>
            </div>
          </div>

          <div className="h-[100%] w-[20%] flex flex-col justify-between items-center">
            <div className="w-[100%] h-[40%]">
              <img src={leagueLogo} alt="Logo" className="h-full w-full object-contain" />
            </div>
            <div className="text-white text-center text-6xl font-bold absolute top-[50%]">VS</div>
            <div className="text-white text-center text-2xl font-bold absolute top-[85%]">{stadiumName}</div>
          </div>

          <div className="h-[70%] w-[40%]">
            <div className="w-[100%] h-[80%]">
              <img src={awayTeam.logo} alt="Logo" className="h-full w-full object-contain" />
            </div>
            <div className="text-white text-center text-xl font-bold">
              <span className="text-white text-center text-2xl font-bold">{awayTeam.name}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default React.memo(PreviewOverlay)
