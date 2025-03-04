import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { ISponsor } from '@/app/types/sponsor';
import { useRouter } from 'next/navigation';

interface SponsorsProps {
  sponsors: ISponsor[];
  onViewDetails: (sponsor: ISponsor) => void;
  onEdit: (sponsor: ISponsor) => void;
}

export function Sponsors({ sponsors, onViewDetails, onEdit }: SponsorsProps) {

  const router = useRouter();
  const toSponsor = (sponsor: ISponsor) => router.push(`/sponsor/${sponsor._id}`);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sponsors.map((sponsor, index) => (
        <Card key={index} className="w-[340px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2 justify-between">
                <img
                  src={sponsor.logo || '/placeholder.svg'}
                  alt={sponsor.name}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <a href={sponsor.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {sponsor.name}
                </a>
              </div>
              <ExternalLink onClick={() => toSponsor(sponsor)} className="w-6 h-6 text-muted-foreground" />
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
  );
}
