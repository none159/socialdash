import {SignJWT,jwtVerify} from "jose"
import { JWTExpired } from "jose/errors";
import { cookies } from "next/headers";
import { NextRequest,NextResponse } from "next/server";

const secretkey = process.env.SECRETKEY

const key = new TextEncoder().encode(secretkey)

export async function encrypt(payload:any){
    return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" }) 
    .setIssuedAt() 
        .setExpirationTime("10 hours from now") 
        .sign(key);
}
export async function decrypt(input:string):Promise<any>{
    const session =  cookies().get("session")?.value
    if(session){
        try{
    const { payload } = await jwtVerify(input, key, {
        algorithms: ["HS256"],
      }).catch();
      return payload;
    }catch(error){
        if(error instanceof JWTExpired){
            const res = NextResponse.next()
            res.cookies.set("session", "", {
                expires: new Date(0), // Set expiration to a past date to delete the cookie
                httpOnly: true, // Optional: keeps it HttpOnly
            });
            return null
        }
    }
    }
    else{return }
}
export async function getsession(){
  const session = cookies().get("session")?.value
  if(!session)return null;
  return await decrypt(session)
}
export async function updatesession(request:NextRequest){
const session =  cookies().get("session")?.value
if(!session) return
const parsed =  await decrypt(session)
if(parsed){
parsed.expires = new Date(Date.now() + 10 * 60 * 60 * 1000)
const res = NextResponse.next()
res.cookies.set("session",session,{
    httpOnly:true,
    expires:parsed.expires,
    path:"*"
})
return res;
}
}
export async function logout() {

        cookies().set("session", "", { expires: new Date(0), path: '/' }); // Set path to '/' to match the original cookie
    
    
  }
  