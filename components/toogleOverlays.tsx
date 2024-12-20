import { toogleVisibleOverlay } from '@/service/apiOverlays'
import { Toggle } from './ui/toggle'
import { useConfigStore } from '@/store/configStore'

export const ToggleOverlays = () => {

  const { currentConfig } = useConfigStore()

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

  return (
    <div className='flex gap-2 w-full justify-center  max-[768px]:pt-2 min-[768px]:pb-2'>
      <Toggle
        onPressedChange={toogleVisibleScorebug}
        className="data-[state=on]:bg-[#4C3F82] data-[state=on]:text-white bg-[#1a1625] text-neutral-500"
        aria-label="Toggle bold"
      >
        Marcador
      </Toggle>
      <Toggle
        onPressedChange={toogleVisibleScoreboard}
        className="data-[state=on]:bg-[#4C3F82] data-[state=on]:text-white bg-[#1a1625] text-neutral-500"
        aria-label="Toggle bold"
      >
        Tabla
      </Toggle>
      <Toggle
        onPressedChange={toogleVisibleScoreboardMini}
        className="data-[state=on]:bg-[#4C3F82] data-[state=on]:text-white bg-[#1a1625] text-neutral-500"
        aria-label="Toggle bold"
      >
        Marcador mini
      </Toggle>
    </div>
  )
}
