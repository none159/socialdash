import { NextRequest, NextResponse } from "next/server";
import { decrypt, updatesession } from "./app/lib/lib";

export default async function middleware(request: NextRequest){
    const { pathname } = request.nextUrl;


    const excludePaths = ['/verify-email'];  
  
  
    if (excludePaths.includes(pathname)) {
      return NextResponse.next();  
    }
    const session = request.cookies.get("session")?.value
    const isloginpage = request.nextUrl.pathname != "/Signin"
    const isregisterpage = request.nextUrl.pathname != "/Signup"
    if (request.nextUrl.pathname.startsWith('/_next/') || request.nextUrl.pathname.startsWith('/api/')) {
        return NextResponse.next(); // Allow access to Next.js internals
    }
    if(session == undefined && (isloginpage && isregisterpage)){
        return NextResponse.redirect(new URL('/Signin',request.url))
    }
    
    const payload = await decrypt(session!)
    if(payload == null && (isloginpage && isregisterpage)){
        return NextResponse.redirect(new URL('/Signin', request.url));
    }
    if(payload!=null &&(!isloginpage || !isregisterpage)){
        return NextResponse.redirect(new URL('/', request.url));
    }    
    return updatesession(request);
}
