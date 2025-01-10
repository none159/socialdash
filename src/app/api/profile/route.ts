import { connectMongoDB } from "@/app/lib/mongodb";
import user from "@/app/models/user";
import {NextResponse} from "next/server"
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
export async function GET(){
    try {
        await connectMongoDB();
        const session =  cookies().get("session")?.value
        const secretkey = process.env.SECRETKEY
         const key = new TextEncoder().encode(secretkey)
        const { payload } = await jwtVerify(session!, key, {
         algorithms: ["HS256"],
        })
        const { email } = payload.User as {email:string };
        const User = await user.findOne({email})
        if(User){
        return NextResponse.json({message:User},{status:200})
        }
        else{
            return NextResponse.json({message:"User not found"},{status:500})
        }
    
     

    } catch (error) {
        console.error(error)
        return NextResponse.json({message:"Something Wrong"},{status:500})
    }
}