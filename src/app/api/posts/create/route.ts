import { connectMongoDB } from "@/app/lib/mongodb";
import Posts from "@/app/models/posts";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { groupId, text ,imageurl} = body;

        if (!groupId || !text) {
            return NextResponse.json({ message: "Invalid input" }, { status: 400 });
        }

        await connectMongoDB();

        const session = cookies().get("session")?.value;
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const secretkey = process.env.SECRETKEY;
        if (!secretkey) {
            throw new Error("SECRETKEY is not defined in environment variables");
        }

        const key = new TextEncoder().encode(secretkey);

        const { payload } = await jwtVerify(session, key, {
            algorithms: ["HS256"],
        });

        const {username} : any = payload.User;
        if (!username) {
            return NextResponse.json({ message: "Invalid token payload" }, { status: 401 });
        }
        let post
        if(imageurl){
             post = await Posts.create({
                groupId,
                userId: username,
                image:imageurl,
                text,
            });
        }
        else{
         post = await Posts.create({
            groupId,
            userId: username,
            text,
        });
    }

        return NextResponse.json({ message: "Post created successfully", post }, { status: 200 });
    } catch (error: any) {
        console.error("Error in POST handler:", error.message);
        return NextResponse.json({ message: "Something went wrong", error: error.message }, { status: 500 });
    }
}
