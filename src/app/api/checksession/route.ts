import { decrypt } from "@/lib/lib";
import {  NextApiRequest, NextApiResponse } from "next";

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    const {session}  = req.body
    if(!session){
        return res.status(400).json({error:"no session provided"})
    }
    try {
        const payload = await decrypt(session)
        if(payload){
            return res.status(200).json({session:payload})
        }
        else{
            return res.status(401).json({error:"invalid session"})
        }
    } catch (error) {
        res.status(500).json({error:"Failed to verify session"})
    }
}