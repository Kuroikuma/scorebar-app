"use client"

import React, { useState, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'

interface ResizableComponentProps {
  children: React.ReactNode
  minWidth: number
  minHeight: number
  aspectRatio?: number
}

export function ResizableComponent({ children, minWidth, minHeight, aspectRatio }: ResizableComponentProps) {
  const [size, setSize] = useState({ width: minWidth, height: minHeight })
  const componentRef = useRef<HTMLDivElement>(null)
  const [onResize, setOnResize] = useState(false);

  const handleResize = useCallback((event: React.MouseEvent, corner: string) => {
    event.stopPropagation()
    event.preventDefault()
    

    const startX = event.pageX
    const startY = event.pageY
    const startWidth = size.width
    const startHeight = size.height

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.pageX - startX
      const deltaY = moveEvent.pageY - startY
      
      let newWidth = startWidth
      let newHeight = startHeight

      if (corner.includes('right')) {
        newWidth = Math.max(startWidth + deltaX, minWidth)
      } else if (corner.includes('left')) {
        newWidth = Math.max(startWidth - deltaX, minWidth)
      }

      if (corner.includes('bottom')) {
        newHeight = Math.max(startHeight + deltaY, minHeight)
      } else if (corner.includes('top')) {
        newHeight = Math.max(startHeight - deltaY, minHeight)
      }

      if (aspectRatio) {
        if (newWidth / newHeight > aspectRatio) {
          newWidth = newHeight * aspectRatio
        } else {
          newHeight = newWidth / aspectRatio
        }
      }

      setSize({ width: newWidth, height: newHeight })
    }

    const onMouseUp = () => {
      setOnResize(false)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }, [size, minWidth, minHeight, aspectRatio])

  return (
    <motion.div
      ref={componentRef}
      style={{
        width: size.width,
        height: size.height,
        position: 'relative',
      }}
      drag

      dragMomentum={false}
    >
      {children}
    </motion.div>
  )
}

