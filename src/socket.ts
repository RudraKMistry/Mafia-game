import { io } from 'socket.io-client';

// Use the current hostname to connect to the backend on the same machine
const SOCKET_URL = `http://${window.location.hostname}:3001`;

export const socket = io(SOCKET_URL);
