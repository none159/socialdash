import { connectMongoDB } from "@/app/lib/mongodb";
import Comments from "@/app/models/comments";
import Likes from "@/app/models/likes"; // Ensure the 'Likes' model is set for comments
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import mongoose from "mongoose"; // Import mongoose for ObjectId
import Commentslikes from "@/app/models/commentslikes";

export async function POST(req: Request) {
  try {
    await connectMongoDB();

    const body = await req.json();
    const { commentId, groupId,postId, action } = body; // Expecting 'action' to be 'like' or 'unlike'

    if (!commentId || !groupId || !action) {
      return NextResponse.json({ message: "Comment ID, Group ID, and action are required" }, { status: 400 });
    }

    // Validate commentId format
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return NextResponse.json({ message: "Invalid Comment ID" }, { status: 400 });
    }

    // Get the token from cookies
    const session = cookies().get("session")?.value;
    const secretkey = process.env.SECRETKEY;
    const key = new TextEncoder().encode(secretkey);
    const { payload } = await jwtVerify(session!, key, { algorithms: ["HS256"] });
    const { username } : any = payload.User; // Extract username from the token

    // Fetch the comment
    const comment = await Comments.findById(commentId);
    const liked = (await Commentslikes.find({ commentId, userId: username })).length > 0 ? true : false;

    // Check if comment exists
    if (!comment) {
      return NextResponse.json({ message: "Comment not found" }, { status: 404 });
    }

    // Handle like/unlike action
    if (action === "like") {
      if (!liked) {
        await Commentslikes.create({ commentId, userId: username, groupId,postId }); // Store like
        comment.likes += 1; // Increment the like count for the comment
      }
    } else if (action === "unlike") {
      if (liked) {
        await Commentslikes.deleteOne({ commentId, userId: username }); // Remove like
        comment.likes = Math.max(0, comment.likes - 1); // Decrement the like count for the comment
      }
    } else {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }

    // Save the updated comment
    await comment.save();

    return NextResponse.json({
      message: "Comment updated successfully",
      likes: comment.likes,
    }, { status: 200 });
  } catch (error) {
    console.error("Error updating comment likes:", error);
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
      const commentId = searchParams.get("commentId")!;


      // Validate commentId format
      if (!mongoose.Types.ObjectId.isValid(commentId)) {
        return NextResponse.json({ message: "Invalid Comment ID" }, { status: 400 });
      }
  
      const session = cookies().get("session")?.value;
      const secretkey = process.env.SECRETKEY;
      const key = new TextEncoder().encode(secretkey);
      const { payload } = await jwtVerify(session!, key, { algorithms: ["HS256"] });
      const { username } : any = payload.User;
  
      // Find the comment
      const comment : any = await Comments.findById(commentId);
  
      if (!comment) {
        return NextResponse.json({ message: "Comment not found" }, { status: 404 });
      }
  
      // Check if the user has liked the comment
      const userLiked = await Commentslikes.find({commentId}).lean(); // Use `.lean()` for a plain object response
      const isliked = userLiked.length>0?true:false
      return NextResponse.json({isliked,likes:comment.likes }, { status: 200 });
    } catch (error) {
      console.error("Error fetching comment like status:", error);
      return NextResponse.json({
        message: "Something went wrong",
        error: error instanceof Error ? error.message : error,
      }, { status: 500 });
    }
  }
  