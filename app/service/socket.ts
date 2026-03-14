import io from 'socket.io-client'

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5001', {
  extraHeaders: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    'Access-Control-Allow-Credentials': 'true',
  }
})

// Unirse a la room de un juego
export const joinGameRoom = (gameId: string) => {
  socket.emit('@client:joinBaseballGame',  gameId );
  console.log(`🟢 Joining room: baseball:${gameId}`);
};

// Salir de la room al desmontar
export const leaveGameRoom = (gameId: string) => {
  socket.emit('@client:leaveBaseballGame',  gameId );
  console.log(`🔴 Leaving room: baseball:${gameId}`);
};

export default socket