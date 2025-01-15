"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { SiVercel } from "react-icons/si";
import Image from "next/image";

const Footer = () => {

  const [isloggedin, setisloggedin] = useState(false);

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
      <div className="flex justify-between text-left w-[90%] items-center">
        <div className="grid gap-7">
          <Link href="/"><li className="cursor-pointer list-none hover:underline">Home</li></Link>
          <Link href="/Ai"><li className="cursor-pointer list-none hover:underline">AI Chat</li></Link>
          <Link href="/creategroup"><li className="cursor-pointer list-none hover:underline">Create Group</li></Link>
          {!isloggedin ? <Link href="/Signin"><li className="cursor-pointer list-none hover:underline">Sign In</li></Link> : ""}
          {isloggedin ? <button onClick={handlelogout} className="w-0 h-0"><li className="cursor-pointer list-none hover:underline">logout</li></button> : ""}
        </div>
        <div className="flex  space-x-4 size">
          <a
            href="https://www.linkedin.com/in/yassine-mouhib-114a75284/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin className="text-gray-800 text-2xl hover:text-white" />
          </a>
          <a
            href="https://github.com/none159"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub className="text-gray-800 text-2xl hover:text-white" />
          </a>
          <a
            href="https://vercel.com/yassines-projects-51a48afb"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SiVercel className="text-gray-800 text-2xl hover:text-white" />
          </a>
          <a
  href="https://www.fiverr.com/none159?public_mode=true"
  target="_blank"
  rel="noopener noreferrer"
  className="flex justify-center items-center p-1 rounded-full bg-gray-800 hover:bg-white" // Apply background to the button container
>
  <Image
    alt="fiverr"
    width={18}
    height={18}
    src="/fiverr.png"
    className="object-cover" // Ensure the image fits within the container
  />
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
