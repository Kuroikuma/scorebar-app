import io from 'socket.io-client'

const  socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5001', {
  withCredentials: true, // Importante para solicitudes con credenciales
  extraHeaders: {
    "Access-Control-Allow-Credentials": "true", // Coincide con el backend
  },
})

export default socket