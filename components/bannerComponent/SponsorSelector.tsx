"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { useBannerStore } from "@/app/store/useBannerStore"
import { useSponsorStore } from "@/app/store/useSponsor"
import { ISponsor } from "@/app/types/sponsor"

export default function SponsorSelector() {
  const {  updateSponsor, bannerSelected } = useBannerStore()
  const { sponsorId } = bannerSelected
  const { sponsors } = useSponsorStore()
  const [selectedSponsorId, setSelectedSponsorId] = useState<string>((sponsorId as ISponsor)._id)

  const handleSponsorChange = (sponsorId: string) => {
    setSelectedSponsorId(sponsorId)
    updateSponsor(sponsorId)
  }

  return (
    <Card className="shadow-lg border-0 mb-6">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border-b">
        <CardTitle className="text-xl font-semibold text-slate-800 dark:text-white flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue-500"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          Seleccionar Sponsor
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <RadioGroup value={selectedSponsorId} onValueChange={handleSponsorChange} className="space-y-3">
          {sponsors.map((s) => (
            <div
              key={s._id}
              className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                selectedSponsorId === s._id
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700"
                  : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
            >
              <RadioGroupItem value={s._id} id={`sponsor-${s._id}`} />
              <Label htmlFor={`sponsor-${s._id}`} className="flex flex-1 items-center cursor-pointer">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700 flex-shrink-0">
                    <img src={s.logo || "/placeholder.svg"} alt={s.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-slate-900 dark:text-slate-100">{s.name}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 truncate">{s.email}</div>
                  </div>
                  {selectedSponsorId === s._id && (
                    <Badge
                      variant="outline"
                      className="ml-auto bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                    >
                      Seleccionado
                    </Badge>
                  )}
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  )
}

