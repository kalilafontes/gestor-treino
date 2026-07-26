import { describe, expect, it } from 'vitest';
import { loginSchema, profileSchema, registerSchema } from './auth-schemas';

describe('schemas de autenticação', () => {
  it('rejeita login sem email válido e senha', () => {
    expect(loginSchema.safeParse({ email: 'invalido', senha: '' }).success).toBe(false);
  });

  it('exige os mínimos confirmados no cadastro', () => {
    expect(
      registerSchema.safeParse({ nome_completo: 'A', email: 'a@b.com', senha: '1234567' }).success,
    ).toBe(false);
  });

  it('faz trim e aceita nome válido no perfil', () => {
    expect(profileSchema.parse({ nome_completo: '  Ana Silva  ' }).nome_completo).toBe('Ana Silva');
  });
});
