import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ISponsor } from "@/app/types/user"

interface SponsorsProps {
  sponsors: ISponsor[]
  onViewDetails: (sponsor: ISponsor) => void
  onEdit: (sponsor: ISponsor) => void
}

export function Sponsors({ sponsors, onViewDetails, onEdit }: SponsorsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sponsors.map((sponsor, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image
                src={sponsor.logo || "/placeholder.svg"}
                alt={sponsor.name}
                width={24}
                height={24}
                className="rounded-full"
              />
              <a href={sponsor.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {sponsor.name}
              </a>
            </CardTitle>
            <CardDescription>{sponsor.ad}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Owner:</strong> {sponsor.owner}
            </p>
            <p>
              <strong>Email:</strong> {sponsor.email}
            </p>
            <div className="mt-4 flex justify-between">
              <Button variant="outline" onClick={() => onViewDetails(sponsor)}>
                View Details
              </Button>
              <Button variant="secondary" onClick={() => onEdit(sponsor)}>
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

