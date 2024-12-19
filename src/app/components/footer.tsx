"use client"
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { SiVercel } from "react-icons/si";
const Footer = () => {

  const [isloggedin,setisloggedin]=useState(false)
  const handlelogout = async () => {
    const res = await fetch("/api/logout", { method: "POST" });
    if (res.ok) {
        setisloggedin(true); // Update the logged-in state
        console.log("Successfully logged out");
    } else {
        console.error("Logout failed");
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
    <footer className="p-[30px] shadow-gray-900 shadow-xl bg-gray-950 font-sans text-white relative top-[100vh]">
      <div className="flex justify-between w-[90%] items-center">
        <div className="grid gap-7">
          <Link href="/"><li className="cursor-pointer list-none hover:underline">Home</li></Link>
         <Link href="/Ai"><li className="cursor-pointer list-none hover:underline">AI Chat</li></Link>
          <Link href="/creategroup"><li className="cursor-pointer list-none hover:underline">Create Group</li></Link>
          {!isloggedin ?<Link href="/Signin"><li className="cursor-pointer list-none hover:underline">Sign In</li></Link>:""}
          {isloggedin ?<Link href="/logout"><li className="cursor-pointer list-none hover:underline">logout</li></Link>:""}
        </div>
        <div className="flex space-x-4 size">
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin className="text-gray-800 text-2xl hover:text-white" />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub className="text-gray-800 text-2xl hover:text-white" />
            
          </a>
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SiVercel className="text-gray-800 text-2xl hover:text-white" />
        </a>
        </div>
        <div>
          <h4>Copyright 2024-2025</h4>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
