import { ProfileUser } from '../Profile';
import { useAuth } from '@/app/context/AuthContext';

export const Header = () => {
  const { user } = useAuth();

  if (!user) {
    return <></>;
  }

  return (
    <div className="w-full md:h-[10vh] h-[20vh] flex items-center justify-between px-8 bg-black font-['Roboto_Condensed'] flex-col md:flex-row md:justify-between">
      <h1 className="h-[70%] text-center text-white flex items-center justify-center">
        <img
          src={user?.organizationId?.logo ? user.organizationId.logo : '../../app/assets/StrikeBoarLogo.png'}
          alt="Descripción de la imagen"
          className="w-full h-full object-contain"
        />
      </h1>

      <h1 className="text-white md:flex text-center hidden">
        {user.role} - {user.organizationId.name}
      </h1>

      <div className="h-full md:flex items-center hidden justify-center">
        <ProfileUser />
      </div>

      <div className="flex items-center justify-between h-[20%] md:hidden">
        <h1 className="text-white text-center md:hidden">
          {user.role} - {user.organizationId.name}
        </h1>

        <div className="h-full flex items-center justify-center md:hidden">
          <ProfileUser />
        </div>
      </div>
    </div>
  );
};
