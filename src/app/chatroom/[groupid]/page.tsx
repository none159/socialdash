"use client";

import Post from '@/app/components/post';
import { useEdgeStore } from '@/app/lib/edgestore';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface Grouptype {
  _id: string;
  creator: string;
  title: string;
  description: string;
  image: string;
  roomId: string;
  createdAt: Date;
}

interface PostType {
  _id: string;
  text: string;
  image: string;
  groupId: string;
  userId: string;
  createdAt: Date;
}

const Chatroom = () => {
  const { groupid } = useParams();
  const [text, setText] = useState('');
  const [posts, setPosts] = useState<PostType[]>([]);
  const [resdata, setResData] = useState<Grouptype>();
  const [selectedImg, setSelectedImg] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const { edgestore } = useEdgeStore();



 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/grouplist/byname', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: groupid }),
        });
        if (!res.ok) throw new Error(`Error fetching data: ${res.statusText}`);
        const data = await res.json();
        setResData(data.message._doc);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
    fetchData()
  }, [groupid]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ groupId: groupid }),
        });
        if (res.ok) {
          const data = await res.json();
          setPosts(data.message);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (groupid !== '') {
      const interval = setInterval(fetchPosts, 5000);
      return () => clearInterval(interval); // Cleanup
    }
  }, [groupid]);

  const sendMessage = async () => {
    if (!text && !file) return;

    try {
      let imageUrl = '';
      if (file) {
        const imgRes = await edgestore.myPublicImages.upload({ file });
        imageUrl = imgRes.url;
      }

      const res = await fetch('/api/posts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupId: groupid, text, imageurl: imageUrl }),
      });

      if (!res.ok) throw new Error(`Error sending message: ${res.statusText}`);
      setText('');
      setFile(null);
      setSelectedImg('');
    } catch (error) {
      console.error('Send message error:', error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImg(reader.result as string);
      reader.readAsDataURL(uploadedFile);
    }
  };

  return (
    <section className="relative top-[250px] grid gap-[100px] place-content-center">
      {resdata?.title ? (
        <h2 className="text-gray-600 m-auto text-4xl border border-gray-600 px-[30px] py-[10px]">
          {resdata.title}
        </h2>
      ) : (
        <h2 className="text-gray-600 m-auto text-4xl">Loading...</h2>
      )}

      <div className="w-[1200px] p-4 text-white bg-gray-800 rounded mb-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-[100px] resize-none p-2 bg-gray-800 outline-none border-none rounded"
          placeholder="What's on your mind?"
        ></textarea>
        {selectedImg && (
          <div className="mt-4">
            <Image
              src={selectedImg}
              alt="Selected"
              width="300"
              height="300"
              className="object-cover w-full h-full rounded-lg"
            />
          </div>
        )}
        <div className="mt-2">
          <label
            htmlFor="imageUpload"
            className="cursor-pointer flex items-center gap-2 text-gray-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5L12 15m0 0l-4.5-4.5M12 15V3m4.5 7.5h4.125a1.125 1.125 0 011.125 1.125v9.75A1.125 1.125 0 0120.625 22.5H3.375A1.125 1.125 0 012.25 21.375v-9.75a1.125 1.125 0 011.125-1.125H7.5"
              />
            </svg>
            Add Photo
          </label>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        <button
          onClick={sendMessage}
          className="mt-2 bg-gray-600 px-[40px] hover:bg-white duration-[350ms] ease-in-out hover:text-gray-600 text-white p-2 rounded"
        >
          Post
        </button>
      </div>

      <div
        className="w-full h-[200vh] p-4 text-white rounded overflow-hidden overflow-y-scroll"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {Array.isArray(posts) &&
          posts.map((post) => <Post key={post._id} post={post} />)}
      </div>
    </section>
  );
};

export default Chatroom;
