import { useHistoryStore } from '@/app/store/historiStore'
import { Button } from './ui/button'
import { Undo2Icon } from 'lucide-react'

const Undo = () => {
  const { past } = useHistoryStore.getState()

  return (
    <Button
      onClick={() => useHistoryStore.getState().undo()}
      variant="outline"
      disabled={past.length === 0}
      className={
        past.length === 0
          ? 'bg-[#4c3f82] hover:bg-[#5a4b99] opacity-50'
          : 'bg-[#4c3f82] hover:bg-[#5a4b99]'
      }
    >
    Deshaser
    </Button>
  )
}

export default Undo
