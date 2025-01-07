interface TeamNameProps {
  name: string
}

const TeamName = ({ name }: TeamNameProps) => {
  return (
    <div className="py-3">
      <span className="text-3xl font-bold tracking-wider">{name}</span>
    </div>
  )
}

export default TeamName
