import { connectMongoDB } from "@/app/lib/mongodb";
import User from "@/app/models/user";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ message: "Invalid token" }, { status: 400 });
    }

    await connectMongoDB();

    // Find user by token
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return NextResponse.json({ message: "User not found or invalid token" }, { status: 404 });
    }

    // Check if token has expired
    const currentTime = new Date().getTime();
    const tokenExpiry = user.tokenExpiry ? new Date(user.tokenExpiry).getTime() : 0;

    if (tokenExpiry && currentTime > tokenExpiry) {
      return NextResponse.json({ message: "Token has expired" }, { status: 400 });
    }

    // Update emailVerified field and clear the verificationToken
    user.emailVerified = true;
    user.verificationToken = undefined; // Optionally clear the verification token
    user.tokenExpiry = undefined; // Clear the token expiry time
    await user.save();

    return NextResponse.json({ message: "Email successfully verified! You can now log in." }, { status: 200 });
  } catch (error) {
    console.error("Error during verification:", error);
    return NextResponse.json({ message: "Error occurred during verification", error: error }, { status: 500 });
  }
}
