import { AnimatePresence, motion } from 'framer-motion'

interface Props {
  children: React.ReactNode
  dataNumber?: any
}

const AnimatePopLayout = ({ dataNumber, children }: Props) => {
  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={dataNumber}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ duration: 1 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default AnimatePopLayout
