# Plano Técnico — Feature 001: Autenticação e Contexto Ativo

**Status:** Executado — Mock-complete  
**Data:** 2026-07-25  
**Spec:** [spec.md](spec.md)  
**Constituição:** [../../constitution.md](../../constitution.md)

## 1. Objetivo técnico

Construir a fundação do Prisma Academia e entregar autenticação, cadastro,
bootstrap de sessão, perfil, logout, seleção de academia/função e guards de
rota. A primeira implementação usará MSW como fronteira HTTP. Componentes não
conhecerão se a resposta veio do mock ou do backend.

## 2. Gate da Constituição

| Princípio               | Atendimento                                                  |
| ----------------------- | ------------------------------------------------------------ |
| Contrato como limite    | DTOs e contratos versionados; origem declarada               |
| Isolamento por contexto | academia e função formam identidade do contexto              |
| Segurança               | access token em memória; refresh inacessível aos componentes |
| Acessibilidade          | teclado, foco, erros associados e WCAG 2.2 AA                |
| Fonte única remota      | TanStack Query para `/me`; sem duplicação em store           |
| Tipagem                 | TypeScript strict e Zod nas fronteiras críticas              |
| Testes                  | unitários, integração com MSW e Playwright                   |
| Entregas pequenas       | tarefas organizadas por história                             |
| Mock contract-first     | handlers na rede; fixtures privadas ao mock                  |

**Resultado:** aprovado. A divergência de refresh é aceita como contrato
`frontend-provisional` ligado à issue #5.

## 3. Stack e configuração

- React + TypeScript strict + Vite;
- React Router;
- TanStack Query;
- React Hook Form + Zod;
- Tailwind CSS + shadcn/ui;
- cliente HTTP baseado em `fetch`;
- MSW para desenvolvimento e testes;
- Vitest + Testing Library + `@testing-library/user-event`;
- Playwright;
- axe para verificações automatizadas de acessibilidade;
- ESLint e formatter configurados no scaffold.

Não adicionar store global externa na Feature 001. Contextos React pequenos são
suficientes para sessão e contexto ativo.

## 4. Estrutura prevista

```text
frontend/
  src/
    app/
      providers/
      router/
    components/
      feedback/
    features/
      auth/
        api/
        components/
        hooks/
        pages/
        schemas/
        session/
      context/
        components/
        pages/
        model/
    layouts/
    services/
      api/
        contracts/
        generated/
        http/
      mocks/
        handlers/
        fixtures/
    test/
    utils/
  e2e/
```

Fixtures permanecem sob `services/mocks` e não podem ser importadas por
features.

## 5. Modelo de sessão

### 5.1 Estado

```text
unknown → anonymous
unknown → refreshing → authenticated
anonymous → authenticating → authenticated
authenticated → refreshing → authenticated
authenticated → refreshing → anonymous
authenticated → signingOut → anonymous
```

O estado da sessão contém:

- access token em memória;
- status da sessão;
- usuário atual derivado da query `['me']`;
- função para autenticar, renovar e sair.

Não contém refresh token. No contrato provisório, o navegador administra o
cookie HttpOnly.

### 5.2 Bootstrap

1. aplicação inicia em `unknown`;
2. tenta `POST /auth/refresh` com credenciais;
3. em sucesso, guarda access token em memória;
4. consulta `/auth/me`;
5. valida preferência de contexto;
6. libera router privado;
7. em 401, torna sessão `anonymous`.

Uma tela neutra de bootstrap impede flash de conteúdo ou formulário de login.

### 5.3 Refresh single-flight

O módulo de sessão expõe uma Promise compartilhada:

- primeira resposta 401 inicia refresh;
- outras requisições aguardam a mesma Promise;
- refresh e login não passam pelo interceptor de refresh;
- requisição original recebe marcador de uma repetição;
- falha limpa sessão e QueryClient uma única vez.

## 6. Contexto ativo

Tipo conceitual:

```text
GlobalContext { kind: "global", role: "super_admin" }
AcademyContext {
  kind: "academy",
  academyId,
  academyName,
  function: "admin_academia" | "professor" | "aluno"
}
```

Regras:

- opções derivadas de `/me`;
- preferência persistida contém apenas `academyId` e `function`;
- preferência revalidada em todo bootstrap;
- contexto inválido é removido;
- Super Admin usa contexto global;
- um contexto é selecionado automaticamente;
- mais de um leva a `/selecionar-contexto`.

## 7. Rotas da feature

| Rota                   | Acesso                              | Página             |
| ---------------------- | ----------------------------------- | ------------------ |
| `/login`               | anônimo                             | Login              |
| `/cadastro`            | anônimo                             | Cadastro           |
| `/selecionar-contexto` | autenticado com múltiplos contextos | Seleção            |
| `/sem-academia`        | autenticado padrão sem vínculo      | Estado sem vínculo |
| `/perfil`              | autenticado                         | Perfil             |
| `/forbidden`           | autenticado                         | Sem permissão      |

Guards:

- `AnonymousOnly`;
- `RequireSession`;
- `RequireContext`;
- `RequireGlobalRole`;
- `RequireAcademyFunction`.

Guardas aceitam uma rota de retorno somente se for caminho interno iniciado por
`/`, não contiver protocolo e continuar autorizado após login.

## 8. Contratos HTTP

### 8.1 Baseline

Criar `services/api/contracts/auth.v1.ts` com:

- requests confirmados do OpenAPI;
- responses tipadas a partir da implementação analisada;
- envelope comum;
- envelope 422;
- `MeResponse` e vínculos.

Cada operação recebe metadado documental:

- `backend-confirmed`;
- `frontend-provisional`.

### 8.2 Diferença provisória

| Operação | Backend analisado        | Contrato mock alvo            |
| -------- | ------------------------ | ----------------------------- |
| login    | retorna access + refresh | retorna access; envia cookie  |
| refresh  | recebe refresh no JSON   | recebe cookie; retorna access |
| logout   | recebe refresh no JSON   | usa cookie e Bearer           |

O módulo `sessionTransport` será a única camada autorizada a conhecer essa
diferença. Durante integração poderá existir implementação `legacyBodyToken`,
sem alterar páginas ou componentes.

### 8.3 Cenários MSW

- login válido;
- credenciais inválidas;
- cadastro criado, email duplicado e validação;
- refresh válido, expirado e revogado;
- `/me` Super Admin;
- `/me` sem academia;
- `/me` com um vínculo;
- `/me` com múltiplas academias/funções;
- perfil atualizado e 422;
- logout bem-sucedido e falha de rede;
- 403 em rota protegida;
- latência controlada para estados de loading.

Seleção de cenário deve ocorrer por configuração de teste, não por query
parameter de produção.

## 9. TanStack Query

- `['me']`: habilitada somente com access token;
- `staleTime`: 5 minutos;
- retry: uma vez para rede/5xx, nunca para 401/403;
- logout/falha definitiva: `cancelQueries` seguido de `clear`;
- edição de perfil: atualizar cache com response e invalidar `['me']`;
- refresh de token não invalida dados por si só.

## 10. Formulários

### Login

- email obrigatório e válido;
- senha obrigatória;
- erro 401 geral, sem revelar qual campo falhou.

### Cadastro

- `nome_completo`: mínimo 2;
- email válido;
- senha: mínimo 8;
- conflito 409 preserva valores e associa mensagem ao email.

### Perfil

- `nome_completo`: trim, 2–255;
- somente esse campo é enviado.

Erros 422 são convertidos de nomes do wire para nomes do formulário.
`_body` torna-se erro geral seguro.

## 11. UX e acessibilidade

- formulário possui heading, labels e descrição;
- primeiro erro recebe foco ou resumo anunciado;
- estado de envio bloqueia duplo submit;
- mensagens usam região `aria-live`;
- seletor de contexto funciona por teclado;
- foco retorna de diálogos;
- páginas funcionam em 320, 768 e 1280 CSS px;
- nenhuma informação depende somente de cor;
- respeitar movimento reduzido.

## 12. Testes

### Unitários

- máquina de sessão;
- validação e seleção de contexto;
- sanitização da rota de retorno;
- mapeamento de erros;
- single-flight.

### Integração

- páginas com MSW;
- bootstrap em todos os perfis;
- login/cadastro/perfil/logout;
- 401 concorrente e refresh único;
- 403 sem perda de sessão;
- contexto persistido inválido;
- loading, erro e ausência de academia;
- axe nas páginas principais.

### Playwright com MSW

1. cadastro → login → contexto único;
2. login Super Admin;
3. login com múltiplos contextos;
4. reload → refresh → restauração;
5. expiração → login → rota interna pretendida;
6. logout com falha simulada;
7. jornada integral por teclado.

### Gate de integração real

Posteriormente:

- executar os mesmos contratos contra backend;
- comparar status, headers e corpos;
- registrar divergências;
- promover contrato para `backend-confirmed`;
- executar smoke Playwright sem MSW.

## 13. Entregas internas

1. fundação e qualidade;
2. contratos, cliente e MSW;
3. sessão e refresh;
4. login e cadastro;
5. `/me`, contexto e guards;
6. perfil e logout;
7. acessibilidade e E2E;
8. análise final da feature;
9. integração real futura.

## 14. Definição de pronto da implementação mock

- critérios da spec passam;
- mocks cobrem estados previstos;
- nenhuma feature importa fixture;
- requisitos possuem teste;
- axe sem violação crítica nas páginas da feature;
- Playwright crítico verde;
- contrato ainda aparece como provisório;
- feature é rotulada `Mock-complete`, não `Backend-integrated`.
