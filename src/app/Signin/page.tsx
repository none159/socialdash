"use client"
import React,{ useRef,useState} from 'react'
import Link from 'next/link';

const Signin = () => {

  const formRef=useRef<HTMLFormElement>(null)
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const [wronginput,setwronginput] =  useState({
    "email":false,
    "password":false
  })
  const[response,setresponse] = useState("")
  const handlesubmit =async (e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    if(formRef.current){
      const formData = new FormData(formRef.current);
      const email = formData.get("email")!.toString();
      const password = formData.get("password")!.toString();
      const emailError = !emailRegex.test(email);
      const passwordError = !passwordRegex.test(password);
      setwronginput({
        email: emailError,
        password: passwordError,
      });
      // Send form data without converting it to JSON
      if( !emailError && !passwordError){
       const res  = await fetch('/api/login', {
        method: 'POST',
        body: formData, // Send FormData directly
      });
      const result = await res.json()
      if (res.ok) {
        if (result.redirect) {
          window.location.href = result.redirect; } 
  
      setresponse(result.message)
      console.log(response)
     
    }
    else{
      setresponse(result.message)
    }
  }}
}

  return (  
    <section className='relative top-[250px] bg-gray-700 shadow-black shadow-2xl rounded-md w-fit mx-auto'>
        <form className='grid place-items-center gap-10 font-light p-[20px]'  ref={formRef} onSubmit={handlesubmit}>
             <h2 className='text-3xl'>Sign In</h2>
             <div className='grid gap-5 place-items-center'>
             <h3>Email :</h3>
             <input type='email' name='email' required className={`outline-none text-sm rounded text-black p-[5px] w-[300px] ${wronginput.email ? 'bg-red-200' : 'bg-gray-500'}`}/>
             <h3>Password : </h3>
             <input type='password' name='password' required  className={`outline-none text-sm rounded text-black p-[5px] w-[300px] ${wronginput.password ? 'bg-red-200' : 'bg-gray-500'}`}/>
             
             </div>
             <button type='submit' className='bg-white text-gray-500 p-[5px] w-[150px] rounded hover:bg-gray-500 hover:text-white transition-all ease-in-out duration-[500ms]'>Sign In</button>
             <h4>Click Here To <Link href="/Signup" className='text-blue-800 underline'>SignUp</Link></h4>
             {response &&<h3 className={`${response == "User Logged in"?
              "bg-green-600":"bg-red-600"
             } p-[10px] rounded`} >{response}</h3>}
        </form>
    </section>
  )

}
export default Signin