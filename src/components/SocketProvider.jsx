import React, { createContext, useState, useEffect } from 'react';
import { io } from "socket.io-client";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!socket) {
        const newSocket = io('http://localhost:3000'); 
        setSocket(newSocket);
    }

    return () => socket && socket.close();
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
