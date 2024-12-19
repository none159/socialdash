"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const VerifyEmail = () => {
  const [message, setMessage] = useState<string>("");
 const [token,settoken]=useState("")

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    settoken(urlParams.get('token')!) 

    if (token) {
      // Call the verification API
      fetch(`/api/verify-email?token=${token}`)
        .then((res) => res.json())
        .then((data) => setMessage(data.message))
        .catch((error) => setMessage("Error verifying email"));
    }
  }, [token]);

  return (
    <div className="grid place-items-center bg-green-500 p-10">
      <h1>Email Verification</h1>
      <p>{message}</p>
    </div>
  );
};

export default VerifyEmail;
