import { cookies } from "next/headers";

export async function GET(req: Request) {
  const sessionCookie = cookies().get("session")?.value;
  if (!sessionCookie) {
    return new Response(JSON.stringify({ error: "No session cookie found" }), { status: 404 });
  }

  return new Response(JSON.stringify({ session: sessionCookie }), { status: 200 });
}
