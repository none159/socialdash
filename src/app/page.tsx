"use client"



export default function Home() {
const handlelogout = ()=>{
  fetch("/api/logout")
  window.location.href ="/Signup"
}
return(
  <>
  <div>AI APP</div>
  <button onClick={handlelogout}>logout</button>
  </>
)
}
