"use client";
import React, { useEffect, useRef, useState } from "react";
import { useEdgeStore } from "../lib/edgestore";
import { FaSpinner, FaTimes, FaUpload } from "react-icons/fa"; // Font Awesome Icon

interface User {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  image?: string;
}

const Profile = () => {
  const [resdata, setResData] = useState<User | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImg, setSelectedImg] = useState<string>("");
  const [loading,setloading]=useState(false)
  const[email,setemail]=useState<string>("")
  const [username,setusername]=useState<string>("")
  const[password,setpassword]=useState<string>("")
  const[verified,setverified]=useState(true)
  const[oldpassword,setoldpassword]=useState<string>("")
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
    const updates: any = {};
    if (file) {
        const res = await edgestore.myPublicImages.upload({ file: file! });
        const imageUrl = res.url;
        updates.imageUrl = imageUrl;
    }
          if (username) updates.username = username;
          if (oldpassword) updates.oldpassword = oldpassword;
          if (email){ 
            setverified(false)
            updates.email = email;}
          if (password) updates.password = password;
        
   
          try {

          if(updates){
            const response = await fetch("/api/profile/update", {
              method: "POST",
              body: JSON.stringify(updates),
              headers: { "Content-Type": "application/json" },
            });
        
            if (response.ok) {
              const data = await response.json();
              setisupdated(true);
              setResData(data.user);
              setpassword("")
              setoldpassword("")
              setemail("")
              fetchData()
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
        setloading(false)
        const data = await res.json();
        setResData(data.message);
        setusername(data.message.username)
         setemail(data.message.email)
        if (data.message?.image) {
          setSelectedImg(data.message.image);
        }
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  useEffect(() => {
    setloading(true)
    fetchData();
  }, []);

  return (
    <section className="relative bg-gray-500 w-fit px-[300px] py-[30px] mx-auto top-[200px] grid place-items-center gap-[130px] rounded shadow-black shadow-lg">
      <h1 className="m-auto text-4xl text-gray-600 border border-gray-600 px-[20px] py-[10px]  shadow-gray-700 shadow-md rounded">
        Profile
      </h1>
      <div className="grid place-items-center text-center gap-[40px]">
        {/* Image Upload Section */}
        <div>
          <div
            className={`h-[300px] w-[300px] rounded-full text-center ${
              !file ? "border border-white" : ""
            } relative`}
          >
            
            
            {
  loading==false ? (
    !selectedImg ? (
      <FaUpload
        size={50}
        className="text-gray-400 absolute z-[0] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
      />
    ) : (
      <FaTimes
        className="absolute top-2 right-2 z-[1] text-gray-400 cursor-pointer"
        onClick={() => {
          setSelectedImg("");
          setFile(null);
        }}
      />
    )
  ) : (
    <FaSpinner 
      className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin text-gray-600 text-4xl" 
    />
  )
}
{
  !loading ? (
    <>
      <input
        name="img"
        ref={fileInputRef}
        className="opacity-0 w-[300px] cursor-pointer rounded-full h-[300px]"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
      {selectedImg && (
        <img
          src={selectedImg}
          alt="Selected Preview"
          className="absolute z-[1] top-[0px] h-[300px] w-[300px] object-center rounded-full"
        />
      )}
    </>
  ) : (
    ""
  )
}

          </div>
        </div>
        {/* Profile Information Section */}
      <div className="grid gap-[50px]">
      <div className="flex items-center gap-[10px]">
  <label className="text-gray-600 text-2xl">Username: </label>
  <input
    type="text"
    value={username}
    onChange={(e) => setusername(e.target.value)}
    className="border text-black rounded px-[10px] py-[5px] text-xl"
  />
</div>

          <h3 className="text-2xl">
            <span className="text-gray-600">First name: </span>
            {resdata?.firstname}
          </h3>
          <h3 className="text-2xl">
            <span className="text-gray-600">Last name: </span>
            {resdata?.lastname}
          </h3>
          <label className="text-gray-600 text-2xl">Email: </label>
          <input
    type="email"
    value={email}
    onChange={(e) => setemail(e.target.value)}
    className="border text-black rounded px-[10px] py-[5px] text-xl"
  />
          <div className="grid gap-10">
  <label className="text-gray-600 text-2xl">Old Password: </label>
  <input
    type="password"
    value={oldpassword}
    onChange={(e) => setoldpassword(e.target.value)}
    className="border text-black rounded px-[10px] py-[5px] text-xl"
  />
   <label className="text-gray-600 text-2xl">New Password: </label>
  <input
    type="password"
    value={password}
    onChange={(e) => setpassword(e.target.value)}
    className="border text-black rounded px-[10px] py-[5px] text-xl"
  />
</div>
        </div>

      </div>
    <button className="bg-gray-700 rounded px-[30px] py-[10px] ease-in-out duration-[350ms] hover:bg-white hover:text-gray-700" onClick={handleChanges}>Save</button>
      {isupdated && verified ? <h2 className="bg-green-600 rounded text-white p-5">Updated</h2> : ""}
      {!verified&&<h2 className="bg-yellow-600 rounded text-white p-5">Verify Email</h2>}
    </section>
  );
};

export default Profile;
