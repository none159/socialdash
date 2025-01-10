import { connectMongoDB } from "@/app/lib/mongodb";
import user from "@/app/models/user";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import nodemailer from 'nodemailer';
import { encrypt } from "@/app/lib/lib";

interface UpdateData {
  username?: string;
  email?: string;
  password?: string;
  image?: string;
}

export async function POST(req: Request) {
  try {
    let emailchanged = false;
    const body = await req.json();
    const { username: newUsername, oldpassword, email, password: newPassword, imageUrl } = body;

    if (!newUsername && !newPassword && !oldpassword && !imageUrl && email) {
      return NextResponse.json(
        { message: "At least one field (username, password, image) is required" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectMongoDB();

    const session = cookies().get("session")?.value;
    if (!session) {
      return NextResponse.json({ message: "User session not found" }, { status: 401 });
    }

    const secretkey = process.env.SECRETKEY!;
    const key = new TextEncoder().encode(secretkey);
    const { payload } = await jwtVerify(session, key, {
      algorithms: ["HS256"],
    });

    const { username } = payload.User as { username: string };

    if (!username) {
      return NextResponse.json({ message: "Username not found in session payload" }, { status: 401 });
    }

    // Prepare update object
    const updateData: UpdateData = {};
    if (newUsername) updateData.username = newUsername;
    if (email) {
      updateData.email = email;
      emailchanged = true;
    }
    if (newPassword && oldpassword) {
      const dbuser = await user.findOne({ username: username }).exec();
      if (dbuser) {
        const passwordverify = await bcrypt.compare(oldpassword, dbuser.password);
        if (passwordverify) {
          updateData.password = await bcrypt.hash(newPassword, 10);
        }
      }
    }
    if (imageUrl) updateData.image = imageUrl;

    const updatedUser = await user.findOneAndUpdate(
      { username: username },
      { $set: updateData },
      { new: true, upsert: false }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found or update failed" }, { status: 404 });
    }

    if (emailchanged) {
      const verificationToken = await new SignJWT({ email: email })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('1h') // Token expires in 1 hour
        .sign(key);

      updatedUser.verificationToken = verificationToken;
      updatedUser.emailVerified = false;
      updatedUser.tokenExpiry = new Date().getTime() + 3600000; // Token expires in 1 hour
      await updatedUser.save();

      // Send verification email with the token
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.APP_EMAIL,
          pass: process.env.APP_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.APP_EMAIL,
        to: email,
        subject: "Verify your new email address",
        text: `Click the following link to verify your new email address: localhost:3000/verify-email?token=${verificationToken}`,
      };

      await transporter.sendMail(mailOptions);

      const expires = new Date(Date.now() + 10 * 60 * 60 * 1000); // Expiry date for session
      const U = await user.findOne({ email });
      if (U) {
        const User = { email: U.email, username: U.username };
        const session = await encrypt({ User, expires });
        cookies().set("session", session, { expires, httpOnly: true });
      }

      return NextResponse.json({ message: "User updated successfully. Please verify your email." }, { status: 200 });
    }

    return NextResponse.json({ message: "User updated successfully", user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ message: "Internal server error", error }, { status: 500 });
  }
}
