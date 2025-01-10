import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

// Define the Group type to avoid using 'any'
interface Group {
  roomId: string;
  image: string;
  title: string;
  creator: string;
  member: number;
}

const Grouplist = () => {
  const [resdata, setresdata] = useState<Group[]>([]); // State for group list
  const [loading, setloading] = useState(false);

  const fetchdata = async () => {
    const res = await fetch("api/grouplist");
    if (res.ok) {
      const data = await res.json();
      setresdata(data.message);
    }
  };

  const handlejoin = async (id: string) => {
    setloading(true);
    const res = await fetch("api/group/join", {
      method: "POST",
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      fetchdata().then(() => setloading(false));
    }
  };

  useEffect(() => {
    fetchdata();
  }, []);

  return (
    <section className="relative top-[100px] m-[10px] grid gap-[70px]">
      <h2 className="m-auto text-4xl text-gray-600 border border-gray-500 px-[20px] py-[10px] bg-gray-400">
        Group list:
      </h2>
      <div className="flex gap-[70px] flex-wrap place-content-center">
        {resdata.length > 0 ? (
          resdata.map((item: Group) => {
            return (
              <div
                key={item.roomId} // Added key prop
                className="bg-gray-600 rounded pb-[10px] shadow-black shadow-lg mx-auto"
              >
                <div>
                  <Image
                    className="w-[300px] rounded-t h-[300px] mb-2"
                    src={item.image ? item.image : "/no-image-icon-23485.png"}
                    alt="Group Image" // Added alt text for accessibility
                    width={300}
                    height={300}
                  />
                </div>
                <div className="grid place-items-center gap-5">
                  <h2 className="text-gray-900 text-2xl">{item.title}</h2>
                  <h3>
                    <span className="text-gray-900">Created By: </span>
                    {item.creator}
                  </h3>
                  <h3>
                    <span className="text-gray-900">Members: </span>
                    {item.member}
                  </h3>
                  <div className="flex gap-5">
                    <button
                      onClick={() => handlejoin(item.roomId)}
                      className="bg-gray-900 rounded px-[20px] py-[10px] hover:bg-white hover:text-gray-900 ease-in-out duration-[330ms] transition-all"
                    >
                      {loading ? "loading..." : "Join"}
                    </button>
                    <Link
                      href={`./grouplist/description/${item.roomId}`}
                      className="bg-gray-900 rounded px-[20px] py-[10px] hover:bg-white hover:text-gray-900 ease-in-out duration-[330ms] transition-all"
                    >
                      Read Description
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <h2 className="text-gray-700 relative top-[100px]">
            No Group Available Right Now.
          </h2>
        )}
      </div>
    </section>
  );
};

export default Grouplist;
