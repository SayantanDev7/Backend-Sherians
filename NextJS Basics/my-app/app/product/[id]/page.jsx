//[id] is a dynamic route
"use client"
import React from 'react'
import {useParams} from 'next/navigation'
const page = () => {
    const {id} = useParams(); //contains the id
  return (
    <div>
    <h1>Product Page</h1>
    <p>Product ID: {id}</p>
    </div>
  )
}

export default page