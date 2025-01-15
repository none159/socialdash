import { jwtVerify } from "jose";
import { cookies } from "next/headers";
interface UserPayload {
    username: string;
  }
export async function GET() {
  const sessionCookie = cookies().get("session")?.value;

  if (!sessionCookie) {
    return new Response(JSON.stringify({ error: "No session cookie found" }), { status: 404 });
  }
   const secretkey = process.env.SECRETKEY
          const key = new TextEncoder().encode(secretkey)
         const { payload } = await jwtVerify(sessionCookie!, key, {
          algorithms: ["HS256"],
         })
         const userPayload = (payload.User as unknown) as UserPayload;
         const username = userPayload.username;
  return new Response(JSON.stringify({ username: username }), { status: 200 });
}
