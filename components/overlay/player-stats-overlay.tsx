'use client'

import usePlayer from '@/app/hooks/usePlayer'
import { useGameStore } from '@/app/store/gameStore'
import { Player } from '@/app/store/teamsStore'
import { motion } from 'framer-motion'
import { Diamond } from 'lucide-react'

interface PlayerOverlayProps {
  visible: boolean
}

export const PlayerOverlay = ({ visible }: PlayerOverlayProps) => {
  return (
    <div className="w-full flex justify-center">
      <PlayerStatsOverlay />
    </div>
  )
}

export function PlayerStatsOverlay() {
  const { inning } = useGameStore()

  const {
    position,
    number,
    name,
    battingOrder,
    turnsAtBat,
    defensiveOrder,
    totalTurnsAtBat,
    numberOfHits,
    logo,
  } = usePlayer()

  let totalInnings = Array.from({ length: 9 }, (_, i) => i + 1)

  return (
    <>
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
          100% {
            opacity: 1;
          }
        }

        .stat-shimmer {
          animation: shimmer 2s infinite;
        }

        .glass-effect {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(5px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-[80%] relative"
      >
        <div
          className="h-[100px] relative flex overflow-hidden rounded-lg"
          style={{
            background: 'linear-gradient(90deg, rgba(1,47,85,1) 0%, rgba(0,0,0,1) 100%)',
            // background: 'linear-gradient(90deg, rgba(245,10,10,1) 0%, rgba(0,0,255,1) 100%)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
          }}
        >
          {/* Background Effect */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 60%)',
            }}
          />

          {/* Left Section - Team Logo and Player Info */}

          <div className="h-full flex items-center">
            <div className="h-[100px] w-[100px] flex items-center">
              <div
                className="text-[40px] font-bold text-white"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
              >
                <img
                  src={logo}
                  alt={`logo`}
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </div>

            <div style={{borderColor: "#335b7b", backgroundColor:"#0a2e4b"}} className="flex flex-col items-center justify-center border-x-[2px] px-2 h-full text-white">
              <span className="text-2xl">{position}</span>
              <span className="text-2xl">{number}</span>
            </div>

            <div className="px-4 text-white">
              <div className="flex flex-col items-start justify-center">
                <span className="text-3xl tracking-wider">
                  {name.split(' ')[0]?.toUpperCase()}
                </span>
                <span className="text-3xl font-bold tracking-wider">
                  {name.split(' ').pop()?.toUpperCase()}
                </span>
              </div>
            </div>
            {/* Inning Indicator */}
            <div className="relative flex items-center justify-center">
              <Diamond className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              <span className="absolute text-[10px] font-bold">
                {battingOrder}
              </span>
            </div>
          </div>

          {/* Performance Indicators */}
          <div className="flex flex-col items-start justify-center gap-1">
            <motion.div
              className="text-yellow-400 text-sm font-bold stat-shimmer"
              animate={{ opacity: [1, 0.8, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {numberOfHits} FOR {totalTurnsAtBat}
            </motion.div>

            <div className="flex items-center gap-1">
              {totalInnings.map((item, index) => (
                <motion.div
                  key={`indicator-${item}`}
                  className="relative flex items-center justify-center"
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <Diamond
                    className={`w-8 h-8 ${
                      item ? 'text-white/40' : 'text-white/30'
                    }`}
                  />
                  {item && (
                    <span className="absolute text-[10px] font-bold text-white/70">
                      1B
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Decorative Elements */}
          <div
            className="absolute right-0 top-0 h-full w-[200px]"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(255,255,255,0.05))',
            }}
          />
        </div>
      </motion.div>
    </>
  )
}
