import { TabsContent } from '../../ui/tabs'
import { Label } from '../../ui/label'
import { Input } from '../../ui/input'
import { useMatchStore } from '@/matchStore/matchStore'
import { useFileStorage } from '@/app/hooks/useUploadFile'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'
import { MatchState } from '@/matchStore/interfaces'
import { updateMatcheService } from '@/app/service/apiMatch'
import { useCallback } from 'react'
import { debounce } from 'lodash'

export function TabMatchCustomize() {
  const { setMatch, leagueName, leagueLogo, stadiumName, matchDate, id } =
    useMatchStore()
  const { fileHandler } = useFileStorage()

  const handleLogoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]

    if (file) {
      let linkUrl = await fileHandler(file)
      setMatch({ leagueLogo: linkUrl })
    }
  }

  const debounceUpdate = useCallback(
    debounce((newValue, funtion) => {
      if (id) {
        funtion(id, newValue)
      }
    }, 1000),
    [id]
  )

  const handleUpdateDebounce = (updates: Partial<MatchState>) => {
    setMatch(updates, false)
    debounceUpdate(updates, updateMatcheService)
  }

  return (
    <TabsContent value="customize" className="p-4 space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-4">
          <div>
            <Label>Nombre de la Liga</Label>
            <Input
              value={leagueName}
              onChange={(e) => handleUpdateDebounce({ leagueName: e.target.value })}
              className="bg-[#2a2438]"
            />
          </div>
          <div>
            <Label>Nombre del Estadio</Label>
            <div className="flex gap-2">
              <Input
                value={stadiumName}
                onChange={(e) => handleUpdateDebounce({ stadiumName: e.target.value })}
                className="bg-[#2a2438] h-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Logo de la Liga</Label>
            <div className="flex gap-2 items-center">
              <Input
                type="file"
                className="hidden"
                id={`team-${0}-logo`}
                accept="image/*"
                onChange={(e) => handleLogoUpload(e)}
              />
              <Button
                variant="outline"
                className="bg-[#2d2b3b] hover:bg-[#363447] hover:text-white border-0 text-white"
                onClick={() =>
                  document.getElementById(`team-${0}-logo`)?.click()
                }
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Logo
              </Button>
              {leagueLogo && (
                <div className="relative w-10 h-10">
                  <img
                    src={leagueLogo}
                    alt={`${leagueName} logo`}
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="matchDate">Fecha del Partido</Label>
            <Input
              id="matchDate"
              type="date"
              value={matchDate}
              onChange={(e) => setMatch({ matchDate: e.target.value })}
              className="bg-[#2a2438] text-white"
            />
          </div>
        </div>
      </div>
    </TabsContent>
  )
}
