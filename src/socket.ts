import { io } from 'socket.io-client';

// Use undefined in production so socket.io defaults to window.location.origin
const SOCKET_URL = import.meta.env.PROD ? undefined : `http://${window.location.hostname}:3001`;

export const socket = io(SOCKET_URL);
