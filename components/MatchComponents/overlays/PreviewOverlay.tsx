import FenifutSVG from "../svg/Fenifut"

const PreviewOverlay = () => {
  return (
    <div
      className="relative font-['Roboto_Condensed'] w-[70vw] h-[70vh] rounded-3xl flex items-center"
      style={{
        background: `linear-gradient(to right, rgba(32, 0, 199) 0%, rgb(14, 0, 95) 40%, rgb(14, 0, 95) 60%, rgb(32, 0, 199) 100%)`,
      }}
    >
      <div className="h-[70%] w-[40%] flex flex-col">
        <div className="w-[100%] h-[80%]">
          <img src="/logoEquipo.png" alt="Logo" className="h-full w-full object-contain" />
        </div>
        <div className="text-white text-center text-2xl font-bold">
          <span className="text-white text-center text-2xl font-bold">
            SANTO DOMINGO FC
          </span>
        </div>
      </div>

      <div className="h-[100%] w-[20%] flex flex-col justify-between items-center">
        <div className="w-[100%] h-[40%]">
          <FenifutSVG height="100%" width="100%" />
        </div>
        <div className="text-white text-center text-6xl font-bold absolute top-[50%]">VS</div>
        <div className="text-white text-center text-2xl font-bold absolute top-[85%]">CAMPO SINTETICO SAN CARLOS</div>
      </div>

      <div className="h-[70%] w-[40%]">
        <div className="w-[100%] h-[80%]">
          <img src="/LogoAway.png" alt="Logo" className="h-full w-full object-contain" />
        </div>
        <div className="text-white text-center text-xl font-bold">
          TOROS DE CHONTALES FC
        </div>
      </div>
    </div>
  )
}

export default PreviewOverlay
