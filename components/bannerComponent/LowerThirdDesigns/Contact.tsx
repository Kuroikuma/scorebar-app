"use client"
import { Mail } from "lucide-react"
import { motion } from "framer-motion"
import type { ISponsor, SponsorBanner } from "@/app/types/sponsor"
import { IBannerSettings } from "@/app/types/Banner"

interface ContactProps {
  sponsor: ISponsor
  settings: IBannerSettings
  isAnimating?: boolean
  isExiting?: boolean
}

export default function Contact({ sponsor, settings, isAnimating = false, isExiting = false }: ContactProps) {
  const { displayFields, styleSettings } = settings

  // Usar colores personalizados o los predeterminados
  const primaryColor = styleSettings.backgroundColor || "#007bff"
  const secondaryColor = styleSettings.gradientColor || "rgba(0, 0, 0, 0.4)"

  return (
    <div className="relative">
      <div className="flex items-center">
        {/* Icon container */}
        <motion.div
          className="relative z-10"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: isExiting ? 0 : 1, opacity: isExiting ? 0 : 1 }}
          transition={{ duration: 0.3, ease: isExiting ? "easeIn" : "easeOut" }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
            style={{ backgroundColor: primaryColor }}
          >
            <Mail className="w-6 h-6 text-white" />
          </div>

          {/* Efecto de resplandor */}
          <div
            className="absolute inset-0 rounded-full blur-md -z-10"
            style={{
              backgroundColor: primaryColor,
              opacity: 0.5,
              transform: "scale(1.2)",
            }}
          ></div>
        </motion.div>

        {/* Content container */}
        <div className="ml-[-8px]">
          {/* Email container */}
          <motion.div
            className="text-white px-6 py-1 rounded-r-full shadow-md"
            style={{ backgroundColor: primaryColor }}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: isExiting ? -50 : 0, opacity: isExiting ? 0 : 1 }}
            transition={{ duration: 0.3, delay: isExiting ? 0 : 0.1, ease: isExiting ? "easeIn" : "easeOut" }}
          >
            <p className="text-sm font-medium tracking-wide">{sponsor.email}</p>
          </motion.div>

          {/* Name container */}
          <motion.div
            className="backdrop-blur-sm px-6 py-1 rounded-r-full mt-1"
            style={{ backgroundColor: secondaryColor }}
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: isExiting ? -30 : 0, opacity: isExiting ? 0 : 1 }}
            transition={{ duration: 0.3, delay: isExiting ? 0 : 0.2, ease: isExiting ? "easeIn" : "easeOut" }}
          >
            <p className="text-white/90 text-sm font-medium">{sponsor.name}</p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

