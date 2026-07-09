//page.tsx is the root page for the application
"use client"
import React , {useState} from 'react'
import Navbar from '@/components/navbar/Navbar'
import Footer from '@/components/Footer/Footer'

const page = () => {
  const [count,setCount] = useState(0)
  return (
    <div>
    <Navbar/>
    <h1 className='text-2xl text-center'>hello from next js page {count}</h1>
    <button className='border border-black bg-black p-4 mt-2 text-white' onClick={()=>setCount(count+1)}>click me</button>
    <Footer/>
    </div>
  )
}

export default page