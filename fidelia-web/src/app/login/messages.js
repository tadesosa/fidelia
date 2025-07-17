'use client'

import { useSearchParams } from 'next/navigation'

export default function Messages() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message')

  return (
    <>
      {message && (
        <p className="mt-4 p-4 bg-red-100 text-red-700 text-center rounded-md">
          {message}
        </p>
      )}
    </>
  )
}
