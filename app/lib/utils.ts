import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function darkenRGBString(rgbString:string, amount = 20) {
  // Extrae los valores RGB usando una expresión regular
  const match = rgbString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);

  if (!match) {
    throw new Error("Por favor, proporciona un color válido en formato 'rgb(x, y, z)'.");
  }

  // Convierte los valores extraídos a números
  const r = parseInt(match[1], 10);
  const g = parseInt(match[2], 10);
  const b = parseInt(match[3], 10);

  // Función para oscurecer un valor
  const darken = (value:number) => Math.max(0, Math.min(255, value - amount));

  // Aplica la reducción a cada componente
  const newR = darken(r);
  const newG = darken(g);
  const newB = darken(b);

  // Devuelve el nuevo color como string
  return `rgb(${newR}, ${newG}, ${newB})`;
}

export function darkenColor(hex:string, amount = 20) {
  // Verifica si el hex es válido
  if (!/^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(hex)) {
    throw new Error("Por favor, proporciona un color válido en formato hexadecimal.");
  }

  // Convierte el color a formato RGB
  let color = hex.substring(1);
  if (color.length === 3) {
    color = color.split("").map((char) => char + char).join("");
  }

  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);

  // Reduce el brillo (hace el color más oscuro)
  const darken = (value:number) => Math.max(0, Math.min(255, value - amount));

  const newR = darken(r);
  const newG = darken(g);
  const newB = darken(b);

  // Convierte de nuevo a hexadecimal
  const toHex = (value:number) => value.toString(16).padStart(2, "0");

  const darkerHex = `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
  return darkerHex;
}

