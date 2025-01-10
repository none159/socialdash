import { connectMongoDB } from "@/app/lib/mongodb";
import Group from "@/app/models/group";
import GroupMember from "@/app/models/groupmembers";
import { jwtVerify } from "jose";
import mongoose from "mongoose";
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

    // Type-cast payload.User
    const userPayload = (payload.User as unknown) as UserPayload;
    const username = userPayload.username;

    if (!username) {
      throw new Error("Invalid payload: username missing");
    }

    await GroupMember.create({ groupId: id, userId: username });
    return NextResponse.json({ message: "User joined group" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Something Wrong" }, { status: 500 });
  }
}
