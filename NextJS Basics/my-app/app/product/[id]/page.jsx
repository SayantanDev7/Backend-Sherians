// [id] represents a dynamic route segment. 
// Any path like /product/1, /product/shoes, /product/abc will match this file, and "id" will contain that value.
"use client"

import React from 'react'
import { useParams } from 'next/navigation'

const ProductPage = () => {
  // useParams() is a React Hook that retrieve route parameters inside Client Components ("use client").
  // It returns an object containing the dynamic parameters: e.g., { id: "101" }
  const { id } = useParams()

  return (
    <div className="p-8 text-center max-w-xl mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-violet-500">Dynamic Product Page</h2>
      
      <div className="p-6 border rounded bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
        <p className="text-zinc-600 dark:text-zinc-400 mb-2">Dynamic parameter extracted from the URL:</p>
        <p className="text-2xl font-mono font-bold text-violet-600 dark:text-violet-400">&quot;{id}&quot;</p>
      </div>

      <div className="mt-6 text-left text-xs text-zinc-500 dark:text-zinc-400 space-y-3 leading-relaxed border-t pt-4 border-zinc-200 dark:border-zinc-800">
        <p className="font-bold">Next.js Learning Note:</p>
        <p>
          1. <strong>In Client Components (like this one):</strong> We use the <code>useParams()</code> hook from <code>&apos;next/navigation&apos;</code> to get parameters synchronously.
        </p>
        <p>
          2. <strong>In Server Components (without &quot;use client&quot;):</strong> We do NOT use hooks. Instead, Next.js automatically passes a <code>params</code> prop to the component function. 
          In Next.js 15+, <code>params</code> is a Promise, so you must await it like this:
        </p>
        <pre className="bg-zinc-100 dark:bg-zinc-800 p-2 rounded text-zinc-800 dark:text-zinc-200 overflow-x-auto">
{`export default async function Page({ params }) {
  const { id } = await params;
  return <div>Product ID: {id}</div>;
}`}
        </pre>
      </div>
    </div>
  )
}

export default ProductPage