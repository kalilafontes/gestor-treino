# Clarificações — Feature 001

**Status:** resolvidas em 2026-07-25

| ID     | Pergunta                                                         | Impacto                                      | Decisão                                                                                                                     |
| ------ | ---------------------------------------------------------------- | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| CL-001 | Cadastro público entra no MVP?                                   | Define `/cadastro` e teste associado.        | Sim, com rota pública e contrato atual confirmado.                                                                          |
| CL-002 | Aceitar sessão limitada à aba?                                   | Confirma uso temporário de `sessionStorage`. | Não como modelo alvo. Mock usará refresh em cookie HttpOnly conforme issue #5; compatibilidade será decidida na integração. |
| CL-003 | Seleção explícita ou navegação combinada para múltiplas funções? | Afeta modelo de contexto e menus.            | Seleção explícita de academia e função.                                                                                     |
| CL-004 | Preservar URL após expiração?                                    | Afeta redirecionamento pós-login.            | Sim, somente URL interna segura e autorizada após novo login.                                                               |
| CL-005 | Existe conteúdo de marca aprovado?                               | Afeta apenas conteúdo visual.                | Usar Prisma Academia como marca provisória.                                                                                 |

Nenhuma clarificação bloqueante permanece. Alterações durante a integração
devem gerar nova decisão ou revisão desta feature.
