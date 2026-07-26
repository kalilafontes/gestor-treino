import type { AcademyFunction, UserDto } from '@/services/api/contracts/auth.v1';

export type GlobalContext = { kind: 'global'; role: 'super_admin' };
export type AcademyContext = {
  kind: 'academy';
  academyId: string;
  academyName: string;
  function: AcademyFunction;
};
export type ActiveContext = GlobalContext | AcademyContext;
export type ContextPreference = Pick<AcademyContext, 'academyId' | 'function'>;

export const CONTEXT_STORAGE_KEY = 'prisma.active-context.v1';

export function availableContexts(user: UserDto): ActiveContext[] {
  if (user.role_global === 'super_admin') return [{ kind: 'global', role: 'super_admin' }];
  return user.academias.map((membership) => ({
    kind: 'academy',
    academyId: membership.academia_id,
    academyName: membership.academia_nome,
    function: membership.funcao,
  }));
}

export function validatePreference(
  contexts: ActiveContext[],
  preference: ContextPreference | null,
) {
  if (!preference) return null;
  return (
    contexts.find(
      (context) =>
        context.kind === 'academy' &&
        context.academyId === preference.academyId &&
        context.function === preference.function,
    ) ?? null
  );
}

export function readPreference(): ContextPreference | null {
  try {
    const parsed = JSON.parse(localStorage.getItem(CONTEXT_STORAGE_KEY) ?? 'null') as unknown;
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'academyId' in parsed &&
      'function' in parsed &&
      typeof parsed.academyId === 'string' &&
      ['aluno', 'professor', 'admin_academia'].includes(String(parsed.function))
    ) {
      return parsed as ContextPreference;
    }
  } catch {
    // Preferência corrompida é descartada.
  }
  return null;
}

export function savePreference(context: ActiveContext | null) {
  if (!context || context.kind === 'global') {
    localStorage.removeItem(CONTEXT_STORAGE_KEY);
    return;
  }
  localStorage.setItem(
    CONTEXT_STORAGE_KEY,
    JSON.stringify({ academyId: context.academyId, function: context.function }),
  );
}

export function contextHome(context: ActiveContext | null) {
  if (!context) return '/selecionar-contexto';
  if (context.kind === 'global') return '/admin/academias';
  return {
    aluno: '/app/treinos',
    professor: '/app/planos',
    admin_academia: '/app/membros',
  }[context.function];
}
