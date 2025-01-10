import { connectMongoDB } from "@/app/lib/mongodb";
import Posts from "@/app/models/posts";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import mongoose from "mongoose"; // Import mongoose for ObjectId
import Likes from "@/app/models/likes";
export async function POST(req: Request) {
  try {
    await connectMongoDB();

    const body = await req.json();
    const { postId, groupId,action } = body; // Expecting an "action" field to specify 'like' or 'unlike'

    // Validate required fields
    if (!postId || !groupId) {
      return NextResponse.json({ message: "Post ID and action are required" }, { status: 400 });
    }

    // Validate postId format
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return NextResponse.json({ message: "Invalid Post ID" }, { status: 400 });
    }

    // Get the token from cookies
    const session = cookies().get("session")?.value;
    const secretkey = process.env.SECRETKEY;
    const key = new TextEncoder().encode(secretkey);
    const { payload } = await jwtVerify(session!, key, { algorithms: ["HS256"] });
    const { username } = payload.User as { username: string }; // Extract username from the token

    // Fetch the post
    const post = await Posts.findById(postId);
    const likes =  (await Likes.find({postId})).length >0  ? true:false

    // Check if post exists
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // Update the likes count and likedBy array based on the action
    if (action === "like") {

      if (!likes) {

        post.likes += 1; // Increment likes
        await Likes.create({groupId,userId:username,postId})
      }
    } else if (action === "unlike") {
      if (likes) {
        post.likes = Math.max(0, post.likes - 1);
        await Likes.deleteOne({userId:username})
      
      }
    } else {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }

    // Save the updated post
    await post.save();

    return NextResponse.json({
      message: "Post updated successfully",
      likes: post.likes,
    }, { status: 200 });
  } catch (error) {
    console.error("Error updating likes:", error);
    return NextResponse.json({
      message: "Something went wrong",
      error: error instanceof Error ? error.message : error,
    }, { status: 500 });
  }
}
export async function GET(req: Request) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json({ message: "Post ID is required" }, { status: 400 });
    }

    // Validate postId format
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return NextResponse.json({ message: "Invalid Post ID" }, { status: 400 });
    }

    const session = cookies().get("session")?.value;
    const secretkey = process.env.SECRETKEY;
    const key = new TextEncoder().encode(secretkey);
    const { payload } = await jwtVerify(session!, key, { algorithms: ["HS256"] });
    const { username } = payload.User as { username: string };

    // Find the post
    const post = await Posts.findById(postId);

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // Check if the user has liked the post
    const userLiked = await Likes.find({ postId, userId:username }).lean(); // Use `.lean()` to get plain objects

  
    const liked = userLiked.length > 0 ?true:false;

    return NextResponse.json({ liked,likes:post.likes }, { status: 200 });
  } catch (error) {
    console.error("Error fetching like status:", error);
    return NextResponse.json({
      message: "Something went wrong",
      error: error instanceof Error ? error.message : error,
    }, { status: 500 });
  }
}
