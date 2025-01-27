"use client"

import React, { useState, type KeyboardEvent } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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

export default function DynamicList() {
  const [inputValue, setInputValue] = useState("")
  const [items, setItems] = useState<string[]>(advertisements)

  const addItem = () => {
    if (inputValue.trim() !== "") {
      setItems([...items, inputValue.trim()])
      setInputValue("")
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addItem()
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Lista de anuncios</h2>
      <div className="flex space-x-2 mb-4">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ingresa un elemento"
          className="flex-grow"
        />
        <Button onClick={addItem}>Agregar</Button>
      </div>
      <div className="w-full rounded-md border p-4">
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="bg-gray-100 p-2 rounded break-words mb-2">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

