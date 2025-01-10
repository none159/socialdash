import { connectMongoDB } from "@/app/lib/mongodb";
import GroupMember from "@/app/models/groupmembers";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface UserPayload {
  username: string;
}

export async function POST(req: Request) {
  try {
    await connectMongoDB();
    const body = await req.json();
    const { id } = body;

    const session = cookies().get("session")?.value;
    const secretkey = process.env.SECRETKEY;
    const key = new TextEncoder().encode(secretkey);
    const { payload } = await jwtVerify(session!, key, {
      algorithms: ["HS256"],
    });

    // Cast `payload.User` to a specific type
    const userPayload = (payload.User as unknown) as UserPayload;
    const username = userPayload.username;

    if (!username) {
      throw new Error("Invalid payload: username missing");
    }

    console.log(id); // Debugging information
    await GroupMember.deleteOne({ groupId: id, userId: username });

    return NextResponse.json({ message: "User left group" }, { status: 200 });
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
