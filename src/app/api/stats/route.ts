import { connectMongoDB } from "@/app/lib/mongodb";
import Comments from "@/app/models/comments";
import Likes from "@/app/models/likes";
import Posts from "@/app/models/posts";
import User from "@/app/models/user";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // Connect to MongoDB
    await connectMongoDB();

    // Extract and verify the session cookie
    const session = cookies().get("session")?.value;
    if (!session) {
      return NextResponse.json({ message: "Session not found" }, { status: 401 });
    }

    const secretKey = process.env.SECRETKEY;
    if (!secretKey) {
      throw new Error("SECRETKEY environment variable is missing");
    }
    const key = new TextEncoder().encode(secretKey);
    const { payload }: any = await jwtVerify(session, key, {
      algorithms: ["HS256"],
    });

    const { username } = payload.User;
    if (!username) {
      return NextResponse.json({ message: "Invalid token payload" }, { status: 400 });
    }

    // Get the user from the database

    // Fetch posts for the user
    const posts = await Posts.find({ userId:username }).lean();
    const likedCount = await Likes.countDocuments({userId:username})
    const commentedCount = await Comments.countDocuments({userId:username})
    const totalPosts = posts.length; // Count the number of posts
    let likesCount = 0
    let commentsCount = 0
    // Fetch likes and comments counts for each post
    await Promise.all(
      posts.map(async (post) => {
 
         likesCount = likesCount + post.likes  // Assuming `likes` is an array in Posts model
         commentsCount = await Comments.countDocuments({ postId: post._id }) || 0;

       
      })
    );

    // Return the response
    return NextResponse.json({ totalPosts,likedCount, commentedCount ,likesCount,commentsCount }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "Something went wrong", error: error }, { status: 500 });
  }
}
