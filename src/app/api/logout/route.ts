    import { logout } from "@/app/lib/lib";
    import { NextResponse } from "next/server";

    export async function POST(req: Request) {
        await logout();
        const { origin } = new URL(req.url);
        return NextResponse.redirect(`${origin}/Signin`, {
            status: 302, // HTTP status code for redirection
        });
    }
