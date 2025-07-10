'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { registerBusiness } from '@/app/actions';

export default function RegisterPage() {
  const [formState, formAction] = useFormState(registerBusiness, undefined);

  return (
    <main className="flex-1 flex items-center justify-center py-12 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-2">Comienza a Fidelizar</h2>
          <p className="text-center text-gray-600 mb-6">Crea tu cuenta y obtén 14 días de prueba gratuita.</p>
          <form action={formAction} className="space-y-4">
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">Nombre de tu Local</label>
              <input id="businessName" name="businessName" type="text" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
            </div>
            <div>
              <label htmlFor="loyaltyModel" className="block text-sm font-medium text-gray-700">Elige tu Plan</label>
              <select id="loyaltyModel" name="loyaltyModel" required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md">
                <option value="">Selecciona un plan...</option>
                <option value="points">Programa de Puntos</option>
                <option value="subscription">Programa de Suscripción</option>
              </select>
            </div>
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
              Crear Cuenta y Empezar Prueba
            </button>
            {formState?.error && <p className="text-sm text-red-500 mt-2">{formState.error}</p>}
            {formState?.success && <p className="text-sm text-green-500 mt-2">{formState.success}</p>}
          </form>
        </div>
      </div>
    </main>
  );
}
