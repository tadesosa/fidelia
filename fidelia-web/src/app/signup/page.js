import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Messages from '../login/messages'

// No más import de 'cookies' aquí

export default function SignupPage() {

  const signUp = async (formData) => {
    'use server'

    const email = formData.get('email')
    const password = formData.get('password')
    const role = formData.get('role')
    const nombre_local = formData.get('nombre_local')
    const supabase = createClient() // Ya no pasamos argumentos

    if (!role) {
        return redirect('/signup?message=Por favor, selecciona si eres un Cliente o un Local.')
    }
    
    if (role === 'local' && !nombre_local) {
        return redirect('/signup?message=Por favor, ingresa el nombre de tu local.')
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
            role: role,
            nombre_local: nombre_local 
        },
      },
    })

    if (error) {
      console.error(error);
      return redirect('/signup?message=Error: No se pudo registrar al usuario.')
    }

    return redirect('/login?message=Registro exitoso. Revisa tu email para confirmar tu cuenta.')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-indigo-600">Fidelia</h1>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">Crea una nueva cuenta</h2>
          <p className="mt-2 text-sm text-gray-600">
            ¿Ya tenés una?{' '}
            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Inicia sesión acá
            </Link>
          </p>
        </div>
        <form action={signUp} className="space-y-6">
          <fieldset className="space-y-4">
            <legend className="block text-sm font-medium text-gray-700">Soy un...</legend>
            <div className="flex items-center gap-x-8">
                <div className="flex items-center">
                    <input id="role-cliente" name="role" type="radio" value="cliente" required className="w-4 h-4 text-indigo-600"/>
                    <label htmlFor="role-cliente" className="block ml-3 text-sm text-gray-900">Cliente</label>
                </div>
                <div className="flex items-center">
                    <input id="role-local" name="role" type="radio" value="local" required className="w-4 h-4 text-indigo-600"/>
                    <label htmlFor="role-local" className="block ml-3 text-sm text-gray-900">Local</label>
                </div>
            </div>
          </fieldset>
          
          <div>
            <label htmlFor="nombre_local" className="block text-sm font-medium text-gray-700">Nombre del Local (si aplica)</label>
            <input id="nombre_local" name="nombre_local" type="text" className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm"/>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input id="email" name="email" type="email" autoComplete="email" required className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm"/>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input id="password" name="password" type="password" minLength="6" required className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm" placeholder="Mínimo 6 caracteres"/>
          </div>
          
          <div>
            <button type="submit" className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700">
              Crear Cuenta
            </button>
          </div>
        </form>
        <Messages />
      </div>
    </div>
  )
}
