"use client"



export default function Home() {
  const handlelogout = async () => {
    const res = await fetch("/api/logout", { method: "POST" });
    if (res.ok) {

        console.log("Successfully logged out");
    } else {
        console.error("Logout failed");
    }
};
return(
  <>
  <div>AI APP</div>
  <button onClick={handlelogout}>logout</button>
  </>
)
}
