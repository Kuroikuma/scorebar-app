interface ManagerPlateProps {
  name: string
  primaryColor: string
  secondaryColor: string
  textColor: string
}

export default function ManagerPlate({
  name,
  primaryColor,
  secondaryColor,
  textColor,
}: ManagerPlateProps) {
  let secondaryColorReplacement = secondaryColor ? secondaryColor : textColor
  return (
    <div className="flex w-96 items-center">
      {/* Number Container with Angular Design */}
      <div
        className="relative flex h-10 items-center skew-x-12"
        style={{ backgroundColor: secondaryColorReplacement }}
      >
        {/* Number */}
        <div
          className="px-3 text-lg uppercase font-bold -skew-x-12"
          style={{ color: primaryColor }}
        >
          Manager
        </div>
        {/* Angular Accent */}
      </div>

      {/* Name Container */}
      <div
        className="flex h-10 flex-1 items-center justify-center skew-x-12 border-r-8"
        style={{
          backgroundColor: primaryColor,
          borderRightColor: secondaryColorReplacement,
        }}
      >
        <span
          className="font-bold text-lg uppercase text-center tracking-wide text-white -skew-x-12"
          style={{ color: secondaryColorReplacement }}
        >
          {name}
        </span>
      </div>
    </div>
  )
}
