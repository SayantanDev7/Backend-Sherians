import React from 'react'
import Link from 'next/link'
const Navbar = () => {
  return (
    <div className='flex justify-between items-center px-10 py-6 bg-amber-400'>
      <h1>Sherians</h1>
      <ul className='flex gap-6'>
        <Link href="/"><li>Home</li></Link>
        <Link href="/about"><li>About</li></Link>
        <Link href="/contact"><li>Contact</li></Link>
      </ul>
    </div>
  )
}

export default Navbar