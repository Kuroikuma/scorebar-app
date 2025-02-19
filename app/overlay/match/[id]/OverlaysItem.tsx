import { IOverlays,} from '@/matchStore/interfaces'
import { ScoreboardOverlay } from '@/components/MatchComponents/overlays/ScoreboardOverlay'
import { FormationOverlay } from '@/components/MatchComponents/overlays/FormationOverlay'
import ScoreBoardDown from '@/components/MatchComponents/overlays/ScoreBoardOverlayDown'
import PreviewOverlay from '@/components/MatchComponents/overlays/PreviewOverlay'
import { useSocketHandleOverlays } from '@/app/hooks/useSocketHandleOverlays'
import GoalsDownOverlay from '@/components/MatchComponents/overlays/GoalsDownOverlay'

interface IOverlaysItemProps {
  item: IOverlays
  gameId: string
}

export const OverlaysItem = ({ item, gameId }: IOverlaysItemProps) => {
  useSocketHandleOverlays(item)

  return item.id === 'scoreboardUp' ? (
    <ScoreboardOverlay item={item} />
  ) : item.id === 'formationA' ? (
    <FormationOverlay overlayId="formationA" visible={item.visible} />
  ) : item.id === 'scoreboardDown' ? (
    <ScoreBoardDown item={item} />
  ) : item.id === 'preview' ? (
    <PreviewOverlay item={item} />
  ) : item.id === 'formationB' ? (
    <FormationOverlay overlayId="formationB" visible={item.visible} />
  ) : (
    <GoalsDownOverlay />
  )
}
