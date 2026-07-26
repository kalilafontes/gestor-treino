# ADR-0001 — Nome de trabalho Prisma Academia

**Data:** 2026-07-25  
**Status:** aceita como decisão provisória  
**Features afetadas:** todas

## Contexto

O frontend precisa de uma identidade consistente para documentação, interface,
repositório e artefatos de desenvolvimento.

## Alternativas

1. **Prisma:** curto, mas facilmente confundido com ferramentas técnicas.
2. **Prisma Academia:** preserva o conceito e explicita o domínio.
3. Manter nome genérico até o lançamento.

## Decisão

Usar **Prisma Academia** como nome de trabalho e **Prisma** como nome curto na
interface. Usar `prisma-academia-web` para o repositório e
`prisma-academia-frontend` para o package.

## Impactos

- textos e metadados usarão Prisma Academia;
- imports e dependências não usarão namespace ambíguo `prisma`;
- antes de uso comercial serão verificadas marca e disponibilidade de domínio;
- a troca futura de marca não deve afetar nomes de domínio do código.
