import { createContext,useContext,useEffect,useRef, useState } from "react";


const SocketContext = createContext(null)

export const useSocket = ()=>{
    return useContext(SocketContext)
}
export const SocketProvide = ({children}:any)=>{
const socket = useRef()
const [userInfo,setuserInfo]=useState()

 useEffect(()=>{
   if(userInfo){

   }
 },[])
}