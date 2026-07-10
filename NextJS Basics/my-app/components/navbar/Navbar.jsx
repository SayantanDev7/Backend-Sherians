import React from 'react'
import Link from 'next/link'

const Navbar = () => {
  return (
    <div className='flex justify-between items-center px-10 py-6 bg-amber-400 text-black font-semibold shadow-md'>
      <h1 className='text-xl font-bold'>Sheryians</h1>
      {/* 
        Mistake fixed: Swapped the order of <Link> and <li>.
        Before: <Link href="..."><li>Text</li></Link>
        After:  <li><Link href="...">Text</Link></li>
        
        Why: In HTML, a <ul> (unordered list) must only contain <li> elements as direct children.
        Putting a <Link> (which renders as an <a> tag) as a direct child of <ul> is invalid HTML.
        Wrapping the Link *inside* the <li> is standard and solves HTML validation/hydration warnings!
      */}
      <ul className='flex gap-6'>
        <li>
          <Link href="/" className="hover:underline">Home</Link>
        </li>
        <li>
          <Link href="/about" className="hover:underline">About</Link>
        </li>
        <li>
          <Link href="/contact" className="hover:underline">Contact</Link>
        </li>
      </ul>
    </div>
  )
}

export default Navbar