import { describe, expect, it } from 'vitest';
import { safeReturnPath } from './login-page';

describe('retorno seguro após login', () => {
  it.each(['/perfil', '/app/treinos?dia=hoje'])('aceita caminho interno %s', (path) => {
    expect(safeReturnPath(path)).toBe(path);
  });

  it.each(['https://evil.test', '//evil.test', 'javascript:alert(1)', null])(
    'rejeita retorno externo %s',
    (path) => {
      expect(safeReturnPath(path)).toBeNull();
    },
  );
});
