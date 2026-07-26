# Prisma Academia — Frontend

Este diretório contém o frontend da plataforma e seus artefatos de
Spec-Driven Development (SDD).

**Prisma Academia** é o nome de trabalho do produto. O nome curto exibido na
interface será **Prisma**.

A Feature 001 (autenticação e contexto ativo) está implementada e validada
contra MSW com status **Mock-complete**. A integração com o backend real
permanece em uma fase futura e não deve ser considerada concluída.

## Fluxo SDD

1. Constituição do projeto
2. Escopo do produto
3. Especificação da feature
4. Clarificações
5. Plano técnico
6. Tarefas
7. Análise de consistência
8. Implementação
9. Validação

Uma feature somente pode entrar em implementação quando sua especificação,
clarificações, plano, tarefas e análise estiverem aprovados.

## Documentação

- [Constituição](docs/sdd/constitution.md)
- [Escopo do produto](docs/sdd/product-scope.md)
- [Índice das features](docs/sdd/features/README.md)
- [Registro de decisões](docs/sdd/decisions/README.md)
- [ADR-0001 — Nome do produto](docs/sdd/decisions/0001-project-name.md)
- [ADR-0002 — Desenvolvimento mock-first](docs/sdd/decisions/0002-mock-first-contracts.md)
