import { logout } from "@/lib/lib";

export async function GET(req : Request){
    await logout()
}