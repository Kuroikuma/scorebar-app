"use client"

import { IBannerSettings } from "@/app/types/Banner"
import { ISponsor } from "@/app/types/sponsor"

interface MinimalProps {
  sponsor: ISponsor
  settings: IBannerSettings
  isAnimating?: boolean
  isExiting?: boolean
}

export default function Minimal({ sponsor, settings, isAnimating = false, isExiting = false }: MinimalProps) {
  const { displayFields, styleSettings } = settings

  return (
    <div
      className="bg-transparent"
      style={{
        fontFamily: styleSettings.fontFamily,
      }}
    >
      <div className="flex items-center">
        {displayFields.filter((field) => field !== 'logo').map((field, index) => (
          <p
            key={field}
            className={`mr-4 ${index === 0 ? "font-semibold" : "font-normal"}`}
            style={{
              fontSize: index === 0 ? `calc(${styleSettings.fontSize} * 1.1)` : styleSettings.fontSize,
              color: styleSettings.textColor,
              textShadow: "0 1px 2px rgba(0,0,0,0.3)",
            }}
          >
            {sponsor[field]}
            {index < displayFields.length - 1 && <span className="ml-4 opacity-50">•</span>}
          </p>
        ))}
      </div>
    </div>
  )
}

