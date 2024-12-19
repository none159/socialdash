"use client";

import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

type Message = {
  id: number;
  content: string;
  sender: string;
  avatar?: string;
};

type User = {
  userId: string;
  username: string;
  avatar: string;
};

const ChatApp = () => {
  const [roomId, setRoomId] = useState<string>("general");
  const [username, setUsername] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null); // Add correct type

  useEffect(() => {
    const newSocket = io("http://localhost:4000"); // Initialize the socket connection
    setSocket(newSocket);

    return () => {
      newSocket.disconnect(); // Cleanup on unmount
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit("addNewUser ", "dff"); // Use the socket safely
    }
  }, [socket]); // Dependency on socket

  return (
    <div className="p-4">
      <div className="text-xl font-bold">Chat Room: {roomId}</div>
      <div className="my-4 p-2 bg-gray-100 rounded shadow">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-2">
            <span className="font-bold">{msg.sender}: </span>
            {msg.content}
          </div>
        ))}
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border p-2 rounded flex-1"
          placeholder="Type a message..."
        />
        <button className="bg-blue-500 text-white p-2 rounded">Send</button>
      </div>
    </div>
  );
};

export default ChatApp;
