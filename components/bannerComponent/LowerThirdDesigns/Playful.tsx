"use client"

import { IBannerSettings } from "@/app/types/Banner"
import { ISponsor } from "@/app/types/sponsor"

interface PlayfulProps {
  sponsor: ISponsor
  settings: IBannerSettings
  isAnimating?: boolean
  isExiting?: boolean
}

export default function Playful({ sponsor, settings, isAnimating = false, isExiting = false }: PlayfulProps) {
  const { displayFields, styleSettings } = settings

  const backgroundStyle =
    styleSettings.backgroundType === "gradient"
      ? `linear-gradient(45deg, ${styleSettings.backgroundColor}, ${styleSettings.gradientColor || styleSettings.backgroundColor})`
      : styleSettings.backgroundColor

  return (
    <div
      className="rounded-3xl shadow-xl overflow-hidden transform -rotate-1"
      style={{
        background: backgroundStyle,
        fontFamily: styleSettings.fontFamily,
      }}
    >
      <div className="flex items-center p-4">
        {sponsor.logo && (
          <div className="mr-4 rounded-full overflow-hidden border-4 border-white/30 shadow-lg transform rotate-3">
            <img
              src={sponsor.logo || "/placeholder.svg?height=64&width=64"}
              alt={sponsor.name}
              className="w-16 h-16 object-contain"
            />
          </div>
        )}
        <div>
          {displayFields.map((field, index) => (
            <p
              key={field}
              className="font-bold"
              style={{
                fontSize: index === 0 ? `calc(${styleSettings.fontSize} * 1.4)` : styleSettings.fontSize,
                color: styleSettings.textColor,
                textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                transform: index % 2 === 0 ? "rotate(-1deg)" : "rotate(1deg)",
              }}
            >
              {sponsor[field]}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

