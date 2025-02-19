import { useTeamStore } from '@/matchStore/useTeam'
import ArrowCircleLeft from '../svg/ArrowCircleLeft'

export function HomeScore() {
  const { homeTeam } = useTeamStore()
  let isExistSecondaryColor = homeTeam.secondaryColor ? true : false
  return (
    <>
      <div className="flex flex-col h-full w-3">
        <div
          className={`${isExistSecondaryColor ? 'h-[50%]' : 'h-[100%]'} w-full`}
          style={{ background: homeTeam.primaryColor }}
        ></div>
        {isExistSecondaryColor && (
          <div
            className={`h-[50%] w-full`}
            style={{ background: homeTeam.secondaryColor }}
          ></div>
        )}
      </div>
      <div className="flex items-center p-2 pl-4 pr-8">
        <span className="font-bold text-xl">{homeTeam.name}</span>
      </div>

      <div className="flex items-center justify-center">
        <ArrowCircleLeft className="text-white" />
      </div>

      {/* Score */}
      <div className="flex items-center justify-center text-white px-6 text-3xl font-bold">
        {homeTeam.score}
      </div>
    </>
  )
}
