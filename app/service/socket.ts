import io from 'socket.io-client'

const  socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5001', {
  withCredentials: true,
  extraHeaders: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    'Access-Control-Allow-Credentials': 'true',
  }
})

export default socket