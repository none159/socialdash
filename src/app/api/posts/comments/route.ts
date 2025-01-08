import { connectMongoDB } from "@/app/lib/mongodb";
import Comments from "@/app/models/comments";
import Posts from "@/app/models/posts";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
      await connectMongoDB();
      const body = await req.json();
      const { _id, groupId, userId,comment } = body;
  
      if (!comment) {
        return NextResponse.json({ message: "Comment cannot be empty" }, { status: 400 });
      }
    
    const session =  cookies().get("session")?.value
    const secretkey = process.env.SECRETKEY
     const key = new TextEncoder().encode(secretkey)
    const { payload } = await jwtVerify(session!, key, {
     algorithms: ["HS256"],
    })
    const {username} : any  = payload.User
      const newComment = await Comments.create({
        groupId,
        postId: _id,
        userId :username,
        comment,
      });
  
      return NextResponse.json({ message: "Comment added successfully", comment: newComment }, { status: 200 });
    } catch (error) {
      console.error("Error adding comment:", error);
      return NextResponse.json({ message: "Something went wrong", error: error }, { status: 500 });
    }
  }
  


export async function GET(req:Request) {
  try {
    await connectMongoDB(); // Connect to MongoDB
    const url = new URL(req.url);
    const postId = url.searchParams.get("postId");

    if (!postId) {
      return NextResponse.json(
        { message: "Post ID is required" },
        { status: 400 }
      );
    }

    // Fetch comments sorted by creation date
    const comments = await Comments.find({ postId }).sort({ createdAt: -1 });

    return NextResponse.json({ comments }, { status: 200 });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { message: "Something went wrong", error },
      { status: 500 }
    );
  }
}