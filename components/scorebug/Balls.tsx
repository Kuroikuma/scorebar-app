import { useGameStore } from "@/app/store/gameStore"
import AnimatePopLayout from "../ui/AnimatePopLayout"

export function Balls() {
  const { balls } = useGameStore()

  return <AnimatePopLayout dataNumber={balls}>{balls}</AnimatePopLayout>
}