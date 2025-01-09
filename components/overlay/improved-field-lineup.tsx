"use client";

import socket from "@/app/service/socket";
import { useGameStore } from "@/app/store/gameStore";
import { useOverlayStore } from "@/app/store/overlayStore";
import { Player, Team, useTeamsStore } from "@/app/store/teamsStore";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect } from "react";

interface ICoordenadas {
  x: string;
  y: string;
}

interface BaseballFormationOverlayProps {
  overlayId : "formationA" | "formationB"
  visible: boolean
}

interface BaseballFormationProps {
  lineup: Player[]
  logo: string | undefined
}

interface ISocketData {
  teamIndex: number
  lineup: Player[]
  lineupSubmitted: boolean
}

interface IFieldPositions {
  LF: ICoordenadas;
  CF: ICoordenadas;
  RF: ICoordenadas;
  "3B": ICoordenadas;
  SS: ICoordenadas;
  "2B": ICoordenadas;
  "1B": ICoordenadas;
  P: ICoordenadas;
  C: ICoordenadas;
}

type FieldPosition = keyof IFieldPositions;

export default function BaseballFormation({ lineup, logo }: BaseballFormationProps) {

  const fieldPositions: IFieldPositions = {
    LF: { y: "30%", x: "20%" }, // Left Field
    CF: { y: "17%", x: "50%" }, // Center Field
    RF: { y: "30%", x: "80%" }, // Right Field
    "3B": { y: "58%", x: "34%" }, // Third Base
    SS: { y: "45%", x: "38%" }, // Short Stop
    "2B": { y: "45%", x: "66%" }, // Second Base
    "1B": { y: "58%", x: "66%" }, // First Base
    P: { y: "66%", x: "50%" }, // Pitcher
    C: { y: "90%", x: "50%" }, // Catcher
  };

  return (
    <div className="relative w-full h-screen bg-transparent flex items-center justify-center">
      {/* Baseball Field Background */}
      <img src={logo} alt="Team Logo" className="h-[50vh] object-contain" />
      <div className="relative w-[900px] h-[100vh]">
        <img
          src="/baseball-field.png"
          alt="Baseball Field"
          className="w-full h-full object-contain"
        />

        {/* Player Names */}
        {lineup.filter((player) => player.position !== "DH").map((player, index) => {
          const position = fieldPositions[player.position as FieldPosition];
          return (
            <div
              key={index}
              className="absolute text-white font-bold text-sm text-center px-2 py-1 bg-black/70 rounded shadow-lg"
              style={{
                top: position.y,
                left: position.x,
                transform: "translate(-50%, -50%)",
              }}
            >
              {player?.name}
            </div>
          );
        })}
      </div>
      <img src="/logo-st-activo.png" className="h-[50vh] object-contain" alt="" />
    </div>
  );
}

export const BaseballFormationOverlay = ({ overlayId, visible }: BaseballFormationOverlayProps) => {
  const { teams } = useTeamsStore();
  const currentTeam = overlayId === "formationA" ? teams[0] : teams[1];
  const lineup = currentTeam.lineup;
  const logo = currentTeam.logo;

  const { changeLineupOverlay } = useOverlayStore();

  const { id } = useGameStore()

  useEffect(() => {
    const eventName = `server:updateLineupTeam/${id}`
    
    const refreshLineup = (socketData: ISocketData) => {
      changeLineupOverlay(socketData.teamIndex, socketData.lineup, socketData.lineupSubmitted)
    }

    socket.on(eventName, refreshLineup)

    return () => {
      socket.off(eventName, refreshLineup)
    }
  }, [ id ])

  return (
    <AnimatePresence initial={false}>
        {visible ? (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}  
            >
              <BaseballFormation lineup={lineup} logo={logo} />
            </motion.div>
        ) : null}
    </AnimatePresence>
  ) 
}
