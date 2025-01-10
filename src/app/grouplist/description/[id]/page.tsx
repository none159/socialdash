"use client"
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
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

const Description = () => {
  const [resdata, setresdata] = useState<Grouptype>();
  const [members, setmembers] = useState<any>();
  const { id } = useParams();

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await fetch('/api/grouplist/byname', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });

        if (!res.ok) {
          throw new Error(`Error fetching data: ${res.statusText}`);
        }

        const data = await res.json();
        if (data) {
          setresdata(data.message._doc);
          setmembers(data.message.member);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchdata();
  }, [id]); // Added 'id' as a dependency to ensure the effect runs when `id` changes

  return (
    <section className='relative top-[200px] grid gap-[100px]'>
      <h1 className='m-auto text-4xl text-light text-gray-500 border border-gray-600 px-[20px] py-[10px] shadow-gray-400 animate-pulse shadow-md'>
        Group Info
      </h1>
      <div className='flex justify-evenly align-middle gap-10'>
        <div>
          {resdata?.image && (
            <Image
              className="w-[300px] h-[300px] rounded border border-gray-500 shadow-black shadow-sm"
              src={resdata.image}
              alt="Group Image" // Added alt text for accessibility
              width={300}
              height={300}
            />
          )}
        </div>
        <div className='grid gap-10 place-items-center'>
          <h2 className='text-2xl'>
            <span className='text-gray-600'>Title: </span>{resdata?.title}
          </h2>
          <h3 className='text-xl'>
            <span className='text-gray-600'>Creator: </span>{resdata?.creator}
          </h3>
          <h4 className='text-xl'>
            <span className='text-gray-600'>Description: </span>{resdata?.description}
          </h4>
          <h5 className='text-xl'>
            <span className='text-gray-600'>Members: </span>{members}
          </h5>
        </div>
      </div>
    </section>
  );
};

export default Description;
