'use client'

import { Card } from '@/components/ui/card'

export default function PlayerCard() {
  return (
    <div className="flex items-center justify-center min-h-[112px] bg-gradient-to-br from-gray-900 to-black rounded-lg">
      <div className="relative w-[84px] h-[112px] group">
        {/* Outer frame with glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-blue-600 to-yellow-400 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>

        {/* Main card */}
        <Card className="relative h-full w-full bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-400/50 rounded-lg overflow-hidden">
          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-yellow-400 rounded-tl-lg"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-yellow-400 rounded-tr-lg"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-yellow-400 rounded-bl-lg"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-yellow-400 rounded-br-lg"></div>

          {/* Content */}
          <div className="relative h-full flex flex-col items-center p-3">
            {/* Rating */}
            <div className="flex items-center justify-between w-full">
              <p className="font-bold text-xs text-yellow-400">112</p>
              <p className="font-bold text-xs text-blue-400">RW</p>
            </div>

            {/* Player Image Container */}
            <div className="relative w-full h-48">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent"></div>
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-liJmcLZg0jwcADNLObTHW4wA9L432S.png"
                alt="Player"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center justify-between w-full">
              {/* Player Name */}
              <div className="font-bold text-xs text-white">BALE</div>

              {/* Flag */}
              <div className="w-4 h-4 rounded-full overflow-hidden border-2 border-yellow-400">
                <div className="w-full h-1/2 bg-green-600"></div>
                <div className="w-full h-1/2 bg-white"></div>
              </div>
            </div>

            {/* Decorative lines */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-yellow-400 to-transparent"></div>
              <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-yellow-400 to-transparent"></div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
