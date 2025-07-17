import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Messages from './messages'

// No más import de 'cookies' aquí

export default function LoginPage() {

  const signIn = async (formData) => {
    'use server'

    const email = formData.get('email')
    const password = formData.get('password')
    const supabase = createClient() // Ya no pasamos argumentos

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error(error);
      return redirect('/login?message=Error: Credenciales incorrectas.')
    }

    return redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-indigo-600">Fidelia</h1>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
            Inicia sesión en tu cuenta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            ¿No tenés cuenta?{' '}
            <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
              Registrate acá
            </Link>
          </p>
        </div>
        <form action={signIn} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input id="email" name="email" type="email" autoComplete="email" required className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm"/>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input id="password" name="password" type="password" autoComplete="current-password" required className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm"/>
          </div>
          <div>
            <button type="submit" className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700">
              Iniciar Sesión
            </button>
          </div>
        </form>
        <Messages />
      </div>
    </div>
  )
}
