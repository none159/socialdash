"use client"; // Ensure this is included at the top for client-side components
import { useState ,useEffect} from "react";
import Link from 'next/link';
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); 
  const [transitionX, setTransitionX] = useState("-500px"); 
  const [isloggedin,setisloggedin]=useState(false)

  // Function to toggle the navbar's visibility
  const toggleNavbar = () => {
    setIsOpen(!isOpen);
    setTransitionX(isOpen ? "-500px" : "0px"); // Update the transitionX state
  };
  useEffect(() => {
    const session = document.cookie.split('; ').find(row => row.startsWith('session=')); // Look for the 'session' cookie
    if (session) {
      setisloggedin(true); // Set user as logged in if session exists
    }
  }, []);

  return (
    <div>
      {/* Button to toggle the navbar */}
      <button
        onClick={toggleNavbar}
        className="absolute top-2 left-2 bg-gray-800 p-3 rounded-full hover:bg-gray-700 transition-all duration-300"
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        )}
      </button>

      <nav
        className={`absolute top-[70px] left-0 shadow-gray-900 shadow-xl z-[1] duration-1000 transition-all ease-in-out rounded-sm bg-gray-950 w-[500px] p-[10px]`}
        style={{ transform: `translateX(${transitionX})` }} // Use inline style for transform
      >
        <ul className="grid gap-10 text-white place-items-center text-center font-sans">
         <Link href="/"><li className="cursor-pointer hover:text-gray-400 hover:duration-[250ms]">Home</li></Link>
          <Link href="/Post"><li className="cursor-pointer hover:text-gray-400 hover:duration-[250ms]">Post</li></Link>
          <Link href="/Ai"><li className="cursor-pointer hover:text-gray-400 hover:duration-[250ms]">AI Chat</li></Link>
          { isloggedin?<Link href="/Signin"><li className="cursor-pointer hover:text-gray-400 hover:duration-[250ms]">Sign In</li></Link>:""}
          
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
