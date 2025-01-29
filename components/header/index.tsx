import Image from 'next/image';
import { ProfileUser } from '../Profile';
import logo from "../../app/assets/StrikeBoarLogo.png"

export const Header = () => {
  return (
    <div className="w-full h-[10vh] flex items-center justify-between px-8 bg-black font-['Roboto_Condensed']">
      <h1 className="h-full text-center text-white flex items-center justify-center">
      <Image 
        src={logo}
        alt="Descripción de la imagen" 
        width={120} 
        height={60} 
      />
      </h1>
      <div className="h-full flex items-center justify-center">
        <ProfileUser />
      </div>
    </div>
  );
};
