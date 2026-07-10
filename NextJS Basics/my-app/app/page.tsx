// page.tsx is the home page of your application (the route "/")
"use client"
import React, { useState } from 'react'
import Link from 'next/link'

const Page = () => {
  // This state is local to this specific page component.
  const [count, setCount] = useState(0)
  
  return (
    <div className="p-8 text-center max-w-xl mx-auto">
      {/* 
        Mistake fixed: Removed Navbar and Footer from page.tsx.
        Why: Since Navbar and Footer are now in app/layout.tsx (root layout), they wrap this page component automatically.
        If we kept them here, they would duplicate, or disappear when navigating to other pages!
      */}
      <h1 className="text-3xl font-bold mb-4 text-amber-500">Hello from Next.js Home Page!</h1>
      
      <div className="my-6 p-4 border rounded bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
        <p className="mb-2">This is client-side state inside a Client Component (marked with "use client").</p>
        <p className="text-xl font-semibold mb-3">Counter: {count}</p>
        <button 
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition cursor-pointer" 
          onClick={() => setCount(count + 1)}
        >
          Increment Counter
        </button>
      </div>

      <div className="mt-8 border-t border-zinc-200 dark:border-zinc-800 pt-6 text-left">
        <h2 className="text-xl font-bold mb-4">Demonstrating Next.js Routing:</h2>
        <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
          Click these links to navigate. Notice how the page does not reload completely (SPA-like client-side navigation), and the Navbar & Footer remain stable without reloading or flickering!
        </p>
        
        <ul className="space-y-3">
          <li>
            <Link href="/about" className="text-blue-500 hover:underline">
              &rarr; Go to /about (Demonstrates nested layout behavior)
            </Link>
          </li>
          <li>
            <Link href="/about/courses" className="text-blue-500 hover:underline">
              &rarr; Go to /about/courses (Nested sub-route inside /about)
            </Link>
          </li>
          <li>
            <Link href="/about/support" className="text-blue-500 hover:underline">
              &rarr; Go to /about/support (Another nested sub-route inside /about)
            </Link>
          </li>
          <li>
            <Link href="/contact" className="text-blue-500 hover:underline">
              &rarr; Go to /contact (New page created to fix the 404 contact link)
            </Link>
          </li>
          <li>
            <Link href="/product/101" className="text-blue-500 hover:underline">
              &rarr; Go to dynamic route: /product/101
            </Link>
          </li>
          <li>
            <Link href="/product/blue-mug-99" className="text-blue-500 hover:underline">
              &rarr; Go to dynamic route: /product/blue-mug-99
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Page