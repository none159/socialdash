import { connectMongoDB } from "@/app/lib/mongodb";
import Group from "@/app/models/group";
import GroupMember from "@/app/models/groupmembers";

import {NextResponse} from "next/server"

export async function POST(req : Request,){
    try {  await connectMongoDB();
        
      
        const body = await req.json()
        const {id}= body

        const group = await Group.findOne({roomId : id})
        const memberCount = await GroupMember.countDocuments({ groupId : id });
        const groups={
            ...group,
             member: memberCount.toString(),
          };
        if (!group) {
            return NextResponse.json({ message: "Group not found" }, { status: 404 });
          }
      
        return NextResponse.json({message:groups},{status:200})
     
      
    
     
       
    } catch (error) {

        return NextResponse.json({message:"Something Wrong"},{status:500})
    }
}