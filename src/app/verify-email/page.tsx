"use client"
import { useEffect, useState } from "react";

const VerifyEmail = () => {
  const [message, setMessage] = useState<string>("");
  const [token, setToken] = useState<string>("");

  // Extract the token from the URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, []);

  // Verify email when token is available
  useEffect(() => {
    if (token) {
      fetch(`/api/verify-email?token=${token}`)
        .then((res) => res.json())
        .then((data) => setMessage(data.message))
        .catch(() => setMessage("Error verifying email"));
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
