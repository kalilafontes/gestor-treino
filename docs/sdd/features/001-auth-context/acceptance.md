# Validação — Feature 001

**Status:** Mock-complete  
**Data da validação:** 2026-07-25  
**Escopo:** T001–T051; integração real T052–T057 permanece futura

## Resultado

A feature de autenticação e contexto ativo foi implementada contra contratos
HTTP simulados com MSW. O access token permanece apenas em memória, componentes
não acessam refresh token e dados remotos de perfil são administrados pelo
TanStack Query.

## Matriz de rastreabilidade

| Requisito        | Critério                  | Evidência automatizada                                                |
| ---------------- | ------------------------- | --------------------------------------------------------------------- |
| RF-AUTH-001–002  | CA-AUTH-001               | `login-page.integration.test.tsx`; Playwright cadastro/login          |
| RF-AUTH-003–007  | CA-AUTH-002/003           | `session-controller.test.ts`; `api-client.test.ts`; Playwright reload |
| RF-AUTH-008      | acesso direto/403         | `api-client.test.ts`; Playwright URL direta                           |
| RF-AUTH-009      | CA-LOGOUT-001             | `session-controller.test.ts`; Playwright logout sob falha             |
| RF-AUTH-010–011  | CA-PROFILE-001            | testes axe privados; contrato e mutation tipados                      |
| RF-CTX-001–004   | CA-CTX-001/002            | `context.test.ts`; Playwright seleção múltipla/reload                 |
| RF-CTX-005–006   | destinos por perfil       | `context.test.ts`; Playwright Super Admin                             |
| Cadastro público | 201/409/422               | `register-page.integration.test.tsx`; Playwright cadastro             |
| Acessibilidade   | WCAG 2.2 AA automatizável | axe em login, cadastro, contexto, perfil e campos                     |
| Responsividade   | 320/768/1280 CSS px       | projetos Playwright mobile/desktop e teste de overflow                |

## Execuções

| Gate                                      | Resultado                                        |
| ----------------------------------------- | ------------------------------------------------ |
| TypeScript strict                         | aprovado                                         |
| ESLint                                    | aprovado, sem erros                              |
| Prettier                                  | aprovado                                         |
| Vitest + Testing Library + MSW            | 28/28 aprovados                                  |
| axe                                       | 5 superfícies sem violações automatizadas        |
| Playwright Chromium desktop/mobile        | 14/14 aprovados                                  |
| Build Vite de produção                    | aprovado                                         |
| Import privado de fixtures                | regra ESLint ativa                               |
| Busca por credenciais/logs/URLs sensíveis | nenhum log ou URL sensível em código de produção |

## Revisão de segurança

- login envia exclusivamente `email` e `senha`;
- perfil envia exclusivamente `nome_completo`;
- access token é mantido em módulo de memória;
- refresh é single-flight e cada request repete no máximo uma vez;
- 403 não limpa sessão;
- logout e refresh irrecuperável cancelam queries e limpam cache;
- retorno pós-login aceita apenas caminho interno;
- fixtures e credenciais de demonstração existem somente no ambiente mock/dev.

### Dependências

`npm audit --omit=dev` identifica um advisory alto no React Router 7.18.1
relacionado a RSC/Server Actions. Esta aplicação é uma SPA Vite e não habilita
RSC, actions de servidor ou modo framework. Não existe, em 2026-07-25, versão
estável publicada que corrija esse advisory sem reintroduzir advisories mais
antigos. Risco aceito provisoriamente, com atualização obrigatória quando uma
versão corrigida for publicada.

Advisories restantes da árvore de desenvolvimento pertencem às ferramentas de
lint e não são empacotados no build de produção. Não foi usado `audit fix
--force`.

## Desvios e limites conhecidos

1. O cookie HttpOnly é contrato `frontend-provisional`, ligado à issue #5.
2. O MSW não consegue persistir `Set-Cookie` interceptado no navegador. O
   harness Playwright instala um cookie HttpOnly real para testar bootstrap sem
   expor o refresh token à aplicação.
3. Os avisos de canvas do jsdom durante axe são limitação do ambiente e não
   representam falha; todas as listas de violações retornaram vazias.
4. A integração com o backend não foi declarada nem simulada como concluída.

## Decisão

T001–T051 estão concluídas e a feature recebe status **Mock-complete**. A
promoção para **Backend-integrated** permanece bloqueada por T052–T057.
