'use client'

import { ChangeEvent, useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  FormationFootball,
  TeamFootball,
  TeamRole,
} from '@/matchStore/interfaces'
import { useTeamStore } from '@/matchStore/useTeam'
import { defaultFormation } from '@/app/lib/defaultFormation'
import { debounce } from 'lodash'
import {
  updateTeamNameService,
  updateTeamService,
} from '@/app/service/apiMatch'
import { useMatchStore } from '@/matchStore/matchStore'
import { useFileStorage } from '@/app/hooks/useUploadFile'
import { Upload } from 'lucide-react'

export function TabTeamSetup() {
  const {
    homeTeam,
    awayTeam,
    addPlayer,
    updateStaff,
    updateFormation,
    updateTeam,
  } = useTeamStore()

  const { id } = useMatchStore()

  const [selectedTeam, setSelectedTeam] = useState<TeamRole>('home')
  const [playerName, setPlayerName] = useState('')
  const [playerNumber, setPlayerNumber] = useState('')
  const [playerPosition, setPlayerPosition] = useState('')
  const [playerImage, setPlayerImage] = useState('')

  const { fileHandler } = useFileStorage()

  const team = selectedTeam === 'home' ? homeTeam : awayTeam

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault()
    if (!playerName || !playerNumber || !playerPosition) return

    addPlayer(selectedTeam, {
      name: playerName,
      number: Number.parseInt(playerNumber),
      position: playerPosition,
      image: playerImage,
    })

    setPlayerName('')
    setPlayerNumber('')
    setPlayerPosition('')
    setPlayerImage('')
  }

  const debounceUpdate = useCallback(
    debounce((newValue, teamRole, funtion) => {
      if (id) {
        funtion(id, newValue, teamRole)
      }
    }, 1000),
    [id]
  )

  const handleName = (e: ChangeEvent<HTMLInputElement>) => {
    let newName = e.target.value
    updateTeam(selectedTeam, { name: newName })
    debounceUpdate(newName, selectedTeam, updateTeamNameService)
  }

  const handleUpdateTeamDebounce = (updates: Partial<TeamFootball>) => {
    updateTeam(selectedTeam, updates)
    debounceUpdate(updates, selectedTeam, updateTeamService)
  }

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      let linkUrl = await fileHandler(file)
      updateTeam(selectedTeam, { logo: linkUrl })
      await updateTeamService(id!, { logo: linkUrl }, selectedTeam)
    }
  }

  return (
    <TabsContent value="team-setup" className="p-4 space-y-4">
      <div className="space-y-4">
        <div>
          <Label>Team</Label>
          <Select
            value={selectedTeam}
            onValueChange={(value: TeamRole) => setSelectedTeam(value)}
          >
            <SelectTrigger className="bg-[#2a2438]">
              <SelectValue placeholder="Select team" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="home">{homeTeam.name}</SelectItem>
              <SelectItem value="away">{awayTeam.name}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="players">
          <TabsList className="w-full justify-start bg-transparent border-b rounded-none h-12">
            <TabsTrigger value="players" className="tab_panel">
              Players
            </TabsTrigger>
            <TabsTrigger value="staff" className="tab_panel">
              Staff
            </TabsTrigger>
            <TabsTrigger value="formation" className="tab_panel">
              Formation
            </TabsTrigger>

            <TabsTrigger value="customize" className="tab_panel">
              Customize
            </TabsTrigger>
          </TabsList>

          <TabsContent value="players" className="space-y-4">
            <form onSubmit={handleAddPlayer} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="bg-[#2a2438]"
                  />
                </div>
                <div>
                  <Label>Number</Label>
                  <Input
                    type="number"
                    value={playerNumber}
                    onChange={(e) => setPlayerNumber(e.target.value)}
                    className="bg-[#2a2438]"
                  />
                </div>
                <div>
                  <Label>Position</Label>
                  <Select
                    value={playerPosition}
                    onValueChange={setPlayerPosition}
                  >
                    <SelectTrigger className="bg-[#2a2438]">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      {team.formation.positions.map(
                        (position) =>
                          !position.assigned && (
                            <SelectItem
                              key={position.name}
                              value={position.name}
                            >
                              {position.name}
                            </SelectItem>
                          )
                      )}
                      <SelectItem value="SUP">SUP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Image URL</Label>
                  <Input
                    value={playerImage}
                    onChange={(e) => setPlayerImage(e.target.value)}
                    className="bg-[#2a2438]"
                    placeholder="Enter image URL"
                  />
                </div>
              </div>
              <Button
                className="w-full bg-[#ff5722] hover:bg-[#ff5722]/90"
                type="submit"
              >
                Add Player
              </Button>
            </form>

            <div className="space-y-2 flex flex-col justify-center">
              <Label className="text-center">Squad List</Label>
              <div className="grid grid-cols-1 gap-2">
                {team.players.map((player) => (
                  <div
                    key={player.id}
                    className="flex justify-between items-center p-2 bg-[#2a2438] rounded"
                  >
                    <div className="flex items-center gap-2">
                      {player.image && (
                        <img
                          src={player.image || '/placeholder.svg'}
                          alt={player.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                      <span>
                        #{player.number} {player.name}
                      </span>
                    </div>
                    <span>{player.position}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="staff" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>Manager</Label>
                <Input
                  value={team.staff.manager}
                  onChange={(e) =>
                    updateStaff(selectedTeam, { manager: e.target.value })
                  }
                  className="bg-[#2a2438]"
                />
              </div>
              <div>
                <Label>Assistant Manager</Label>
                <Input
                  value={team.staff.assistantManager}
                  onChange={(e) =>
                    updateStaff(selectedTeam, {
                      assistantManager: e.target.value,
                    })
                  }
                  className="bg-[#2a2438]"
                />
              </div>
              <div>
                <Label>Physio</Label>
                <Input
                  value={team.staff.physio}
                  onChange={(e) =>
                    updateStaff(selectedTeam, { physio: e.target.value })
                  }
                  className="bg-[#2a2438]"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="formation" className="space-y-4">
            <div>
              <Label>Formation</Label>
              <Select
                value={team.formation.name}
                onValueChange={(value) =>
                  updateFormation(selectedTeam, {
                    name: value,
                    positions: (
                      defaultFormation.find(
                        (f) => f.name === value
                      ) as FormationFootball
                    ).positions,
                  })
                }
              >
                <SelectTrigger className="bg-[#2a2438]">
                  <SelectValue placeholder="Select formation" />
                </SelectTrigger>
                <SelectContent>
                  {defaultFormation.map((formation) => (
                    <SelectItem key={formation.name} value={formation.name}>
                      {formation.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="customize" className="p-4 space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-4">
                <div>
                  <Label>Team Name</Label>
                  <Input
                    value={team.name}
                    onChange={handleName}
                    className="bg-[#2a2438]"
                  />
                </div>
                <div>
                  <Label htmlFor="shortName">Short Name</Label>
                  <Input
                    id="shortName"
                    value={team.shortName}
                    onChange={(e) =>
                      handleUpdateTeamDebounce({ shortName: e.target.value })
                    }
                    className="bg-[#2a2438]"
                  />
                </div>
                <div>
                  <Label>Text Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={team.textColor}
                      onChange={(e) =>
                        handleUpdateTeamDebounce({ textColor: e.target.value })
                      }
                      className="bg-[#2a2438] h-10"
                    />
                    <Input
                      value={team.textColor}
                      onChange={(e) =>
                        handleUpdateTeamDebounce({ textColor: e.target.value })
                      }
                      className="bg-[#2a2438]"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="primaryColor">Primary Jersey Color</Label>
                  <Input
                    id="primaryColor"
                    type="color"
                    value={team.primaryColor}
                    onChange={(e) =>
                      handleUpdateTeamDebounce({ primaryColor: e.target.value })
                    }
                    className="bg-[#2a2438]"
                  />
                </div>
                <div>
                  <Label htmlFor="secondaryColor">Secondary Jersey Color</Label>
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={team.secondaryColor}
                    onChange={(e) =>
                      handleUpdateTeamDebounce({
                        secondaryColor: e.target.value,
                      })
                    }
                    className="bg-[#2a2438]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">
                    Logo
                  </Label>
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
                    {team.logo && (
                      <div className="relative w-10 h-10">
                        <img
                          src={team.logo}
                          alt={`${team.name} logo`}
                          style={{ objectFit: 'contain' }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TabsContent>
  )
}
