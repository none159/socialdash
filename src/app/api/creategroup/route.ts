import { connectMongoDB } from "@/app/lib/mongodb";
import Group from "@/app/models/group";
import GroupMember from "@/app/models/groupmembers";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import {NextResponse} from "next/server"
import { v4 as uuidv4 } from 'uuid';
interface UserPayload {
    username: string;
  }
  
export async function POST(req : Request){
    try { const formData = await req.formData();
        await connectMongoDB();
  
        const data : {[key:string] : FormDataEntryValue}= {};
    
        const formDataEntries = Array.from(formData.entries());
        for (const [key, value] of formDataEntries) {
          
                data[key] = value.toString();
            
        }
       const session =  cookies().get("session")?.value
       const secretkey = process.env.SECRETKEY
        const key = new TextEncoder().encode(secretkey)
       const { payload } = await jwtVerify(session!, key, {
        algorithms: ["HS256"],
       })

       let roomid= uuidv4()
       const roomidexist = await Group.findOne({roomid})?true:false
       while(roomidexist){
         roomid= uuidv4()
        
       }
       const userPayload = (payload.User as unknown) as UserPayload;
       const username = userPayload.username;
        await Group.create({creator:username,...data,roomId:roomid})  
        await GroupMember.create({userId:username,groupId: roomid,Role:"admin"})
        return NextResponse.json({message:"success"},{status:200})
     
      
    
     
       
    } catch (error) {

        return NextResponse.json({message:error},{status:500})
    }
}