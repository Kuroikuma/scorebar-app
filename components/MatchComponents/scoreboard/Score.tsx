import { AwayScore } from './AwayScore'
import { HomeScore } from './HomeScore'

export function Score() {
  return (
    <div
      className="flex h-[50px]"
      style={{
        background: `linear-gradient(to right, rgb(32, 0, 199) 0%, rgb(14, 0, 95) 40%, rgb(14, 0, 95) 60%, rgb(32, 0, 199) 100%)`,
      }}
    >
      <HomeScore />
      <div className="flex items-center justify-center text-white px-4 text-4xl font-bold">
        <div className="bg-[#2919a6] w-[2px] h-[35px]"></div>
      </div>
      <AwayScore />
    </div>
  )
}
