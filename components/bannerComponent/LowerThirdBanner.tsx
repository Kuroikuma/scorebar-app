"use client"
import { motion, AnimatePresence } from "framer-motion"
import type React from "react"
import { useEffect, useState } from "react"

import Classic from "./LowerThirdDesigns/Classic"
import Modern from "./LowerThirdDesigns/Modern"
import Minimal from "./LowerThirdDesigns/Minimal"
import Elegant from "./LowerThirdDesigns/Elegant"
import Playful from "./LowerThirdDesigns/Playful"
import Sports from "./LowerThirdDesigns/Sports"
import Contact from "./LowerThirdDesigns/Contact"
import FlipCard from "./LowerThirdDesigns/FlipCard"
import { ISponsor } from "@/app/types/sponsor"
import { AnimationType, EasingType, IBannerSettings, LowerThirdDesign } from "@/app/types/Banner"

interface LowerThirdBannerProps {
  sponsor: ISponsor
  settings: IBannerSettings
  isVisible?: boolean
}

// Mapeo de tipos de animación a configuraciones de Framer Motion
const animations: Record<AnimationType, any> = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideIn: {
    initial: { x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 },
  },
  zoomIn: {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 },
  },
  bounceIn: {
    initial: { y: -100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -100, opacity: 0 },
  },
  rotateIn: {
    initial: { rotate: -90, opacity: 0 },
    animate: { rotate: 0, opacity: 1 },
    exit: { rotate: 90, opacity: 0 },
  },
  slideUp: {
    initial: { y: 100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 100, opacity: 0 },
  },
  slideDown: {
    initial: { y: -100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -100, opacity: 0 },
  },
  flipIn: {
    initial: { rotateY: 90, opacity: 0, transformPerspective: 1000 },
    animate: { rotateY: 0, opacity: 1, transformPerspective: 1000 },
    exit: { rotateY: -90, opacity: 0, transformPerspective: 1000 },
  },
  expandIn: {
    initial: { scale: 0, opacity: 0, transformOrigin: "center bottom" },
    animate: { scale: 1, opacity: 1, transformOrigin: "center bottom" },
    exit: { scale: 0, opacity: 0, transformOrigin: "center bottom" },
  },
  blurIn: {
    initial: { filter: "blur(20px)", opacity: 0 },
    animate: { filter: "blur(0px)", opacity: 1 },
    exit: { filter: "blur(20px)", opacity: 0 },
  },
  flipCard: {
    initial: {
      rotateY: 90,
      opacity: 0,
      transformPerspective: 1000,
    },
    animate: {
      rotateY: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
    exit: {
      rotateY: -90,
      opacity: 0,
      transition: {
        duration: 0.5,
        ease: "easeIn",
      },
    },
  }
}

// Mapeo de tipos de easing a funciones de Framer Motion
const easingFunctions: Record<EasingType, any> = {
  linear: "linear",
  easeOut: "easeOut",
  easeIn: "easeIn",
  easeInOut: "easeInOut",
  circIn: "circIn",
  circOut: "circOut",
  circInOut: "circInOut",
  backIn: "backIn",
  backOut: "backOut",
  backInOut: "backInOut",
  anticipate: "anticipate",
  bounce: [0.175, 0.885, 0.32, 1.275], // Función personalizada para efecto de rebote
}

const designs: Record<
  LowerThirdDesign,
  React.ComponentType<{
    sponsor: ISponsor
    settings: IBannerSettings
    isAnimating: boolean
    isExiting: boolean
  }>
> = {
  classic: Classic,
  modern: Modern,
  minimal: Minimal,
  elegant: Elegant,
  playful: Playful,
  sports: Sports,
  contact: Contact,
  flipCard: FlipCard,
}

export default function LowerThirdBanner({ sponsor, settings, isVisible = true }: LowerThirdBannerProps) {
  const { animationSettings, styleSettings } = settings
  const [isAnimating, setIsAnimating] = useState(true)
  const [isExiting, setIsExiting] = useState(false)

  const bannerAnimation = animations[animationSettings.type]
  const SelectedDesign = designs[styleSettings.design]

  if (!SelectedDesign) {
    console.error(`Design "${styleSettings.design}" not found`)
    return null
  }

  // Configuración de la animación principal
  const animationConfig = {
    ...bannerAnimation,
    transition: {
      duration: animationSettings.duration,
      delay: animationSettings.delay,
      ease: easingFunctions[animationSettings.easing],
      onComplete: () => {
        // Indicar que la animación principal ha terminado
        setIsAnimating(false)
      },
    },
  }

  // Método para iniciar la animación de salida
  useEffect(() => {
    // Si el banner no está visible, iniciar la animación de salida
    if (!isVisible && !isExiting) {
      setIsExiting(true)
    } else if (isVisible && isExiting) {
      setIsExiting(false)
    }
  }, [isVisible, isExiting])

  return (
    <AnimatePresence mode="wait" onExitComplete={() => setIsExiting(false)}>
      {!isExiting && isVisible && (
        <motion.div
          key={settings._id}
          {...animationConfig}
          exit={{
            ...bannerAnimation.exit,
            transition: {
              duration: animationSettings.duration,
              ease: easingFunctions[animationSettings.easing],
              delay: 2,
            },
          }}
          aria-live="polite"
          aria-atomic="true"
          role="status"
          style={{
            transformStyle: "preserve-3d",
            perspective: "1000px",
          }}
        >
          <SelectedDesign sponsor={sponsor} settings={settings} isAnimating={isAnimating} isExiting={isExiting} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

