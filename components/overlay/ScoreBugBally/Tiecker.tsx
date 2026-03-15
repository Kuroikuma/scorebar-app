"use client";

import { useEffect, useRef } from "react";
import { useSponsorStore } from "@/app/store/useSponsor";
import { useGameStore } from "@/app/store/gameStore";

const Ticker = () => {
  const tickerRef = useRef<HTMLDivElement>(null);
  const { sponsors, getSponsorsByOrganizationId } = useSponsorStore();
  const { organizationId } = useGameStore();

  // Filtrar sponsors activos que tengan texto de anuncio
  const advertisements = sponsors
    .filter((sponsor) => !sponsor.deleted_at && sponsor.ad)
    .map((sponsor) => sponsor.ad);

  useEffect(() => {
    const ticker = tickerRef.current;

    if (ticker && advertisements.length > 0) {
      const totalWidth = ticker.scrollWidth; // Ancho total de todos los anuncios
      const speed = 50; // Velocidad en píxeles por segundo

      const duration = totalWidth / speed; // Calculamos la duración
      ticker.style.animationDuration = `${duration}s`; // Ajustamos la duración dinámicamente
    }
  }, [advertisements]);

    // Cargar sponsors cuando se monta el componente
    useEffect(() => {
      const loadSponsors = async () => {
        if (organizationId) {
          await getSponsorsByOrganizationId(organizationId)
        }
      }
      loadSponsors()
    }, [])

  // Si no hay anuncios, mostrar mensaje por defecto
  if (advertisements.length === 0) {
    return (
      <div className="w-[200px] flex flex-1 items-center justify-center overflow-hidden border-r border-white/20">
        <div className="text-yellow-400 text-sm px-4">
          No hay anuncios disponibles
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{tickerStyles}</style>
      <div className="w-[200px] flex flex-1 items-center overflow-hidden border-r border-white/20">
        <div className="ticker-wrap">
          <div className="ticker"  ref={tickerRef}>
            {advertisements.map((ad, index) => (
              <div key={index} className="ticker-item">
                {ad}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const tickerStyles = `
  @keyframes ticker {
    0% {
      transform: translate3d(0, 0, 0);
    }
    100% {
      transform: translate3d(-100%, 0, 0);
    }
  }

  .ticker-wrap {
    width: 100%;
    overflow: hidden;
    height: 60px;
    display: flex;
    align-items: center;
  }

  .ticker {
    display: flex;
    white-space: nowrap;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    animation-name: ticker;
  }

  .ticker-item {
    display: inline-block;
    padding: 0 2rem;
    font-size: 2rem;
    color: #ffff00;
  }
`;

export const dynamic = "force-dynamic";

export default Ticker;
