import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Informe um email válido.'),
  senha: z.string().min(1, 'Informe sua senha.'),
});

export const registerSchema = z.object({
  nome_completo: z.string().trim().min(2, 'Informe pelo menos 2 caracteres.').max(255),
  email: z.email('Informe um email válido.'),
  senha: z.string().min(8, 'Use pelo menos 8 caracteres.'),
});

export const profileSchema = z.object({
  nome_completo: z.string().trim().min(2, 'Informe pelo menos 2 caracteres.').max(255),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type ProfileValues = z.infer<typeof profileSchema>;
