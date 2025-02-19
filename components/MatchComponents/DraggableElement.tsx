"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface DraggableElementProps {
  children: React.ReactNode
  id: string
  x: number
  y: number
  onPositionChange: (x: number, y: number) => void
  visible: boolean
}

export function DraggableElement({ children, id, x, y, onPositionChange, visible }: DraggableElementProps) {
  const constraintsRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  if (!visible) return null

  return (
    <div ref={constraintsRef} className="fixed inset-0 pointer-events-none">
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0}
        dragConstraints={constraintsRef}
        initial={{ x, y }}
        animate={{ x, y }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={(event, info) => {
          setIsDragging(false)
          onPositionChange(x + info.offset.x, y + info.offset.y)
        }}
        className={`absolute pointer-events-auto cursor-move ${isDragging ? "ring-2 ring-blue-500" : ""}`}
      >
        {children}
      </motion.div>
    </div>
  )
}

