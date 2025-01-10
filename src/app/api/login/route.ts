import { connectMongoDB } from "@/app/lib/mongodb";
import user from "@/app/models/user";
import {NextResponse} from "next/server"
import bcrypt from 'bcrypt';
import { encrypt } from "@/app/lib/lib";
import { cookies } from "next/headers";
import nodemailer from 'nodemailer';
import { SignJWT } from "jose";
export async function POST(req : Request){
    try { const formData = await req.formData();
        await connectMongoDB();
        const secretkey = process.env.SECRETKEY;
        const key = new TextEncoder().encode(secretkey);
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
        if(U.emailVerified){
        const expires = new Date(Date.now() + 10 * 60 * 60 * 1000); 
        const User = {"email":U.email,"username":U.username}
        const session = await encrypt({ User , expires });
        cookies().set("session", session, { expires, httpOnly: true });
       return NextResponse.json({ message: "User Logged in",redirect:"/" }, { status: 200 });
        }else{
            const U = await user.findOne({email})
            if (U && U.tokenExpiry) {
                const currentTime = new Date().getTime(); // Get the current time in milliseconds
                const tokenExpiryTime = new Date(U.tokenExpiry).getTime();
            
                if (currentTime > tokenExpiryTime) {
                    const verificationToken = await new SignJWT({ email: email })
                    .setProtectedHeader({ alg: 'HS256' })
                    .setExpirationTime('1h') // Token expires in 1 hour
                    .sign(key);
              
              
                    U.verificationToken = verificationToken;
                    U.emailVerified=false
                    U.tokenExpiry = new Date().getTime() + 3600000; // Token expires in 1 hour
                    await U.save();
                    U.verificationToken = verificationToken;
                    U.tokenExpiry = new Date().getTime() + 3600000; // Token expires in 1 hour
                    await U.save();
              
                    // Send verification email with the token
                    const transporter = nodemailer.createTransport({
                      service: "Gmail", 
                      auth: {
                        user: process.env.APP_EMAIL,
                        pass: process.env.APP_PASSWORD,
                      },
                    });
              
                    const mailOptions = {
                      from: process.env.APP_EMAIL,
                      to: email as string, 
                      subject: "Verify your new email address",
                      text: `Click the following link to verify your new email address: localhost:3000/verify-email?token=${verificationToken}`,
                    };
              
                   await transporter.sendMail(mailOptions);
                  return NextResponse.json(
                    { message: "Verification token has expired. We requested a new one." },
                    { status: 400 }
                  );
                }
              
            else{
              return NextResponse.json(
                { message: "User Still Not Verified" },
                { status: 500 }
              );
            }
        }
        }
       }
       else{  return NextResponse.json({message:"Wrong Password"},{status:500})}
    } catch (error) {
      console.error(error);
        return NextResponse.json({message:"Something Wrong"},{status:500})
    }
}