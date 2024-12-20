import { toogleVisibleOverlay } from '@/service/apiOverlays'
import { Toggle } from './ui/toggle'
import { useConfigStore } from '@/store/configStore'
import { useState } from 'react'

export const ToggleOverlays = () => {

  const { currentConfig } = useConfigStore()

  const [visibleFormationA, setVisibleFormationA] = useState(false);
  const [visibleFormationB, setVisibleFormationB] = useState(false);

  const toogleVisibleScorebug = (e:boolean) => {
    const overlayId = currentConfig?.scorebug.overlayId || ''
    const modelId = currentConfig?.scorebug.modelId || ''
    toogleVisibleOverlay(overlayId, modelId, e ? 'ShowOverlay' : 'HideOverlay')
  }

  const toogleVisibleScoreboard = (e:boolean) => {
    const overlayId = currentConfig?.scoreboard.overlayId || ''
    const modelId = currentConfig?.scoreboard.modelId || ''
    toogleVisibleOverlay(overlayId, modelId, e ? 'ShowOverlay' : 'HideOverlay')
  }

  const toogleVisibleScoreboardMini = (e:boolean) => {
    const overlayId = currentConfig?.scoreboardMinimal.overlayId || ''
    const modelId = currentConfig?.scoreboardMinimal.modelId || ''
    toogleVisibleOverlay(overlayId, modelId, e ? 'ShowOverlay' : 'HideOverlay')
  }

  const toogleVisibleFormationA = async (e:boolean) => {
    setVisibleFormationA(e)
    setVisibleFormationB(false)
    const overlayId = currentConfig?.formation.overlayId || ''
    const modelId = currentConfig?.formation.modelId || ''
    await toogleVisibleOverlay(overlayId, modelId, e ? 'TakeOverlayFirstSlot' : 'HideOverlay')
    e && toogleVisibleOverlay(overlayId, modelId, 'ShowOverlay')
  }

  const toogleVisibleFormationB = async (e:boolean) => {
    setVisibleFormationB(e)
    setVisibleFormationA(false)
    const overlayId = currentConfig?.formation.overlayId || ''
    const modelId = currentConfig?.formation.modelId || ''
    await toogleVisibleOverlay(overlayId, modelId, e ? 'TakeOverlayLastSlot' : 'HideOverlay')
    e && toogleVisibleOverlay(overlayId, modelId, 'ShowOverlay')
  }

  return (
    <div className='flex gap-2 w-full justify-center  max-[768px]:pt-2 min-[768px]:pb-2'>
      <Toggle
        onPressedChange={toogleVisibleScorebug}
        className="data-[state=on]:bg-[#4C3F82] data-[state=on]:text-white bg-[#1a1625] text-neutral-500"
        aria-label="Toggle bold"
      >
        Marc.
      </Toggle>
      <Toggle
        onPressedChange={toogleVisibleScoreboard}
        className="data-[state=on]:bg-[#4C3F82] data-[state=on]:text-white bg-[#1a1625] text-neutral-500"
        aria-label="Toggle bold"
      >
        M. x Inn.
      </Toggle>
      <Toggle
        onPressedChange={toogleVisibleScoreboardMini}
        className="data-[state=on]:bg-[#4C3F82] data-[state=on]:text-white bg-[#1a1625] text-neutral-500"
        aria-label="Toggle bold"
      >
        Marc. Min
      </Toggle>
      <Toggle
        pressed={visibleFormationA}
        onPressedChange={toogleVisibleFormationA}
        className="data-[state=on]:bg-[#4C3F82] data-[state=on]:text-white bg-[#1a1625] text-neutral-500"
        aria-label="Toggle bold"
      >
        Eq. A
      </Toggle>
      <Toggle
        pressed={visibleFormationB}
        onPressedChange={toogleVisibleFormationB}
        className="data-[state=on]:bg-[#4C3F82] data-[state=on]:text-white bg-[#1a1625] text-neutral-500"
        aria-label="Toggle bold"
      >
        Eq. B
      </Toggle>
    </div>
  )
}
