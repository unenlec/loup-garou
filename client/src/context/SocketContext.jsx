import { createContext, useContext, useState } from "react";
import io from 'socket.io-client'


export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
    const socket = io.connect("localhost:4002");
    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
}