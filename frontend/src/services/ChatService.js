import io from 'socket.io-client';

const SOCKET_PORT = (process.env.NODE_ENV !== 'development')
    ? ''
    : '//localhost:3003';

io(SOCKET_PORT);