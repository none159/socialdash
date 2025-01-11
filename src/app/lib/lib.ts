import { SignJWT, jwtVerify } from "jose";
import { JWTExpired } from "jose/errors";
import { cookies } from "next/headers";
import { NextResponse } from "next/server"; // Removed unused `NextRequest`

const secretkey = process.env.SECRETKEY;

const key = new TextEncoder().encode(secretkey);

interface Payload {
  [key: string]: unknown; // Define a general object structure
}

export async function encrypt(payload: Payload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10 hours from now")
    .sign(key);
}

export async function decrypt(input: string): Promise<Payload | null> {
  const session = cookies().get("session")?.value;
  if (session) {
    try {
      const { payload } = await jwtVerify(input, key, {
        algorithms: ["HS256"],
      });
      return payload as Payload;
    } catch (error) {
      if (error instanceof JWTExpired) {
        const res = NextResponse.next();
        res.cookies.set("session", "", {
          expires: new Date(0), // Set expiration to a past date to delete the cookie
          httpOnly: true, // Optional: keeps it HttpOnly
        });
        return null;
      }
    }
  }
  return null;
}

export async function getsession(): Promise<Payload | null> {
  const session = cookies().get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function updatesession(): Promise<NextResponse | null> {
  const session = cookies().get("session")?.value;
  if (!session) return null;
  const parsed = await decrypt(session);
  if (parsed) {
    parsed.expires = new Date(Date.now() + 10 * 60 * 60 * 1000); // Extend expiry time
    const res = NextResponse.next();
    res.cookies.set("session", session, {
      httpOnly: true,
      expires: parsed.expires as Date,
      path: "*",
    });
    return res;
  }
  return null;
}

export async function logout(): Promise<void> {
  cookies().set("session", "", { expires: new Date(0), path: "/" }); // Set path to '/' to match the original cookie
}
