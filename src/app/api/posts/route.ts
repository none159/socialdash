import { connectMongoDB } from "@/app/lib/mongodb";
import Group from "@/app/models/group";
import GroupMember from "@/app/models/groupmembers";
import Posts from "@/app/models/posts";
import { jwtVerify } from "jose";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import {NextResponse} from "next/server"
import { v4 as uuidv4 } from 'uuid';
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