"use client";

import { useRef, useState } from "react";
import { useEdgeStore } from "../lib/edgestore";
import Image from "next/image";

const Creategroup = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedImg, setSelectedImg] = useState<string>("");
  const [f, setF] = useState<File>();
  const { edgestore } = useEdgeStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setF(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImg(reader.result as string);
      };

      reader.readAsDataURL(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (f) {
      if (formRef.current) {
        const formData = new FormData(formRef.current);

        try {
          const res = await edgestore.myPublicImages.upload({ file: f });

          if (!res || !res.url || !res.thumbnailUrl) {
            console.error("Invalid upload response", res);
            return;
          }

          console.log("Uploaded image URL:", res.url);

          formData.append("image", res.url);

          const response = await fetch("/api/creategroup", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            console.error("Error creating group", await response.text());
          }
        } catch (err) {
          console.error("Error during submission:", err);
        }
      }
    } else {
      if (formRef.current) {
        const formData = new FormData(formRef.current);
        const response = await fetch("/api/creategroup", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          console.error("Error creating group", await response.text());
        }
      }
    }
  };

  return (
    <section className="relative top-[200px] text-center bg-gray-600 p-[20px] rounded m-10 shadow-black shadow-md">
      <h1 className="text-2xl mx-auto mb-[50px] border border-gray-500 font-light px-[20px] shadow-gray-800 shadow-inner py-[10px] w-fit">
        Create Your Group
      </h1>
      <form className="flex justify-evenly gap-10" ref={formRef} onSubmit={handleSubmit}>
        <div
          className={`h-[300px] w-[300px] rounded text-center ${
            !f ? "border border-white" : ""
          }`}
        >
          Upload Your Image*
          <input
            name="img"
            ref={fileInputRef}
            className="opacity-0 w-[300px] cursor-pointer h-[300px]"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          {selectedImg && (
            <Image
              src={selectedImg}
              onClick={() => {
                setSelectedImg("");
                setF(undefined);
              }}
              alt="Selected Preview"
              className="absolute z-[1] top-[125px] left-[148px] h-[300px] w-[300px] object-cover rounded"
            />
          )}
        </div>
        <div className="grid items-center place-items-center gap-[40px]">
          <h3>Group Title: </h3>
          <input
            required
            name="title"
            className="w-[450px] py-[5px] rounded bg-gray-700 outline-none border-none"
          />
          <h3>Group Description:</h3>
          <input
            required
            name="description"
            className="w-[450px] py-[5px] rounded bg-gray-700 outline-none border-none"
          />
          <button
            className="px-[70px] py-[10px] rounded bg-gray-700 hover:bg-white hover:text-gray-700 ease-in-out duration-[350ms] transition-all"
            type="submit"
          >
            Create
          </button>
        </div>
      </form>
    </section>
  );
};

export default Creategroup;
