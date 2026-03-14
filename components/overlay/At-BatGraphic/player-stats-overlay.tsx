'use client'

import usePlayer from '@/app/hooks/usePlayer'
import { AnimatePresence, motion } from 'framer-motion'
import { Diamond } from 'lucide-react'

interface PlayerOverlayProps {
  visible: boolean
}

export const PlayerOverlay = ({ visible }: PlayerOverlayProps) => {

  return (
    <div className="w-full flex justify-center">
      <AnimatePresence initial={false}>
        {visible ? <PlayerStatsOverlay /> : null}
      </AnimatePresence>
    </div>
  )
}

export function PlayerStatsOverlay() {

  const {
    position,
    number,
    name,
    battingOrder,
    turnsAtBat,
    totalTurnsAtBat,
    numberOfHits,
    logo,
  } = usePlayer()

  let totalInnings = Array.from({ length: 9 }, (_, i) => i + 1)
  const adjustIndex = (index: number, total: number) => (index + total) % total

  const totalPlayers = 9

  const anteriorBattingOrder = adjustIndex(battingOrder - 1, totalPlayers)
  const posteriorBattingOrder = adjustIndex(battingOrder + 1, totalPlayers)
  const anteriorDelAnteriorBattingOrder = adjustIndex(
    battingOrder - 2,
    totalPlayers
  )
  const posteriorDelPosteriorBattingOrder = adjustIndex(
    battingOrder + 2,
    totalPlayers
  )

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
          className="h-[100px] relative flex overflow-hidden rounded-lg border-x-[5px] border-b-[5px]"
          style={{
            background:
              'linear-gradient(90deg, rgba(1,47,85,1) 0%, rgba(0,0,0,1) 100%)',
            // background: 'linear-gradient(90deg, rgba(245,10,10,1) 0%, rgba(0,0,255,1) 100%)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)', borderColor: '#e9ede5'
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
                <img src={logo} alt={`logo`} style={{ objectFit: 'contain' }} />
              </div>
            </div>

            

            <div style={{ borderColor: '#335b7b' }} className="px-4 text-white border-l-[2px] h-full flex items-center">
              <div className="flex flex-col items-start justify-center">
                <span className="text-3xl tracking-wider">
                  {name.split(' ')[0]?.toUpperCase()}
                </span>
                <span className="text-3xl font-bold tracking-wider">
                  {name.split(' ').pop()?.toUpperCase()}
                </span>
              </div>
            </div>
            <div
              style={{ borderColor: '#335b7b', backgroundColor: '#0a2e4b' }}
              className="flex flex-col items-center justify-center border-x-[2px] px-2 h-full text-white"
            >
              <span className="text-2xl leading-6">{position}</span>
              <span className="text-2xl font-bold leading-6">{number}</span>
            </div>
            {/* Inning Indicator */}
            <div
              style={{ borderColor: '#335b7b' }}
              className="flex flex-col items-center justify-center border-r-[2px] h-full pr-1 pl-1"
            >
              {[
                anteriorDelAnteriorBattingOrder,
                anteriorBattingOrder,
                battingOrder,
                posteriorBattingOrder,
                posteriorDelPosteriorBattingOrder,
              ].map((order, index) => (
                <span
                  key={index}
                  className={`text-[${index === 2 ? '16px' : '12px'}] ${
                    index === 2 ? 'text-white font-bold' : 'text-slate-400'
                  }`}
                >
                  {order}
                </span>
              ))}
            </div>
          </div>

          {/* Performance Indicators */}
          <div className="flex flex-col items-start justify-center gap-1 pl-6">
            <motion.div
              className="text-white text-sm font-bold stat-shimmer"
              animate={{ opacity: [1, 0.8, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {numberOfHits} FOR {totalTurnsAtBat}
            </motion.div>

            <div className="flex items-center gap-1">
              {totalInnings.map((item, index) => {
                const turnAtBat = turnsAtBat.find((turn) => turn.inning === item)
                return (
                  <motion.div
                    key={`indicator-${item}`}
                    className="relative flex items-center justify-center"
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    <Diamond
                      className={`w-14 h-14 ${
                        turnAtBat
                          ? 'text-yellow-400'
                          : 'text-white/30'
                      }`}
                    />
                    {item && (
                      <>
                        <span className="absolute text-[18px] font-bold text-white/70">
                          {turnAtBat ? turnAtBat.typeAbbreviatedBatting : ''}
                        </span>
                        <span className='absolute top-0 left-0 text-[14px] font-bold text-white/70'>
                          {item}
                        </span>
                      </>
                    )}
                  </motion.div>
                )
              })}
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
