import { useState } from 'react'
import { TabsContent } from '../../ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'
import { Label } from '../../ui/label'
import { Input } from '../../ui/input'
import { useTeamStore } from '@/matchStore/useTeam'
import { TeamRole } from '@/matchStore/interfaces'

export function TabTeamCustomize() {
  const { homeTeam, awayTeam, updateTeam } = useTeamStore()

  const [selectedTeam, setSelectedTeam] = useState<TeamRole>('home')

  const team = selectedTeam === 'home' ? homeTeam : awayTeam
  return (
    <TabsContent value="customize" className="p-4 space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-4">
          <div>
            <Label>Team Name</Label>
            <Select
              value={selectedTeam}
              onValueChange={(value: TeamRole) => setSelectedTeam(value)}
            >
              <SelectTrigger className="bg-[#2a2438]">
                <SelectValue placeholder="Select team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="home">Local</SelectItem>
                <SelectItem value="away">Visitante</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Team Name</Label>
            <Input
              value={team.name}
              onChange={(e) =>
                updateTeam(selectedTeam, { name: e.target.value })
              }
              className="bg-[#2a2438]"
            />
          </div>
          <div>
            <Label>Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={team.color}
                onChange={(e) =>
                  updateTeam(selectedTeam, { color: e.target.value })
                }
                className="bg-[#2a2438] h-10"
              />
              <Input
                value={team.color}
                onChange={(e) =>
                  updateTeam(selectedTeam, { color: e.target.value })
                }
                className="bg-[#2a2438]"
              />
            </div>
          </div>
          <div>
            <Label>Text Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={team.textColor}
                onChange={(e) =>
                  updateTeam(selectedTeam, { textColor: e.target.value })
                }
                className="bg-[#2a2438] h-10"
              />
              <Input
                value={team.textColor}
                onChange={(e) =>
                  updateTeam(selectedTeam, { textColor: e.target.value })
                }
                className="bg-[#2a2438]"
              />
            </div>
          </div>
          <div>
            <Label>Logo URL</Label>
            <Input
              value={team.logo}
              onChange={(e) =>
                updateTeam(selectedTeam, { logo: e.target.value })
              }
              className="bg-[#2a2438]"
              placeholder="Enter logo URL"
            />
          </div>
          <div>
            <Label>Logo Fit</Label>
            <Select
              value={team.logoFit}
              onValueChange={(value: 'contain' | 'cover') =>
                updateTeam(selectedTeam, { logoFit: value })
              }
            >
              <SelectTrigger className="bg-[#2a2438]">
                <SelectValue placeholder="Select logo fit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contain">Contain</SelectItem>
                <SelectItem value="cover">Cover</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </TabsContent>
  )
}
