"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LoaderCircle, Plus, PlusCircle, ClubIcon as Soccer, Upload } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FormationFootball, IFootballMatch, IOverlays, TeamFootball } from "@/matchStore/interfaces"
import { Switch } from "../ui/switch"
import { useFileStorage } from "@/app/hooks/useUploadFile"
import { useAuth } from "@/app/context/AuthContext"
import { User } from "@/app/types/user"
import { defaultFormation } from "@/app/lib/defaultFormation"
import { createMatchService } from "@/app/service/apiMatch"

const defaultOverlay: IOverlays = {
  visible: false,
  x: 0,
  y: 0,
  scale: 100,
  id: "",
}

const defaultTeam: TeamFootball = {
  name: "",
  shortName: "",
  score: 0,
  color: "#000000",
  textColor: "#FFFFFF",
  logo: "",
  logoFit: "contain",
  players: [],
  staff: { manager: "", assistantManager: "", physio: "" },
  formation: { name: "", positions: [] },
  teamRole: "home",
  primaryColor: "#000000",
  secondaryColor: "#FFFFFF",
}

interface CreateFootballMatchModalProps {
  onCreateMatch: (match: IFootballMatch) => void
  open: boolean
}

const CreateFootballMatchModal = ({ onCreateMatch, open }: CreateFootballMatchModalProps) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (open) {
      setIsOpen(open);
    }
  }, [open]);

  const [homeTeam, setHomeTeam] = useState<TeamFootball & { useSingleColor: boolean }>({
    ...defaultTeam,
    teamRole: "home",
    useSingleColor: true,
  })
  const [awayTeam, setAwayTeam] = useState<TeamFootball & { useSingleColor: boolean }>({
    ...defaultTeam,
    teamRole: "away",
    useSingleColor: true,
  })
  const [leagueName, setLeagueName] = useState("")
  const [stadiumName, setStadiumName] = useState("")
  const [matchDate, setMatchDate] = useState("")

  const { file: homeTeamLogo, fileHandler: handleHomeTeamLogo } = useFileStorage();
  const { file: awayTeamLogo, fileHandler: handleAwayTeamLogo } = useFileStorage();
  const { file: leagueLogo, fileHandler: handleLeagueLogo } = useFileStorage();
  const [loading, setLoading] = useState(false);
  

  const handleCreateMatch = async () => {
    setLoading(true);

    const finalHomeTeam = homeTeam.useSingleColor ? { ...homeTeam, secondaryColor: homeTeam.primaryColor, logo: homeTeamLogo  } : homeTeam
    const finalAwayTeam = awayTeam.useSingleColor ? { ...awayTeam, secondaryColor: awayTeam.primaryColor, logo: awayTeamLogo  } : awayTeam

    const newMatch: IFootballMatch = {
      homeTeam: finalHomeTeam,
      awayTeam: finalAwayTeam,
      status: "upcoming",
      events: [],
      time: { minutes: 0, seconds: 0, stoppage: 0, isRunning: false },
      period: [
        { name: "1st Half", active: false },
        { name: "2nd Half", active: false },
        { name: "1st Extra", active: false },
        { name: "2nd Extra", active: false },
      ],
      substitutions: [],
      scoreboardUpOverlay: { ...defaultOverlay, id: "scoreboardUp" },
      formationAOverlay: { ...defaultOverlay, id: "formationA" },
      goalsDownOverlay: { ...defaultOverlay, id: "goalsDown" },
      scoreboardDownOverlay: { ...defaultOverlay, id: "scoreboardDown" },
      previewOverlay: { ...defaultOverlay, id: "preview" },
      formationBOverlay: { ...defaultOverlay, id: "formationB" },
      leagueName,
      leagueLogo,
      stadiumName,
      matchDate,
      organizationId: (user as User).organizationId._id, // This should be dynamically set in a real application
      past: [],
      future: [],
    }

    let matchesResponse = await createMatchService(newMatch);
    
    newMatch.id = matchesResponse.data._id;

    onCreateMatch(newMatch)
    setIsOpen(false)
    setLoading(false);
  }

 
  const updateTeam = (team: "home" | "away", field: keyof (TeamFootball & { useSingleColor: boolean }), value: any) => {
    const setTeam = team === "home" ? setHomeTeam : setAwayTeam
    setTeam((prevTeam) => ({ ...prevTeam, [field]: value }))
  }

  const handleLogoChange = (team: 'home' | 'away', event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {

      if (team === 'home') {
        handleHomeTeamLogo(event.target.files[0]);
      } else {
        handleAwayTeamLogo(event.target.files[0]);
      }
    }
  };

  const handleLeagueLogoA = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      handleLeagueLogo(event.target.files[0]);
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="w-5 h-5 mr-2" />
          Crear Nuevo Partido
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#fafafa] dark:bg-[#18181b]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Crear nuevo partido de fútbol</DialogTitle>
        </DialogHeader>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid gap-4 py-4"
          >
            <Tabs defaultValue="match" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="match">Match Details</TabsTrigger>
                <TabsTrigger value="home">Home Team</TabsTrigger>
                <TabsTrigger value="away">Away Team</TabsTrigger>
              </TabsList>
              <TabsContent value="match">
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="leagueName">League Name</Label>
                    <Input id="leagueName" value={leagueName} onChange={(e) => setLeagueName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">
                      League Logo
                    </Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="file"
                        className="hidden"
                        id={`team-${0}-logo`}
                        accept="image/*"
                        onChange={(e) => handleLeagueLogoA(e)}
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
                    <Label htmlFor="stadiumName">Stadium Name</Label>
                    <Input id="stadiumName" value={stadiumName} onChange={(e) => setStadiumName(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="matchDate">Match Date</Label>
                    <Input
                      id="matchDate"
                      type="date"
                      value={matchDate}
                      onChange={(e) => setMatchDate(e.target.value)}
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="home">
                <TeamForm team={{...homeTeam, logo: homeTeamLogo}} updateTeam={(field, value) => updateTeam("home", field, value)} handleLogoChange={(event) => handleLogoChange("home", event)} />
              </TabsContent>
              <TabsContent value="away">
                <TeamForm team={{...awayTeam, logo: awayTeamLogo}} handleLogoChange={(event) => handleLogoChange("away", event)} updateTeam={(field, value) => updateTeam("away", field, value)} />
              </TabsContent>
            </Tabs>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button type="submit" className="w-full" onClick={handleCreateMatch}>
            {
              loading ? <LoaderCircle className="animate-spin" /> : 'Crear Partido De Fútbol'
            }
          </Button>
              
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}

const TeamForm = ({
  team,
  updateTeam,
  handleLogoChange
}: {
  team: TeamFootball & { useSingleColor: boolean }
  updateTeam: (field: keyof (TeamFootball & { useSingleColor: boolean }), value: any) => void
  handleLogoChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}) => {

  return (
    <div className="grid gap-4">
      <div>
        <Label htmlFor="teamName">Team Name</Label>
        <Input id="teamName" value={team.name} onChange={(e) => updateTeam("name", e.target.value)} />
      </div>
      <div>
        <Label htmlFor="shortName">Short Name</Label>
        <Input id="shortName" value={team.shortName} onChange={(e) => updateTeam("shortName", e.target.value)} />
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
            onChange={(e) => handleLogoChange(e)}
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
      <div>
        <Label>Formation</Label>
        <Select
          value={team.formation.name}
          onValueChange={(value) =>
            updateTeam("formation", {
              name: value,
              positions: (defaultFormation.find((f) => f.name === value) as FormationFootball).positions,
            })
          }
        >
          <SelectTrigger>
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
      <div className="flex items-center space-x-2">
        <Switch
          name="useSingleColor"
          checked={team.useSingleColor}
          onCheckedChange={(checked) => updateTeam("useSingleColor", checked as boolean)}
        />
        <Label htmlFor="useSingleColor">Use single color for uniform</Label>
      </div>
      <div>
        <Label htmlFor="primaryColor">Primary Color</Label>
        <Input
          id="primaryColor"
          type="color"
          value={team.primaryColor}
          onChange={(e) => updateTeam("primaryColor", e.target.value)}
        />
      </div>
      {!team.useSingleColor && (
        <div>
          <Label htmlFor="secondaryColor">Secondary Color</Label>
          <Input
            id="secondaryColor"
            type="color"
            value={team.secondaryColor}
            onChange={(e) => updateTeam("secondaryColor", e.target.value)}
          />
        </div>
      )}
      <div>
        <Label htmlFor="manager">Manager</Label>
        <Input
          id="manager"
          value={team.staff.manager}
          onChange={(e) => updateTeam("staff", { ...team.staff, manager: e.target.value })}
        />
      </div>
    </div>
  )
}

export default CreateFootballMatchModal

