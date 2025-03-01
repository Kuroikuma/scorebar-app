import { usePathname } from "next/navigation";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb";
import React from "react";
import { useTeamsStore } from "@/app/store/teamsStore";
import { useTeamStore } from "@/matchStore/useTeam";

export const DynamicBreadcrumb = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean); // Divide la ruta y elimina vacíos
  const { teams } = useTeamsStore();
  const { awayTeam, homeTeam } = useTeamStore()

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Home Link */}
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>

        {/* Itera sobre los segmentos para crear los BreadcrumbItems */}
        {pathSegments.map((segment, index) => {
          const href = "/" + pathSegments.slice(0, index + 1).join("/");
          const isLast = index === pathSegments.length - 1;

          if (isLast && pathSegments.some(segment => segment === 'games') && segment !== "games") {
            segment = `${teams[0].name.substring(0, 3)} VS ${teams[1].name.substring(0, 3)}`
          }

          if (isLast && pathSegments.some(segment => segment === 'match') && segment !== "match") {
            segment = `${awayTeam.name.substring(0, 3)} VS ${homeTeam.name.substring(0, 3)}`
          }

          
          return (
            <React.Fragment key={href}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{formatSegment(segment)}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>{formatSegment(segment)}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

// Convierte "mi-ruta" en "Mi Ruta" para mejor visualización
function formatSegment(segment: string) {
  return segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}