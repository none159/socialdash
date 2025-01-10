import { connectMongoDB } from "@/app/lib/mongodb";
import User from "@/app/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { SignJWT } from "jose";

// Nodemailer transport configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.APP_EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    await connectMongoDB();

    const data: { [key: string]: FormDataEntryValue } = {};

    const formDataEntries = Array.from(formData.entries());
    for (const [key, value] of formDataEntries) {
      if (key === "password") {
        data[key] = await bcrypt.hash(value.toString(), 10);
      } else {
        data[key] = value.toString();
      }
    }

    const { email, firstname, lastname } = data;
    const userExist = await User.findOne({ email });

    if (userExist) {
      return NextResponse.json({ message: "User Already Exists" }, { status: 400 });
    }

    // Generate JWT verification token
    const secretKey = process.env.SECRETKEY;
    if (!secretKey) {
      return NextResponse.json(
        { message: "Server misconfiguration: SECRETKEY missing" },
        { status: 500 }
      );
    }
    const key = new TextEncoder().encode(secretKey);

    const verificationToken = await new SignJWT({ email })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h") // Token valid for 1 hour
      .sign(key);

    // Set token expiry time (for database reference)
    const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Create the user with the verification token, unverified status, and token expiry time
   await User.create({
      ...data,
      verificationToken,
      tokenExpiry,
      emailVerified: false,
    });

    // Send verification email
    const verificationLink = `http://localhost:3000/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: process.env.APP_EMAIL,
      to: email as string,
      subject: "Email Verification",
      text: `Hello ${firstname} ${lastname},\n\nPlease click the following link to verify your email: \n${verificationLink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Verification email sent:", info.response);
      }
    });

    return NextResponse.json({
      message: "User Registered. Please check your email to verify your account.",
      status: 201,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json({ message: "Error", error: error }, { status: 500 });
  }
}
