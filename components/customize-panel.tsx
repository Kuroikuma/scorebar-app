"use client"

import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Minus, Plus } from 'lucide-react'
import Image from 'next/image'
import { useUIStore } from "@/app/store/uiStore"
import { Team, useTeamsStore } from "@/app/store/teamsStore"
import { useCallback } from "react"
import debounce from "lodash/debounce";
import { changeTeamColorService, changeTeamNameService, changeTeamShortNameService, changeTeamTextColorService, updateGameService } from "@/app/service/api"
import { useGameStore } from "@/app/store/gameStore"
import { useFileStorage } from "@/app/hooks/useUploadFile"

export function CustomizePanel() {

  const { teams, setTeams, changeTeamName, changeTeamColor, changeTeamTextColor, gameId, changeTeamShortName } = useTeamsStore()
  const { 
    primaryColor, setPrimaryColor,
    primaryTextColor, setPrimaryTextColor,
    accentColor, setAccentColor,
    horizontalPosition, setHorizontalPosition,
    verticalPosition, setVerticalPosition
  } = useUIStore()

  const { fileHandler } = useFileStorage()

  

  const updateTeam = async (index: number, updates: Partial<Team>) => {
    setTeams(
      teams.map((team, i) => (i === index ? { ...team, ...updates } : team))
    )

    await useGameStore.getState().updateGame()
  }

  const debounceUpdate = useCallback(
    debounce((newValue, teamIndex, funtion) => {
      if (gameId) {
        funtion(gameId!, teamIndex, newValue)
      }
    }, 1000),
    []
  );

  const handleTextColor = (teamIndex: number, newTextColor: string) => {
    changeTeamTextColor(teamIndex, newTextColor)
    debounceUpdate(newTextColor, teamIndex, changeTeamTextColorService)
  }

  const handleColor = (teamIndex: number, newColor: string) => {
    changeTeamColor(teamIndex, newColor)
    debounceUpdate(newColor, teamIndex, changeTeamColorService)
  }

  const handleName = (teamIndex: number, newName: string) => {
    changeTeamName(teamIndex, newName)
    debounceUpdate(newName, teamIndex, changeTeamNameService)
  }

  const handleShortName = (teamIndex: number, newShortName: string) => {
    if (newShortName.length < 11) {
      changeTeamShortName(teamIndex, newShortName)
      debounceUpdate(newShortName, teamIndex, changeTeamShortNameService)
    }
  }

  const handleLogoUpload = async (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const linkUrl = await fileHandler(file)
      updateTeam(index, { logo: linkUrl })
    }
  }

  return (
    <Card className="bg-[#1a1625] border-[#2d2b3b] text-white">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Customize Overlay</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Global Effects */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm text-white font-semibold">Stealth Effect Active</Label>
            <Switch className="data-[state=checked]:bg-[#ff5622]" />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm text-white font-semibold">Logos Active</Label>
            <Switch className="data-[state=checked]:bg-[#4c3f82]" />
          </div>
        </div>

        {/* Teams Customization */}
        {teams.map((team, index) => (
          <div key={index} className="space-y-4 pt-4 border-t border-[#2d2b3b]">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm text-white font-semibold">
                  Team {index + 1} Name
                </Label>
                <Input
                  value={team.name}
                  onChange={(e) => handleName(index, e.target.value )}
                  className="bg-[#2d2b3b] border-0"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-white font-semibold">
                  Team {index + 1} Short Name
                </Label>
                <Input
                  value={team.shortName}
                  onChange={(e) => handleShortName(index, e.target.value)}
                  className="bg-[#2d2b3b] border-0"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-white font-semibold">
                  Team {index + 1} Logo
                </Label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="file"
                    className="hidden"
                    id={`team-${index}-logo`}
                    accept="image/*"
                    onChange={(e) => handleLogoUpload(index, e)}
                  />
                  <Button
                    variant="outline"
                    className="bg-[#2d2b3b] hover:bg-[#363447] border-0"
                    onClick={() =>
                      document.getElementById(`team-${index}-logo`)?.click()
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

              <div className="space-y-2">
                <Label className="text-sm text-white font-semibold">
                  Team {index + 1} Color
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={team.color}
                    onChange={(e) => handleColor(index, e.target.value )}
                    className="w-12 h-12 p-1 bg-[#2d2b3b] border-0"
                  />
                  <Input
                    value={team.color}
                    onChange={(e) => handleColor(index, e.target.value )}
                    className="bg-[#2d2b3b] border-0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-white font-semibold">
                  Team {index + 1} Text Color
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={team.textColor}
                    onChange={(e) =>
                      handleTextColor(index, e.target.value)
                    }
                    className="w-12 h-12 p-1 bg-[#2d2b3b] border-0"
                  />
                  <Input
                    value={team.textColor}
                    onChange={(e) =>
                      handleTextColor(index, e.target.value )
                    }
                    className="bg-[#2d2b3b] border-0"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Global Colors */}
        <div className="space-y-4 pt-4 border-t border-[#2d2b3b]">
          <div className="space-y-2">
            <Label className="text-sm text-white font-semibold">Primary Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-12 h-12 p-1 bg-[#2d2b3b] border-0"
              />
              <Input 
                className="bg-[#2d2b3b] border-0" 
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-white font-semibold">Primary Text Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={primaryTextColor}
                onChange={(e) => setPrimaryTextColor(e.target.value)}
                className="w-12 h-12 p-1 bg-[#2d2b3b] border-0"
              />
              <Input 
                className="bg-[#2d2b3b] border-0" 
                value={primaryTextColor}
                onChange={(e) => setPrimaryTextColor(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-white font-semibold">Accent Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-12 h-12 p-1 bg-[#2d2b3b] border-0"
              />
              <Input 
                className="bg-[#2d2b3b] border-0" 
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Position Controls */}
        <div className="space-y-4 pt-4 border-t border-[#2d2b3b]">
          <div className="space-y-2">
            <Label className="text-sm text-white font-semibold">Horizontal Position</Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="bg-[#2d2b3b] hover:bg-[#363447] border-0"
                onClick={() => setHorizontalPosition(Math.max(0, horizontalPosition - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                className="w-20 bg-[#2d2b3b] border-0 text-center"
                value={horizontalPosition}
                onChange={(e) => setHorizontalPosition(Number(e.target.value))}
              />
              <Button
                variant="outline"
                size="icon"
                className="bg-[#2d2b3b] hover:bg-[#363447] border-0"
                onClick={() => setHorizontalPosition(horizontalPosition + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-white font-semibold">Vertical Position</Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="bg-[#2d2b3b] hover:bg-[#363447] border-0"
                onClick={() => setVerticalPosition(Math.max(0, verticalPosition - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                className="w-20 bg-[#2d2b3b] border-0 text-center"
                value={verticalPosition}
                onChange={(e) => setVerticalPosition(Number(e.target.value))}
              />
              <Button
                variant="outline"
                size="icon"
                className="bg-[#2d2b3b] hover:bg-[#363447] border-0"
                onClick={() => setVerticalPosition(verticalPosition + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
