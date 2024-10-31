import { connectMongoDB } from "@/lib/mongodb";
import user from "@/models/user";
import {NextResponse} from "next/server"
import bcrypt from 'bcrypt';
import { encrypt } from "@/lib/lib";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export async function POST(req : Request){
    try { const formData = await req.formData();
        await connectMongoDB();
  
        const data : {[key:string] : FormDataEntryValue}= {};
    
        const formDataEntries = Array.from(formData.entries());
        for (const [key, value] of formDataEntries) {
           
                data[key] = value.toString();
            
        }
       const email = data["email"]
       const U = await user.findOne({email})
       if(U == null){
        return NextResponse.json({message:"User Doesn't exist"},{status:201})
       }
       const password = data["password"]
       if(await bcrypt.compare(password.toString(),U.password)){
        const expires = new Date(Date.now() + 10 * 60 * 60 * 1000); 
        const User = {"email":U.email,"username":U.username}
        const session = await encrypt({ User , expires });
        cookies().set("session", session, { expires, httpOnly: true });
       return NextResponse.json({ message: "User Logged in",redirect:"/" }, { status: 200 });

       }
       else{  return NextResponse.json({message:"Wrong Password"},{status:201})}
    } catch (error) {
        return NextResponse.json({message:"Something Wrong"},{status:500})
    }
}