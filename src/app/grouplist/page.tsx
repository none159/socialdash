"use client"
import Link from "next/link"
import { useEffect,useState } from "react"

const Grouplist = () => {
   const [resdata,setresdata] = useState<any>()
   const[loading,setloading]=useState(false)
    const fetchdata=async()=>{
        const res =  await fetch("api/grouplist")
         if(res.ok){
          const data = await res.json(); 
          setresdata(data.message)
     
     
         }
    }
    const handlejoin = async (id:string)=>{
      setloading(true)
      const res = await fetch("api/group/join",{
        method:"POST",
        body:JSON.stringify({id})
      })
      if(res.ok){
        fetchdata().then(()=>setloading(false))
      }
    }
    useEffect(()=>{
       fetchdata()
    },[])
  return (
   <section className="relative top-[100px] m-[10px] grid gap-[70px]">
     <h2 className="m-auto text-4xl text-gray-600 border border-gray-500 px-[20px] py-[10px] bg-gray-400">Group list : </h2>
         <div className="flex gap-[70px] flex-wrap place-content-center">
     {resdata?resdata.map((item: any,index: string | number)=>{

      return(
          <div className="bg-gray-600 rounded pb-[10px] shadow-black shadow-lg mx-auto">
            <div>
            <img className="w-[300px] rounded-t h-[300px] mb-2"   src={resdata[index].image?resdata[index].image:"no-image-icon-23485.png"}/>
              </div>
            <div className="grid place-items-ce nter gap-5">
                <h2 className="text-gray-900 text-2xl">{resdata[index].title}</h2>
                <h3><span className="text-gray-900">Created By : </span>{resdata[index].creator} </h3>
                <h3><span className="text-gray-900">Members : </span>{resdata[index].member} </h3>
                <div className="flex gap-5">
                  <button onClick={()=>handlejoin(resdata[index].roomId)} className="bg-gray-900 rounded px-[20px] py-[10px] hover:bg-white hover:text-gray-900 ease-in-out duration-[330ms] transition-all">{loading?"loading...":"Join"}</button>
                  <Link href={`./grouplist/description/${resdata[index].roomId}`} className="bg-gray-900 rounded px-[20px] py-[10px] hover:bg-white hover:text-gray-900 ease-in-out duration-[330ms] transition-all">Read Description</Link>
                </div>
              </div>
          </div>
      )
     })
        :""
}
{resdata! && resdata.length==0 ?<h2 className="text-gray-700 relative top-[100px]">No Group Available Right Now.</h2>:""}
</div>

   </section>
  )
}

export default Grouplist