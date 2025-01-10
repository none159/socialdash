import { connectMongoDB } from "@/app/lib/mongodb";
import Group from "@/app/models/group";
import GroupMember from "@/app/models/groupmembers";
import { jwtVerify } from "jose";

import { cookies } from "next/headers";

import {NextResponse} from "next/server"
interface GroupType {
    roomId: string;
    title: string;
    creator: string;
    image: string;
    member: string;
  }
export async function GET(_ : Request){
    try { 
        await connectMongoDB();
        const session =  cookies().get("session")?.value
        const secretkey = process.env.SECRETKEY
         const key = new TextEncoder().encode(secretkey)
        const { payload } = await jwtVerify(session!, key, {
         algorithms: ["HS256"],
        })
        const {username} :any = payload.User
        const groups: GroupType[] = [];
   
        const grouplist = await Group.find({}).exec()
        for (const item of grouplist) {


            const { roomId, title, creator, image } = item;
            const memberexist = await GroupMember.findOne({ groupId : roomId,userId: username});

            if(!memberexist){
            // Get the count of members for this group
            const memberCount = await GroupMember.countDocuments({ groupId : roomId });
        
            // Push the formatted data into the groups array
            groups.push({
              roomId,
              title,
              creator,
              image,
              member: memberCount.toString(),
            });
        }
          }
      

        if(!groups) return NextResponse.json({message:"Data didn't fetch"},{status:500})
        return NextResponse.json({message:groups},{status:200})
     
      
    
     
       
    } catch (error) {
       console.log(error)
        return NextResponse.json({message:"Something Wrong"},{status:500})
    }
}