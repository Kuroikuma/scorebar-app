import { EventNotification } from './EventMatch'

interface CardPlayersProps {
  notification: EventNotification
}

export function CardPlayers({ notification }: CardPlayersProps) {
  return (
    <div
      className="flex relative items-center w-full h-[50px] border-t-2"
      style={{
        background:`linear-gradient(to right, rgb(32, 0, 199) 0%, rgb(14, 0, 95) 40%, rgb(14, 0, 95) 60%, rgb(32, 0, 199) 100%)`,
      }}
    >
      <div
        className="absolute -top-[2px] left-0 right-0 h-[2px]"
        style={{
          background: 'linear-gradient(90deg, #0534da 0%, #4bded8 100%)',
        }}
      ></div>
      <div className="flex justify-between w-full items-center pr-4">
        <div className=" text-xl font-bold">
          <img
            src="/logoEquipo.png"
            alt="Logo"
            className="h-12 w-full object-contain"
          />
        </div>
        <div className="text-xl">{notification.playerName}</div>
        {notification.type === 'yellowCard' ? (
          <div className="bg-yellow-500 h-9 w-6"></div>
        ) : (
          <div className="bg-red-500"></div>
        )}
      </div>
    </div>
  )
}
