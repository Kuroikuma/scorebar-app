import { Area } from "react-easy-crop";
export default async function getCroppedImg(
  imageSrc: string,
  crop: Area
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("No se pudo obtener el contexto del canvas");

  canvas.width = crop.width;
  canvas.height = crop.height;

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject("Error al crear la imagen recortada");
        return;
      }
      resolve(URL.createObjectURL(blob));
    }, "image/jpeg");
  });
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = (error) => reject(error);
    image.src = url;
  });
}

export function formatName(fullName: string): string {
  const [firstName, lastName] = fullName.split(' ');
  
  if (!firstName || !lastName) {
    throw new Error('El nombre debe contener al menos un nombre y un apellido.');
  }

  const initial = firstName[0].toUpperCase(); // Toma la primera letra del nombre
  const formattedLastName = lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase(); // Capitaliza el apellido

  return `${initial}. ${formattedLastName}`;
}

export function deleteNumbers(texto: string): string {
  return texto.replace(/\d/g, '');
}
