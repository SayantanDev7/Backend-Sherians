import React from 'react'
import Link from 'next/link'

// MISTAKE FIXED & EXPLAINED:
// Previous comment was: "//here the layout will only be visible for ui of courses and support not for other pages"
// THIS IS INCORRECT!
// In Next.js App Router, a nested layout (like app/about/layout.jsx) applies to:
// 1. The page in its own folder (app/about/page.jsx -> /about)
// 2. ALL pages in nested folders (app/about/courses/page.jsx -> /about/courses, and app/about/support/page.jsx -> /about/support)
//
// Let's render a simple sub-navigation section here so you can see it on all of these pages!

const AboutLayout = ({ children }) => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Visual indicator of the About Layout boundary */}
      <div className="bg-blue-50 border border-blue-200 dark:bg-zinc-800 dark:border-zinc-700 p-4 rounded mb-6">
        <h3 className="text-sm font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider mb-2">
          [About Section Layout Container]
        </h3>
        <p className="text-xs text-blue-600 dark:text-blue-400 mb-4">
          This container is defined in <code>app/about/layout.jsx</code>. It wraps <code>/about</code>, <code>/about/courses</code>, and <code>/about/support</code>.
        </p>
        
        {/* Simple secondary navigation */}
        <nav className="flex gap-4 border-b pb-3 mb-2 text-sm border-blue-200 dark:border-zinc-700">
          <Link href="/about" className="text-blue-600 hover:underline font-medium">About Main</Link>
          <span className="text-gray-300">|</span>
          <Link href="/about/courses" className="text-blue-600 hover:underline font-medium">Courses</Link>
          <span className="text-gray-300">|</span>
          <Link href="/about/support" className="text-blue-600 hover:underline font-medium">Support</Link>
        </nav>
      </div>

      {/* This renders the actual page contents (e.g., about page, courses page, or support page) */}
      <div className="bg-white dark:bg-zinc-950 p-6 border rounded shadow-sm">
        {children}
      </div>
    </div>
  )
}

export default AboutLayout