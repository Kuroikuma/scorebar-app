import { useGameStore } from "@/app/store/gameStore"
import AnimatePopLayout from "../ui/AnimatePopLayout"

export function Strikes() {
  const { strikes } = useGameStore()

  return <AnimatePopLayout dataNumber={strikes}>{strikes}</AnimatePopLayout>
}