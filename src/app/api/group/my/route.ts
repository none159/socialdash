import { connectMongoDB } from "@/app/lib/mongodb";
import Group from "@/app/models/group";
import GroupMember from "@/app/models/groupmembers";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface UserPayload {
  username: string;
}

interface GroupType {
  roomId: string;
  title: string;
  creator: string;
  image: string;
  member: string;
}

export async function GET() {
  try {
    await connectMongoDB();

    const session = cookies().get("session")?.value;
    const secretkey = process.env.SECRETKEY;
    const key = new TextEncoder().encode(secretkey);

    const { payload } = await jwtVerify(session!, key, {
      algorithms: ["HS256"],
    });

    const userPayload = (payload.User as unknown) as UserPayload;
    const username = userPayload.username;

    if (!username) {
      throw new Error("Invalid session: username missing");
    }

    const groups: GroupType[] = [];
    const grouplist = await Group.find({}).exec();

    for (const item of grouplist) {
      const { roomId, title, creator, image } = item;
      const memberExist = await GroupMember.findOne({
        groupId: roomId,
        userId: username,
      });

      if (memberExist) {
        const memberCount = await GroupMember.countDocuments({
          groupId: roomId,
        });

        groups.push({
          roomId,
          title,
          creator,
          image,
          member: memberCount.toString(),
        });
      }
    }

    if (!groups.length) {
      return NextResponse.json(
        { message: "Data didn't fetch" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: groups }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
