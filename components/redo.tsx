import { useHistoryStore } from '@/app/store/historiStore'
import { Button } from './ui/button'

const Redo = () => {
  const { future } = useHistoryStore.getState()

  return (
    <Button
      onClick={() => useHistoryStore.getState().redo()}
      variant="outline"
      disabled={future.length === 0}
      className={
        future.length === 0
          ? 'bg-[#4c3f82] hover:bg-[#5a4b99] opacity-50'
          : 'bg-[#4c3f82] hover:bg-[#5a4b99]'
      }
    >
    Rehaser
    </Button>
  )
}

export default Redo
