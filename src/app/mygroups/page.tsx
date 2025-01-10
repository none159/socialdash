"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

interface GroupData {
  image: string;
  title: string;
  creator: string;
  member: number;
  roomId: string;
}

const MyGroups = () => {
  const [resdata, setResData] = useState<GroupData[] | null>(null);

  const handleLeave = async (roomId: string) => {
    const res = await fetch("api/group/leave", {
      method: "POST",
      body: JSON.stringify({ id: roomId }),
    });
    if (res.ok) {
      fetchData();
    }
  };

  const fetchData = async () => {
    const res = await fetch("api/group/my");
    if (res.ok) {
      const data = await res.json();
      setResData(data.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section className="relative top-[100px] m-[10px] grid gap-[70px]">
      <h2 className="m-auto text-4xl text-gray-600 border border-gray-500 px-[20px] py-[10px] bg-gray-400">
        My Groups :
      </h2>
      <div className="flex gap-[70px] flex-wrap place-content-center">
        {resdata ? (
          resdata.map((item, index) => (
            <div
              key={item.roomId || index}
              className="bg-gray-600 rounded pb-[10px] shadow-black shadow-lg mx-auto"
            >
              <div>
                <Image
                  className="w-[350px] rounded-t h-[300px] mb-2"
                  src={item.image || "/no-image-icon-23485.png"}
                  alt={item.title}
                  width={350}
                  height={300}
                />
              </div>
              <div className="grid place-items-center gap-5">
                <h2 className="text-gray-900 text-2xl">{item.title}</h2>
                <h3>
                  <span className="text-gray-900">Created By : </span>
                  {item.creator}
                </h3>
                <h3>
                  <span className="text-gray-900">Members : </span>
                  {item.member}
                </h3>
                <div className="flex gap-3">
                  <Link
                    href={`/chatroom/${item.roomId}`}
                    className="bg-gray-900 rounded px-[20px] py-[10px] hover:bg-white hover:text-gray-900 ease-in-out duration-[330ms] transition-all"
                  >
                    Chat
                  </Link>
                  <Link
                    href={`./grouplist/description/${item.roomId}`}
                    className="bg-gray-900 rounded px-[20px] py-[10px] hover:bg-white hover:text-gray-900 ease-in-out duration-[330ms] transition-all"
                  >
                    Read Description
                  </Link>
                  <button
                    onClick={() => handleLeave(item.roomId)}
                    className="bg-gray-900 rounded px-[20px] py-[10px] hover:text-white hover:bg-green-600 ease-in-out duration-[330ms] transition-all"
                  >
                    Leave
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <h2 className="text-gray-700 relative top-[100px]">
            Group Inventory Is Empty. Join Some Groups.
          </h2>
        )}
      </div>
    </section>
  );
};

export default MyGroups;
