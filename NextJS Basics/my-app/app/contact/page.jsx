// app/contact/page.jsx
// This file matches the route "/contact"
import React from 'react'

const ContactPage = () => {
  return (
    <div className="p-8 text-center max-w-xl mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-emerald-500">Contact Us</h2>
      <p className="text-zinc-600 dark:text-zinc-400 mb-6">
        This page was created because the Navbar had a link to <code>/contact</code>, but the folder and file did not exist, which resulted in a 404 error.
      </p>
      
      <div className="p-6 border rounded bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-left space-y-2 text-sm">
        <p><strong>Email:</strong> contact@example.com</p>
        <p><strong>Phone:</strong> +1 (555) 019-2834</p>
        <p><strong>Learning tip:</strong> Every folder under the <code>app</code> directory that contains a <code>page.jsx</code> (or <code>page.tsx</code>) automatically becomes a route in Next.js.</p>
      </div>
    </div>
  )
}

export default ContactPage
