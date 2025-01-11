"use client";

import React, { useEffect, useRef, useState } from "react";
import { useEdgeStore } from "../lib/edgestore";
import { FaSpinner, FaTimes, FaUpload } from "react-icons/fa";
import Image from "next/image";

interface Updates {
  firstname?: string;
  lastname?: string;
  username?: string;
  oldpassword?: string;
  email?: string;
  password?: string;
  imageUrl?: string;
}

const Profile = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImg, setSelectedImg] = useState<string>("");
  const [loading, setloading] = useState(false);
  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [email, setemail] = useState<string>("");
  const [username, setusername] = useState<string>("");
  const [password, setpassword] = useState<string>("");
  const [verified, setverified] = useState(true);
  const [oldpassword, setoldpassword] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const { edgestore } = useEdgeStore();
  const [isupdated, setisupdated] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImg(reader.result as string);
      };
      reader.readAsDataURL(uploadedFile);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleChanges = async () => {
    const updates: Updates = {};
    if (file) {
      const res = await edgestore.myPublicImages.upload({ file: file! });
      const imageUrl = res.url;
      updates.imageUrl = imageUrl;
    }
    if (firstname) updates.firstname = firstname;
    if (lastname) updates.lastname = lastname;
    if (username) updates.username = username;
    if (oldpassword) updates.oldpassword = oldpassword;
    if (email) {
      setverified(false);
      updates.email = email;
    }
    if (password) updates.password = password;

    try {
      if (Object.keys(updates).length > 0) {
        const response = await fetch("/api/profile/update", {
          method: "POST",
          body: JSON.stringify(updates),
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          const data = await response.json();
          setisupdated(true);
          setpassword("");
          setoldpassword("");
          setemail("");
          fetchData();
        } else {
          console.error("Failed to update profile.");
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const fetchData = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        setloading(false);
        const { message } = await res.json();
        setusername(message.username);
        setFirstname(message.firstname);
        setLastname(message.lastname);
        setemail(message.email);
        if (message?.image) {
          setSelectedImg(message.image);
        }
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  useEffect(() => {
    setloading(true);
    fetchData();
  }, []);

  return (
    <section className="relative bg-gray-500 max-w-3xl px-8 py-10 mx-auto top-24 grid gap-10 rounded-lg shadow-lg">
      <h1 className="text-4xl text-gray-700 font-bold text-center border-b border-gray-400 pb-4">
        Profile
      </h1>
      <div className="flex flex-col items-center gap-5">
        <div className="relative grid gap-10">
          <div
            className={`h-48 w-48 rounded-full overflow-hidden border ${
              !file ? "border-gray-300" : "border-transparent"
            }`}
          >
            {loading ? (
              <FaSpinner className="text-gray-600 text-4xl animate-spin absolute inset-0 m-auto" />
            ) : selectedImg ? (
              <Image
                src={selectedImg}
                alt="Selected"
                className="object-cover h-full w-full"
              />
            ) : (
              <FaUpload className="text-gray-400 text-4xl absolute inset-0 m-auto cursor-pointer" />
            )}
          </div>
          {!loading && (
            <input
              type="file"
              ref={fileInputRef}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
            />
          )}
          {selectedImg && (
            <FaTimes
              className="absolute top-2 right-2 text-gray-600 cursor-pointer"
              onClick={() => {
                setSelectedImg("");
                setFile(null);
              }}
            />
          )}
          <div className="flex gap-2 mx-auto text-2xl text-gray-700">
            <h2>{firstname}</h2>
            <h2>{lastname}</h2>
          </div>
        </div>
        <div className="w-full grid gap-6">
          <div>
            <label className="block text-gray-700 text-lg">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 text-gray-700"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-lg">Old Password:</label>
            <input
              type="password"
              value={oldpassword}
              onChange={(e) => setoldpassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 text-gray-700"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-lg">New Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 text-gray-700"
            />
          </div>
        </div>
      </div>
      <button
        className="w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-300"
        onClick={handleChanges}
      >
        Save
      </button>
      {isupdated && verified && (
        <h2 className="text-green-600 text-center">Profile updated successfully.</h2>
      )}
      {!verified && (
        <h2 className="text-yellow-600 text-center">Please verify your email.</h2>
      )}
    </section>
  );
};

export default Profile;
