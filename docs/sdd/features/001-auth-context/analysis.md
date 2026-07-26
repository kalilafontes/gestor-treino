# Análise de Consistência — Feature 001

**Data:** 2026-07-25  
**Status:** aprovado para iniciar implementação após revisão humana

## Artefatos analisados

- Constituição 1.1.0;
- escopo do produto;
- ADR-0001 e ADR-0002;
- `spec.md`;
- `clarifications.md`;
- `plan.md`;
- `tasks.md`;
- OpenAPI e implementação do backend no commit de referência.

## Cobertura

| Área              | Spec                | Plano      | Tarefas         | Resultado |
| ----------------- | ------------------- | ---------- | --------------- | --------- |
| Login             | RF-AUTH-001/002     | §§5, 7, 10 | T021–T026       | Coberto   |
| Refresh           | RF-AUTH-004/005/006 | §§5, 8     | T015–T020       | Coberto   |
| Logout            | RF-AUTH-009         | §§5, 8     | T036–T037       | Coberto   |
| Perfil            | RF-AUTH-010/011     | §§9–10     | T028, T035      | Coberto   |
| Contexto          | RF-CTX-001–006      | §6         | T027–T034       | Coberto   |
| 401/403           | RF-AUTH-005–008     | §§5, 13    | T016–T020, T038 | Coberto   |
| Acessibilidade    | Constituição IV     | §11        | T040–T046       | Coberto   |
| Mock-first        | Constituição IX     | §8         | T007–T014, T050 | Coberto   |
| Integração futura | ADR-0002            | §12        | T052–T057       | Coberto   |

## Divergências conscientes

### D-001 — Refresh token

- Backend analisado: token no corpo.
- Contrato mock: cookie HttpOnly.
- Classificação: `frontend-provisional`.
- Origem: issue #5 e ADR-0002.
- Isolamento: `sessionTransport`.
- Resultado: não bloqueia mock; bloqueia integração real.

### D-002 — Logout

- Swagger analisado: 204.
- Implementação analisada: 200 com JSON.
- Plano: cliente aceita sucesso 2xx sem depender do corpo.
- Resultado: mitigado.

### D-003 — DTOs de resposta genéricos

- Swagger: `data: object`.
- Implementação: DTOs identificáveis no código.
- Plano: contratos locais versionados e validação nas fronteiras críticas.
- Resultado: mitigado até melhoria do OpenAPI.

## Verificações

- Não há requisito funcional sem tarefa correspondente.
- Não há clarificação bloqueante pendente.
- Nenhuma tarefa de integração real foi confundida com mock-complete.
- Componentes não terão dependência direta de fixtures.
- Cadastro público foi incluído de forma consistente.
- Nome Prisma Academia não afeta domínios técnicos das features.

## Riscos remanescentes

1. O backend final pode não adotar cookie HttpOnly.
2. Contratos simulados podem divergir em mensagens e envelopes.
3. A validação comercial do nome Prisma Academia não foi realizada.
4. Métricas quantitativas de performance serão definidas na fundação.

## Decisão

Os artefatos estão consistentes para iniciar T001–T006 após aprovação humana.
A feature deverá ser reportada como `Mock-complete` até a execução de T052–T057.
