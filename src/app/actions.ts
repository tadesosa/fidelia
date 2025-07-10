'use server';

import { sql } from '@vercel/postgres';
import { z } from 'zod';

const RegisterBusinessSchema = z.object({
  businessName: z.string().min(3, "El nombre del local es requerido."),
  loyaltyModel: z.enum(['points', 'subscription']),
});

export async function registerBusiness(prevState: any, formData: FormData) {
  const validatedFields = RegisterBusinessSchema.safeParse({
    businessName: formData.get('businessName'),
    loyaltyModel: formData.get('loyaltyModel'),
  });

  if (!validatedFields.success) {
    return { error: "Datos inválidos." };
  }

  const { businessName, loyaltyModel } = validatedFields.data;
  const trialEndDate = new Date();
  trialEndDate.setDate(trialEndDate.getDate() + 14);

  try {
    await sql`
      INSERT INTO businesses (name, loyalty_model, trial_end_date)
      VALUES (${businessName}, ${loyaltyModel}, ${trialEndDate.toISOString()});
    `;
    return { success: `¡El local ${businessName} ha sido registrado con éxito!` };
  } catch (error) {
    console.error('Error al registrar el negocio:', error);
    return { error: "Error de la base de datos." };
  }
}
