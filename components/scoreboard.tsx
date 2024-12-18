"use client"

import { useState, useEffect } from "react"
import { ControlPanel } from "./control-panel"
import { CustomizePanel } from "./customize-panel"
import { TabsLayout } from "./tabs-layout"
import { ClassicScoreboard } from "./classic-scoreboard"
import { ModernScoreboard } from "./modern-scoreboard"

export default function BaseballScoreboard() {
  const [activeTab, setActiveTab] = useState("controls")
  const [scoreboardStyle, setScoreboardStyle] = useState<"classic" | "modern">("classic")
  const [inning, setInning] = useState(1)
  const [isTopInning, setIsTopInning] = useState(true)
  const [balls, setBalls] = useState(0)
  const [strikes, setStrikes] = useState(0)
  const [outs, setOuts] = useState(0)
  const [bases, setBases] = useState([false, false, false])
  const [teams, setTeams] = useState([
    { 
      name: "ST DOMINGO", 
      runs: 0, 
      color: "#2057D1",
      textColor: "#ffffff",
      logo: "",
    },
    { 
      name: "JUIGALPA", 
      runs: 0, 
      color: "#A31515",
      textColor: "#ffffff",
      logo: "",
    },
  ])
  
  const [primaryColor, setPrimaryColor] = useState("#000000")
  const [primaryTextColor, setPrimaryTextColor] = useState("#ffffff")
  const [accentColor, setAccentColor] = useState("#b70606")
  const [horizontalPosition, setHorizontalPosition] = useState(0)
  const [verticalPosition, setVerticalPosition] = useState(0)

  useEffect(() => {
    // Reset bases, balls, strikes, and outs when inning changes
    setBases([false, false, false])
    setBalls(0)
    setStrikes(0)
    setOuts(0)
  }, [inning, isTopInning])

  useEffect(() => {
    // Reset balls and strikes only when first base becomes occupied
    if (bases[0]) {
      setBalls(0)
      setStrikes(0)
    }
  }, [bases])

  const changeInning = (increment: boolean) => {
    if (increment) {
      if (!isTopInning) {
        setInning(inning + 1)
        setIsTopInning(true)
      } else {
        setIsTopInning(false)
      }
    } else {
      if (isTopInning) {
        if (inning > 1) {
          setInning(inning - 1)
          setIsTopInning(false)
        }
      } else {
        setIsTopInning(true)
      }
    }
  }

  const handleOutsChange = (newOuts: number) => {
    if (newOuts === 3) {
      setOuts(0)
      changeInning(true)
    } else {
      setOuts(newOuts)
    }
  }

  const handleStrikeChange = (newStrikes: number) => {
    if (newStrikes === 3) {
      setStrikes(0)
      handleOutsChange(outs + 1)
    } else {
      setStrikes(newStrikes)
    }
  }

  const handleBallChange = (newBalls: number) => {
    if (newBalls === 4) {
      setBalls(0)
      // Advance runners if possible
      const newBases = [...bases]
      for (let i = 2; i >= 0; i--) {
        if (newBases[i]) {
          if (i === 2) {
            // Runner on third scores
            setTeams(teams.map((team, index) => 
              index === (isTopInning ? 0 : 1) ? { ...team, runs: team.runs + 1 } : team
            ))
          } else {
            newBases[i + 1] = true
          }
        }
      }
      newBases[0] = true
      setBases(newBases)
    } else {
      setBalls(newBalls)
    }
  }

  const scoreboardProps = {
    teams,
    inning,
    isTopInning,
    balls,
    strikes,
    outs,
    bases,
    primaryColor,
    primaryTextColor,
    accentColor,
  }

  return (
    <div className="min-h-screen bg-black md:p-4 font-['Roboto_Condensed'] flex max-[768px]:flex-col pt-4 pb-4">
      {/* Scoreboard */}
      <div className="flex-1 max-w-[400px] md:mx-auto bg-black text-white max-[768px]:px-4">
        {scoreboardStyle === "classic" ? (
          <ClassicScoreboard {...scoreboardProps} />
        ) : (
          <ModernScoreboard {...scoreboardProps} />
        )}
      </div>

      {/* Side Panel */}
      <div className="w-[350px] ml-4">
        <TabsLayout activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === "controls" ? (
          <ControlPanel
            balls={balls}
            setBalls={handleBallChange}
            strikes={strikes}
            setStrikes={handleStrikeChange}
            outs={outs}
            setOuts={handleOutsChange}
            bases={bases}
            setBases={setBases}
            teams={teams}
            setTeams={setTeams}
            inning={inning}
            setInning={changeInning}
            isTopInning={isTopInning}
            setIsTopInning={setIsTopInning}
            scoreboardStyle={scoreboardStyle}
            setScoreboardStyle={setScoreboardStyle}
          />
        ) : activeTab === "customize" ? (
          <CustomizePanel
            teams={teams}
            setTeams={setTeams}
            primaryColor={primaryColor}
            setPrimaryColor={setPrimaryColor}
            primaryTextColor={primaryTextColor}
            setPrimaryTextColor={setPrimaryTextColor}
            accentColor={accentColor}
            setAccentColor={setAccentColor}
            horizontalPosition={horizontalPosition}
            setHorizontalPosition={setHorizontalPosition}
            verticalPosition={verticalPosition}
            setVerticalPosition={setVerticalPosition}
          />
        ) : null}
      </div>
    </div>
  )
}

