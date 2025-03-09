"use client"
import { IBannerSettings } from "@/app/types/Banner"
import { ISponsor } from "@/app/types/sponsor"
import { motion } from "framer-motion"

interface SportsProps {
  sponsor: ISponsor
  settings: IBannerSettings
  isAnimating?: boolean
  isExiting?: boolean
}

export default function Sports({ sponsor, settings, isAnimating = false, isExiting = false }: SportsProps) {
  const { displayFields, styleSettings } = settings

  // Usar colores personalizados o los predeterminados
  const primaryColor = styleSettings.backgroundColor || "#FF69B4"
  const accentColor = styleSettings.textColor || "#39FF14"

  return (
    <div className="relative">
      {/* Main container */}
      <div className="flex items-start">
        {/* Logo container */}
        <motion.div
          className="bg-white rounded-lg overflow-hidden z-10 shadow-lg"
          style={{ width: "56px", height: "56px" }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: isExiting ? 0 : 1, opacity: isExiting ? 0 : 1 }}
          transition={{ duration: 0.3, ease: isExiting ? "easeIn" : "easeOut" }}
        >
          {sponsor.logo && (
            <img
              src={sponsor.logo || "/placeholder.svg?height=64&width=64"}
              alt={sponsor.name}
              className="w-full h-full object-cover"
            />
          )}
        </motion.div>

        {/* Content container */}
        <motion.div
          className="relative ml-[-8px]"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: isExiting ? -50 : 0, opacity: isExiting ? 0 : 1 }}
          transition={{ duration: 0.3, delay: isExiting ? 0 : 0.1, ease: isExiting ? "easeIn" : "easeOut" }}
        >
          {/* Background with diagonal cut */}
          <div
            className="relative"
            style={{ backgroundColor: primaryColor, paddingLeft: "1rem", paddingRight: "4rem" }}
          >
            {/* Top text */}
            <motion.div
              className="pt-1"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <p className="text-sm font-bold" style={{ color: accentColor }}>
                GAME TONIGHT 7:30PM EST
              </p>
            </motion.div>

            {/* Main text */}
            <motion.div
              className="pb-1"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <p className="text-white text-xl font-black tracking-wide">{sponsor.name.toUpperCase()}</p>
              {displayFields
                .filter((field) => field !== "name")
                .map((field, index) => (
                  <motion.p
                    key={field}
                    className="text-white text-sm font-bold"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 + 0.1 * index }}
                  >
                    {sponsor[field]}
                  </motion.p>
                ))}
            </motion.div>

            {/* Diagonal cut overlay */}
            <div
              className="absolute top-0 right-0 h-full w-16"
              style={{
                backgroundColor: primaryColor,
                clipPath: "polygon(100% 0, 0 0, 100% 100%)",
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Animated accent line */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 rounded-full"
        style={{ backgroundColor: accentColor }}
        initial={{ width: 0 }}
        animate={{ width: isExiting ? 0 : "100%" }}
        transition={{
          duration: 0.5,
          delay: isExiting ? 0 : 0.4,
          ease: isExiting ? "easeIn" : "easeOut",
        }}
      />
    </div>
  )
}

