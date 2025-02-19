import { TabsContent } from '@/components/ui/tabs'
import CustomizeOverlays from '../CustomizeOverlays'

const TabsOverlays = () => {
  return (
    <TabsContent value="overlays" className="p-4 space-y-4">
      <CustomizeOverlays />
    </TabsContent>
  )
}

export default TabsOverlays
