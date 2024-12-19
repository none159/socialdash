import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const sessionCookie = cookies().get("session")?.value;
  return NextResponse.json({ isLoggedIn: Boolean(sessionCookie) });
}
