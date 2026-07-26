# ADR-0002 — Desenvolvimento mock-first e contract-first

**Data:** 2026-07-25  
**Status:** aceita  
**Features afetadas:** todas

## Contexto

O frontend deve avançar antes da conclusão das issues de backend. O contrato
atual possui lacunas e divergências, e algumas correções podem alterar requests,
responses, autorização e armazenamento de sessão.

## Alternativas

1. Esperar todas as correções do backend.
2. Usar fixtures diretamente dentro dos componentes.
3. Desenvolver contra uma API simulada na fronteira HTTP e integrar depois.

## Decisão

Adotar a terceira alternativa:

- MSW interceptará chamadas HTTP em desenvolvimento e testes;
- contratos ficarão em arquivos versionados por feature;
- todo contrato declarará `backend-confirmed` ou `frontend-provisional`;
- handlers MSW responderão com os mesmos envelopes esperados da API;
- componentes consumirão somente o cliente HTTP, nunca fixtures;
- adaptadores converterão wire DTOs em modelos de tela;
- a integração real terá um gate próprio.

## Contratos provisórios

Um contrato provisório deve conter:

- versão;
- issue/decisão de origem;
- diferença em relação ao backend analisado;
- impacto esperado na integração;
- cenários simulados;
- critério para promoção a confirmado.

## Consequências

### Positivas

- jornadas e acessibilidade podem ser validadas cedo;
- erros e estados vazios são reproduzíveis;
- mudanças do backend ficam concentradas na camada de integração.

### Riscos

- mocks podem divergir do backend;
- testes podem passar sem comprovar integração;
- contratos provisórios podem ser confundidos com contratos reais.

## Mitigações

- testes de contrato contra backend;
- inventário de divergências;
- proibição de acesso direto a fixtures pelos componentes;
- status de integração visível em cada feature.
