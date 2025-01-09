import { Team } from '@/app/store/teamsStore'
import { motion } from 'framer-motion'

interface LogoProps {
  team: Team
}

export function Logo({ team }: LogoProps) {
  return (
    <div className="bg-gradient-to-br from-white to-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 pattern-overlay" />
      <motion.div
        className="relative"
        whileHover={{ scale: 1.1 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <div
          className="text-7xl font-bold relative"
          style={{
            background: 'linear-gradient(45deg, #C8AA37, #FFD700)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <img src={team.logo} alt="" />
        </div>
      </motion.div>
    </div>
  )
}
