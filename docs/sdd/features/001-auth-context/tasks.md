# Tarefas — Feature 001: Autenticação e Contexto Ativo

**Status:** T001–T051 concluídas — Mock-complete  
**Dependência:** aprovação de `analysis.md`  
**Regra:** testes comportamentais precedem ou acompanham a implementação.

> Registro de execução: as tarefas T001–T051 foram implementadas e validadas em
> 2026-07-25. As caixas abaixo permanecem como decomposição histórica; o resultado
> verificável e os desvios estão registrados em `acceptance.md`. T052–T057 seguem
> pendentes por pertencerem ao gate futuro de integração real.

## Fase 1 — Fundação

- [ ] **T001** Criar scaffold Vite React TypeScript em `frontend/`.
- [ ] **T002** Configurar TypeScript strict, lint, formatter e aliases.
- [ ] **T003** Instalar/configurar Router, Query, RHF, Zod, Tailwind e shadcn/ui.
- [ ] **T004** Configurar Vitest, Testing Library, user-event, MSW e axe.
- [ ] **T005** Configurar Playwright e projetos de viewport desktop/mobile.
- [ ] **T006** Criar providers da aplicação e Error Boundary.

**Checkpoint:** aplicação vazia inicia e suites vazias executam.

## Fase 2 — Contratos e mocks

- [ ] **T007** Criar envelopes e DTOs de auth em
      `src/services/api/contracts/auth.v1.ts`.
- [ ] **T008** Documentar origem confirmada/provisória por operação.
- [ ] **T009** Criar cliente `fetch` centralizado com erro normalizado.
- [ ] **T010** Criar interface `sessionTransport` para cookie alvo e legado futuro.
- [ ] **T011** Criar fixtures de perfis em `src/services/mocks/fixtures/`.
- [ ] **T012** Criar handlers MSW de login, cadastro, refresh, logout e `/me`.
- [ ] **T013** Criar handlers de perfil, 401, 403, 409, 422, 5xx e rede.
- [ ] **T014** Adicionar teste que proíbe import de fixtures fora de mocks/testes.

**Checkpoint:** contratos podem ser exercitados pelo cliente sem componente.

## Fase 3 — Sessão

- [ ] **T015** Escrever testes unitários da máquina de sessão.
- [ ] **T016** Escrever teste de três 401 concorrentes com um refresh.
- [ ] **T017** Implementar armazenamento do access token em memória.
- [ ] **T018** Implementar refresh single-flight e limite de uma repetição.
- [ ] **T019** Implementar limpeza atômica de sessão e QueryClient.
- [ ] **T020** Implementar bootstrap sem flash de conteúdo.

**Checkpoint:** sessão restaura, expira e limpa dados conforme a spec.

## Fase 4 — Login e cadastro

- [ ] **T021** Escrever testes de validação dos schemas.
- [ ] **T022** Escrever testes de integração da página de login.
- [ ] **T023** Implementar página de login acessível.
- [ ] **T024** Escrever testes de cadastro, conflito 409 e 422.
- [ ] **T025** Implementar página de cadastro acessível.
- [ ] **T026** Implementar retorno interno seguro após novo login.

**Checkpoint:** US-001 e cadastro público funcionam integralmente com MSW.

## Fase 5 — Perfil e contexto

- [ ] **T027** Escrever testes do modelo de contexto e preferência inválida.
- [ ] **T028** Implementar query `/me` e adaptador de perfil.
- [ ] **T029** Implementar contexto global do Super Admin.
- [ ] **T030** Implementar seleção automática de contexto único.
- [ ] **T031** Implementar página acessível de seleção múltipla.
- [ ] **T032** Implementar estado `/sem-academia`.
- [ ] **T033** Escrever testes de guards por sessão, papel e função.
- [ ] **T034** Implementar guards do router.
- [ ] **T035** Escrever testes e implementar edição de `nome_completo`.

**Checkpoint:** US-002 e US-004 funcionam em todos os perfis mockados.

## Fase 6 — Logout e resiliência

- [ ] **T036** Escrever teste de logout com sucesso e falha de rede.
- [ ] **T037** Implementar logout com limpeza local incondicional.
- [ ] **T038** Implementar página 403 preservando sessão.
- [ ] **T039** Implementar feedback padronizado de loading, erro e retry.

**Checkpoint:** US-003 e US-005 atendem critérios de falha.

## Fase 7 — Acessibilidade e E2E

- [ ] **T040** Criar testes axe de login, cadastro, contexto e perfil.
- [ ] **T041** Criar Playwright cadastro → login → contexto único.
- [ ] **T042** Criar Playwright Super Admin e múltiplos contextos.
- [ ] **T043** Criar Playwright reload/refresh e expiração/retorno.
- [ ] **T044** Criar Playwright logout sob falha.
- [ ] **T045** Executar jornada por teclado em viewport mobile.
- [ ] **T046** Verificar 320, 768 e 1280 CSS px.

## Fase 8 — Gate mock-complete

- [ ] **T047** Gerar matriz requisito → critério → teste em `acceptance.md`.
- [ ] **T048** Executar lint, typecheck, unit, integration e E2E.
- [ ] **T049** Confirmar ausência de segredo/log sensível.
- [ ] **T050** Confirmar que contratos provisórios não estão marcados como integrados.
- [ ] **T051** Atualizar status para `Mock-complete` após aprovação.

## Fase futura — Integração real

- [ ] **T052** Atualizar OpenAPI do commit integrado.
- [ ] **T053** Executar testes de contrato contra backend.
- [ ] **T054** Implementar/selecionar transport compatível com refresh real.
- [ ] **T055** Corrigir divergências por decisão explícita.
- [ ] **T056** Executar smoke Playwright sem MSW.
- [ ] **T057** Promover operações validadas para `backend-confirmed`.

T052–T057 não bloqueiam o status `Mock-complete`; bloqueiam
`Backend-integrated`.
