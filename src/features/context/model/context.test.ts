import { describe, expect, it } from 'vitest';
import { mockUsers } from '@/services/mocks/fixtures/users';
import {
  availableContexts,
  contextHome,
  savePreference,
  validatePreference,
  CONTEXT_STORAGE_KEY,
} from './context';

describe('modelo de contexto', () => {
  it('deriva uma opção para cada linha de academias', () => {
    expect(availableContexts(mockUsers.multi)).toHaveLength(3);
  });

  it('cria contexto global apenas para Super Admin', () => {
    expect(availableContexts(mockUsers.superAdmin)).toEqual([
      { kind: 'global', role: 'super_admin' },
    ]);
  });

  it('descarta preferência que não existe mais', () => {
    const contexts = availableContexts(mockUsers.aluno);
    expect(validatePreference(contexts, { academyId: 'removida', function: 'aluno' })).toBeNull();
  });

  it('persiste somente academia e função', () => {
    savePreference(availableContexts(mockUsers.aluno)[0]!);
    expect(JSON.parse(localStorage.getItem(CONTEXT_STORAGE_KEY)!)).toEqual({
      academyId: 'academia-prisma',
      function: 'aluno',
    });
  });

  it('mapeia destinos por função', () => {
    expect(contextHome(availableContexts(mockUsers.professor)[0]!)).toBe('/app/planos');
  });
});
