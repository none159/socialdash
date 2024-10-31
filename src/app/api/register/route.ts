import { connectMongoDB } from "@/lib/mongodb";
import user from "@/models/user";
import {NextResponse} from "next/server"
import bcrypt from 'bcrypt';
export async function POST(req : Request){
    try { const formData = await req.formData();
        await connectMongoDB();
  
        const data : {[key:string] : FormDataEntryValue}= {};
    
        const formDataEntries = Array.from(formData.entries());
        for (const [key, value] of formDataEntries) {
            if (key === "password") {
                // Await bcrypt.hash for the password field
                data[key] = await bcrypt.hash(value.toString(), 10);
            } else {
                data[key] = value.toString();
            }
        }
        const {email} = data
       const userexist = await user.findOne({email})?true:false 

       if(!userexist){
       await user.create(data)
       return NextResponse.json({message:"User Registered",redirect:"/Signin"},{status:201})
       }
       else{
        return NextResponse.json({message:"User Already Exists"},{status:201})
       }
       
    } catch (error) {
        return NextResponse.json({message:"Error"},{status:500})
    }
}