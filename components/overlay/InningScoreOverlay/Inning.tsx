import { motion } from 'framer-motion'

interface InningsProps {
  inning: number
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
