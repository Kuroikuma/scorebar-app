import socket from '@/app/service/socket'
import { IBase, useGameStore } from '@/app/store/gameStore'
import { useOverlayStore } from '@/app/store/overlayStore'
import { motion } from 'framer-motion'
import { useEffect } from 'react'

interface InningsProps {
  inning: number
}

export interface ISocketData {
  inning: number
  isTopInning: boolean
  balls: number
  strikes: number
  outs: number
  bases: IBase[]
}

const inningNames = [
  'PRIMER',
  'SEGUNDO',
  'TERCER',
  'CUARTO',
  'QUINTO',
  'SEXTO',
  'SEPTIMO',
  'OCTAVO',
  'NOVENO',
  'DECIMO',
]

export function Innings({ inning }: InningsProps) {

  const { changeInningCountOverlay } = useOverlayStore()
  const { id } = useGameStore()

  useEffect(() => {
    const eventName = `server:inning/${id}`

    const updateInningCountOverlay = (socketData: ISocketData) => {
      changeInningCountOverlay(socketData)
    }

    socket.on(eventName, updateInningCountOverlay)

    return () => {
      socket.off(eventName, updateInningCountOverlay)
    }
  }, [id])

  return (
    <motion.div
      className="bg-gradient-to-r from-[#B31942] via-[#C41E3A] to-[#B31942] py-3 relative overflow-hidden"
      style={{
        backgroundSize: '200% 200%',
        animation: 'gradientMove 15s ease infinite',
      }}
    >
      <div className="absolute inset-0 pattern-overlay" />
      <motion.div
        className="text-2xl font-bold text-center tracking-wide relative"
        animate={{ opacity: [0.8, 1, 0.8] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {inningNames[inning - 1]} INNING
      </motion.div>
    </motion.div>
  )
}
