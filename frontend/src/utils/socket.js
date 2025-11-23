import { io } from 'socket.io-client';
let socket;
export const initSocket = (url = process.env.REACT_APP_SOCKET_URL || 'http://localhost:4000') => { socket = io(url); return socket; };
export const getSocket = () => socket;
