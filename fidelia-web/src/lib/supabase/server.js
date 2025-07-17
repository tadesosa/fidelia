import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createClient = () => {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        // Hacemos que los métodos sean asíncronos para compatibilidad
        async get(name) {
          return cookieStore.get(name)?.value
        },
        async set(name, value, options) {
          try {
            await cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Se ignora el error en Server Components
          }
        },
        async remove(name, options) {
          try {
            await cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Se ignora el error en Server Components
          }
        },
      },
    }
  )
}
