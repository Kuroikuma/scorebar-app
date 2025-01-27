interface TeamLogoProps {
  logo: string | undefined
  name: string
}

const TeamLogo = ({ logo, name }: TeamLogoProps) => {
  return (
    logo && (
      <div className="relative w-[60px] h-[60px]">
        <img src={logo} alt={`${name} logo`} style={{ objectFit: 'contain' }} />
      </div>
    )
  )
}

export default TeamLogo
