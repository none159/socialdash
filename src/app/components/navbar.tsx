"use client";
import { useState, useEffect } from "react";
import Link from 'next/link';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [transitionX, setTransitionX] = useState("-500px");
  const [isloggedin, setisloggedin] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
    setTransitionX(isOpen ? "-500px" : "0px");
  };

  const handleLogout = async () => {
    const response = await fetch("/api/logout", { method: "POST" });
    if (response.ok) {
      window.location.href = "/Signin"; 
    } else {
      console.error("Logout failed:", await response.text());
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/checksession");
        if (res.ok) {
          const data = await res.json();
          setisloggedin(data.isLoggedIn);
        } else {
          console.error("Failed to fetch session status");
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };

    checkSession();
  }, []);

  return (
    <div>
      <button onClick={toggleNavbar} className="absolute top-2 left-2 bg-gray-800 p-3 rounded-full hover:bg-gray-700 transition-all duration-300">
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        )}
      </button>

      <nav className="absolute top-[70px] left-0 shadow-gray-900 shadow-xl z-[1] duration-1000 transition-all ease-in-out rounded-sm bg-gray-950 w-[500px] p-[10px]" style={{ transform: `translateX(${transitionX})` }}>
        <ul className="grid gap-10 text-white place-items-center text-center font-sans">
          <li className="cursor-pointer hover:text-gray-400 hover:duration-[250ms]">
            <Link href="/">Home</Link>
          </li>
          <li className="cursor-pointer hover:text-gray-400 hover:duration-[250ms]">
            <Link href="/profile">Profile</Link>
          </li>
          <li className="cursor-pointer hover:text-gray-400 hover:duration-[250ms]">
            <Link href="/grouplist">Group List</Link>
          </li>
          <li className="cursor-pointer hover:text-gray-400 hover:duration-[250ms]">
            <Link href="/creategroup">Create Group</Link>
          </li>
          <li className="cursor-pointer hover:text-gray-400 hover:duration-[250ms]">
            <Link href="/mygroups">My Groups</Link>
          </li>
          <li className="cursor-pointer hover:text-gray-400 hover:duration-[250ms]">
            <Link href="/Ai">AI Chat</Link>
          </li>
          {isloggedin ? (
            <li onClick={handleLogout} className="cursor-pointer hover:text-gray-400 hover:duration-[250ms]">Logout</li>
          ) : (
            <li className="cursor-pointer hover:text-gray-400 hover:duration-[250ms]">
              <Link href="/Signin">Sign In</Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
