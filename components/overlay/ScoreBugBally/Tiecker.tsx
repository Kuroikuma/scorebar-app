import { useEffect, useRef } from "react";

const advertisements = [
  "WESTER DISCO: El lugar de los mejores momentos.",
  "LIBRERÍA SUEÑOS DE PAPEL: Santo Domingo, frente a Nick Pollos. 📞 8221-0655",
  "COMERCIAL MARIELOS: Tenemos todo lo que buscas y mucho más.",
  "AGRO VETERINARIA MIRANDA: Barrio Chester Obando, contiguo a Farmacia Santa Isabel, Santo Domingo.",
  "CLUB DE BILLARES PICA PICA: El lugar perfecto para relajarte y disfrutar.",
  "VARIEDADES SUYEN: Nuestra misión es ofrecerte lo mejor en productos, precios y atención.",
  "FARMACIA Y LABORATORIO CLÍNICO SANTA ISABEL: Donde tu salud es nuestra prioridad, Barrio Chester Obando, contiguo a Veterinaria Miranda.",
  "CARNICERÍA FEFI: Del Parque Municipal, 1 cuadra al noroeste, Santo Domingo. 📞 8656-0635, 8632-3207",
  "FLORISTERÍA TOLEDO: Barrio Chester Obando, del Parque Municipal, 80 m al noroeste, Santo Domingo. 📞 8961-7940",
  "VARIEDADES MEY: CALLE CENTRAL SANTO DOMINGO FRENTE A VARIEDADAES SUYEN, TELEFONO: 86542085",
  "AGRADECEMOS EL PATROCINIO DE: FELIX PEDRO SEQUEIRA PICA PIEDRA, MARIA SEQUEIRA Y ELVIN SEQUEIRA.",
  "CREACIONES EL CARMEN: Te ofrece todo en sublimaciones, Santo Domingo, Barrio Chester Obando, Detras de la cancha municipa telf: 8855-0462 8621-8126",
];

const Ticker = () => {
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ticker = tickerRef.current;

    if (ticker) {
      const totalWidth = ticker.scrollWidth; // Ancho total de todos los anuncios
      const speed = 50; // Velocidad en píxeles por segundo

      const duration = totalWidth / speed; // Calculamos la duración
      ticker.style.animationDuration = `${duration}s`; // Ajustamos la duración dinámicamente
    }
  }, [advertisements]);

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
    font-size: 1.5rem;
    color: white;
  }
`;

export const dynamic = "force-dynamic";

export default Ticker;
