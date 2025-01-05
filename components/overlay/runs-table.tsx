"use client"

import { useGameStore } from "@/app/store/gameStore"

export function RunsTable() {
  const { runsByInning } = useGameStore()

  return (
    <div className="bg-black/80 text-white p-2 rounded-lg shadow-lg min-w-[300px]">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="px-2 py-1 text-left">Team</th>
            {Object.keys(runsByInning).map((inning) => (
              <th key={inning} className="px-2 py-1 text-center">{inning}</th>
            ))}
            <th className="px-2 py-1 text-center">R</th>
            <th className="px-2 py-1 text-center">H</th>
            <th className="px-2 py-1 text-center">E</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(runsByInning).map((team, index) => (
            <tr key={index}>
              <td className="px-2 py-1 text-center">{team}</td>
              {/* <td className="px-2 py-1 text-center">{team.hits}</td> */}
              {/* <td className="px-2 py-1 text-center">{team.errors}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

