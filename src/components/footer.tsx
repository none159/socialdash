import { FaLinkedin, FaGithub } from "react-icons/fa";
import { SiVercel } from "react-icons/si";
const Footer = () => {
  return (
    <footer className="p-[30px] shadow-gray-900 shadow-xl bg-gray-950 font-sans text-white relative top-[100vh]">
      <div className="flex justify-between w-[90%] items-center">
        <div className="grid gap-7">
          <a className="cursor-pointer hover:underline">Home</a>
          <a className="cursor-pointer hover:underline">AI Chat</a>
          <a className="cursor-pointer hover:underline">Post</a>
          <a className="cursor-pointer hover:underline">Sign In</a>
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
