import { connectMongoDB } from "@/app/lib/mongodb";


import Posts from "@/app/models/posts";

import {NextResponse} from "next/server"

export async function POST(req : Request){
    try {
        await connectMongoDB();
        const body = await req.json()
        const {groupId}= body
        const posts = await Posts.find({groupId})
        return NextResponse.json({message:posts},{status:200})
     
      
    
     
       
    } catch (error) {

        return NextResponse.json({message:"Something Wrong"},{status:500})
    }
}