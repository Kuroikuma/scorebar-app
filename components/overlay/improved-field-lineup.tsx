"use client";

import { useTeamsStore } from "@/app/store/teamsStore";
import React from "react";

interface ICoordenadas {
  x: string;
  y: string;
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

export default function BaseballFormation() {
  const { teams } = useTeamsStore();
  const lineup = teams[0].lineup;
  const logo = teams[0].logo;

  const fieldPositions: IFieldPositions = {
    LF: { y: "31%", x: "22%" }, // Left Field
    CF: { y: "20%", x: "50%" }, // Center Field
    RF: { y: "31%", x: "78%" }, // Right Field
    "3B": { y: "58%", x: "34%" }, // Third Base
    SS: { y: "47%", x: "39%" }, // Short Stop
    "2B": { y: "47%", x: "64%" }, // Second Base
    "1B": { y: "58%", x: "66%" }, // First Base
    P: { y: "59%", x: "50%" }, // Pitcher
    C: { y: "85%", x: "50%" }, // Catcher
  };

  return (
    <div className="relative w-full h-screen bg-gray-900 flex items-center justify-center">
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
