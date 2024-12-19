'use client';

import Post from '@/app/components/post';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface Grouptype {
  _id: string;
  creator: string;
  title: string;
  description: string;
  image: string;
  roomId: string;
  createdAt: Date;
}

const Chatroom = () => {
  const { groupid } = useParams();
  const [session, setSession] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<string[]>([]); // State to store chat messages
  const [resdata, setResData] = useState<Grouptype>();
  const [showSettings, setShowSettings] = useState(false);

  const fetchSession = async () => {
    try {
      const res = await fetch("/api/session");

      if (!res.ok) {
        throw new Error(`Error fetching session: ${res.statusText}`);
      }

      const data = await res.json();
      setSession(data.session);
    } catch (error) {
      console.error("Session fetch error:", error);
    }
  };

  const fetchData = async () => {
    try {
      const id = groupid;
      const res = await fetch("/api/grouplist/byname", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        throw new Error(`Error fetching data: ${res.statusText}`);
      }

      const data = await res.json();
      if (data) {
        setResData(data.message._doc);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    const newSocket = io("http://localhost:4000");
    setSocket(newSocket);

    newSocket.on("connect", () => {
        console.log("Socket connected:", newSocket.id);
    });

    newSocket.on("new-message", (message) => {
        console.log("Received new message:", message);
        setMessages((prevMessages) => [...prevMessages, message.text]);
    });

    return () => {
        newSocket.disconnect();
        console.log("Socket disconnected");
    };
}, []);

  const sendMessage = () => {
    if (!socket || !text) return;
    const message = { text, session, groupid };
    socket.emit("new-message", message);
    setMessages((prevMessages) => [...prevMessages, text]); // Add the sent message to the state
    setText(""); // Clear input field after sending
  };

  useEffect(() => {
    if (socket && groupid) {
      socket.emit('join-chat', groupid);
    }
  }, [socket, groupid]);

  useEffect(() => {
    fetchSession();
    if (session && socket) {
      socket.emit("addNewUser", session); // Send session to server
    }
  }, [socket, session]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section className="relative top-[250px] grid gap-[100px] place-content-center">
      {resdata?.title ? (
        <h2 className="text-gray-600 m-auto text-4xl border border-gray-600 px-[30px] py-[10px]">
          {resdata?.title}
        </h2>
      ) : (
        <h2 className="text-gray-600 m-auto text-4xl">Loading...</h2>
      )}

      <div className="grid relative top-[100px] justify-between items-center w-full">
        <button
          className="text-white text-4xl p-2 hover:bg-gray-700 rounded-md focus:outline-none"
          onClick={() => setShowSettings(!showSettings)}
        >
          {showSettings ? '✖' : '☰'}
        </button>

        <div
          className={`transition-all duration-300 ease-in-out absolute top-[55px] bg-gray-900 text-white shadow-black p-4 w-64 rounded-lg shadow-lg ${showSettings ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
        >
          {showSettings && (
            <ul className='grid gap-5'>
              <li className='cursor-pointer hover:text-gray-500 duration-300 ease-in-out transition-all'>Settings</li>
              <li className='cursor-pointer hover:text-gray-500 duration-300 ease-in-out transition-all'>Privacy</li>
              <li className='cursor-pointer hover:text-gray-500 duration-300 ease-in-out transition-all'>Leave</li>
            </ul>
          )}
        </div>
      </div>

      {/* Message Display */}
      <div className="w-[1200px] h-[400px] p-4 bg-gray-800 text-white shadow-xl rounded overflow-y-auto">
        {messages.map((msg, index) => (
          <p key={index} className="mb-2">
            {msg}
          </p>
        ))}
      </div>

      {/* Input and Send Button */}
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border rounded p-2"
      />
      <button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded">
        Send
      </button>
    </section>
  );
};

export default Chatroom;
