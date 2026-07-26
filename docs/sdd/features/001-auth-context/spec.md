# Feature 001 — Autenticação e Contexto Ativo

**Prioridade:** P0  
**Status:** Mock-complete  
**Fase:** Validate  
**Dependências:** API de autenticação existente

## Problema

Usuários precisam entrar com segurança e acessar uma experiência coerente com
seu papel global e seus vínculos em academias. Um usuário pode possuir várias
funções e academias, portanto a sessão autenticada não determina sozinha a
navegação ativa.

## Objetivo

Permitir autenticação, restauração temporária da sessão, consulta e edição do
perfil, logout e seleção explícita de academia/função ativa.

## Não objetivos

- recuperação de senha;
- verificação de email;
- autenticação social ou multifator;
- administração de contas;
- convite de usuários;
- alterar email ou senha;
- implementação do cookie HttpOnly no backend; o frontend apenas modelará e
  consumirá o contrato provisório.

## Atores

- visitante;
- usuário padrão sem vínculo;
- aluno;
- professor;
- administrador da academia;
- Super Admin.

## Histórias de usuário

### US-001 — Entrar

Como usuário cadastrado, quero autenticar com email e senha para acessar os
recursos permitidos.

**Prioridade:** P0  
**Teste independente:** login válido carrega `/auth/me` e leva ao destino correto.

### US-002 — Selecionar contexto

Como usuário com múltiplos vínculos, quero escolher academia e função para que a
navegação represente o trabalho que pretendo realizar.

**Prioridade:** P0  
**Teste independente:** selecionar um vínculo altera a navegação e persiste
somente a preferência não sensível.

### US-003 — Recuperar sessão na mesma aba

Como usuário autenticado, quero continuar conectado após recarregar a página
enquanto meu refresh token temporário for válido.

**Prioridade:** P0  
**Teste independente:** reload usa refresh uma vez e recupera `/auth/me`.

### US-004 — Editar perfil

Como usuário autenticado, quero alterar meu nome para manter o perfil correto.

**Prioridade:** P1  
**Teste independente:** nome válido é salvo e refletido no cabeçalho.

### US-005 — Sair

Como usuário autenticado, quero encerrar a sessão e remover meus dados privados
do navegador.

**Prioridade:** P0  
**Teste independente:** logout limpa sessão e cache mesmo se a revogação falhar.

## Requisitos funcionais

- **RF-AUTH-001:** o login deve enviar exclusivamente `email` e `senha` para
  `POST /v1/auth/login`.
- **RF-AUTH-002:** após login, a aplicação deve consultar
  `GET /v1/auth/me` antes de liberar uma rota privada.
- **RF-AUTH-003:** o access token deve ser mantido em memória e anexado como
  Bearer às chamadas protegidas.
- **RF-AUTH-004:** o contrato provisório deve modelar refresh token em cookie
  HttpOnly, conforme issue #5; componentes não podem acessar o refresh token.
- **RF-AUTH-005:** respostas 401 concorrentes devem compartilhar uma única
  tentativa de refresh.
- **RF-AUTH-006:** cada requisição original pode ser repetida no máximo uma vez.
- **RF-AUTH-007:** falha de refresh deve limpar sessão e cache privado.
- **RF-AUTH-008:** 403 deve preservar sessão e mostrar falta de permissão.
- **RF-AUTH-009:** logout deve enviar o refresh token para
  `POST /v1/auth/logout` e limpar dados locais independentemente do resultado.
- **RF-AUTH-010:** perfil deve ser obtido de `GET /v1/auth/me`.
- **RF-AUTH-011:** edição de perfil deve enviar exclusivamente
  `nome_completo` para `PATCH /v1/auth/me`.
- **RF-CTX-001:** contextos disponíveis devem ser derivados somente de
  `data.academias` de `/auth/me`.
- **RF-CTX-002:** usuário com um único vínculo deve entrar automaticamente
  nesse contexto.
- **RF-CTX-003:** usuário com múltiplos vínculos deve selecionar academia e
  função.
- **RF-CTX-004:** contexto persistido deve ser revalidado contra `/auth/me`.
- **RF-CTX-005:** usuário padrão sem vínculos deve ver o estado
  “Aguardando vínculo”, sem módulos de academia.
- **RF-CTX-006:** Super Admin deve entrar no contexto global de administração.

## Regras de negócio

1. `role_global` possui os valores confirmados `padrao` e `super_admin`.
2. Funções de academia confirmadas: `aluno`, `professor`, `admin_academia`.
3. O mesmo usuário pode ter mais de uma função na mesma academia.
4. Cada linha de `academias` retornada por `/auth/me` representa um contexto
   selecionável.
5. Preferência de contexto não concede permissão.
6. O contexto deixa de ser válido imediatamente quando não aparecer em
   `/auth/me`.

## Contratos de API

| Operação                 | Entrada                                | Resultado relevante                               |
| ------------------------ | -------------------------------------- | ------------------------------------------------- |
| `POST /v1/auth/login`    | `email`, `senha`                       | `access_token`, `refresh_token`, `expires_in=900` |
| `POST /v1/auth/refresh`  | cookie no contrato provisório          | novo access token; refresh é rotacionado          |
| `POST /v1/auth/logout`   | Bearer + cookie no contrato provisório | sessão revogada                                   |
| `GET /v1/auth/me`        | Bearer                                 | usuário e lista `academias`                       |
| `PATCH /v1/auth/me`      | Bearer + `nome_completo`               | perfil atualizado                                 |
| `POST /v1/auth/register` | nome, email, senha                     | cadastro público incluído no MVP                  |

As operações de cookie são `frontend-provisional` e estão vinculadas à issue #5.
O contrato confirmado do commit de referência ainda recebe/devolve
`refresh_token` no corpo. Essa divergência será isolada no adaptador de sessão.

## Estados de interface

### Login

- inicial;
- enviando;
- credenciais inválidas;
- validação 422;
- falha de rede;
- sucesso aguardando `/me`.

### Bootstrap

- verificando sessão;
- sessão recuperada;
- sessão ausente/expirada;
- perfil indisponível;
- contexto único;
- múltiplos contextos;
- nenhum vínculo.

### Perfil

- carregando;
- pronto;
- salvando;
- sucesso;
- erro de validação;
- falha recuperável.

## Navegação esperada

| Condição              | Destino                |
| --------------------- | ---------------------- |
| não autenticado       | `/login`               |
| Super Admin           | `/admin/academias`     |
| usuário sem vínculo   | `/sem-academia`        |
| um contexto aluno     | `/app/treinos`         |
| um contexto professor | `/app/planos`          |
| um contexto admin     | `/app/membros`         |
| múltiplos contextos   | `/selecionar-contexto` |

## Exceções e erros

- 401 no login: “Email ou senha inválidos”.
- 401 em chamada protegida: tentar refresh conforme regras.
- 401 no refresh: encerrar sessão.
- 403: “Você não tem permissão para acessar este recurso”.
- 422: associar erros confirmados aos campos; erro `_body` vira mensagem geral.
- 5xx/rede: permitir nova tentativa sem duplicar submissões.

## Critérios de aceite

### CA-AUTH-001

**Given** credenciais válidas  
**When** o usuário envia o login  
**Then** a aplicação recebe tokens, consulta `/auth/me` e redireciona pelo
contexto sem registrar credenciais.

### CA-AUTH-002

**Given** três requisições protegidas retornando 401 simultaneamente  
**When** o refresh token é válido  
**Then** ocorre uma única chamada de refresh e cada requisição é repetida no
máximo uma vez.

### CA-AUTH-003

**Given** refresh inválido ou revogado  
**When** a restauração falha  
**Then** tokens, perfil, contexto e cache privado são removidos e o usuário vai
para `/login`.

### CA-CTX-001

**Given** um usuário com duas funções na mesma academia  
**When** ele escolhe uma função  
**Then** a navegação usa a função escolhida e a preferência é revalidada no
próximo bootstrap.

### CA-CTX-002

**Given** contexto salvo que não existe mais em `/auth/me`  
**When** a sessão é restaurada  
**Then** o contexto é descartado e uma nova seleção é solicitada.

### CA-PROFILE-001

**Given** usuário autenticado  
**When** salva `nome_completo` válido  
**Then** a resposta atualiza o perfil exibido sem reload completo.

### CA-LOGOUT-001

**Given** usuário autenticado  
**When** solicita logout e a API está indisponível  
**Then** todos os dados locais ainda são removidos e o login é exibido.

## Dependências e riscos

- backend pode ainda exigir refresh acessível ao JavaScript durante a integração;
- Swagger não tipa adequadamente os DTOs de resposta;
- logout está documentado como 204, mas implementado como 200;
- múltiplas abas não compartilham `sessionStorage`;
- cadastro público permanece como decisão de produto.

## Dúvidas para a etapa Clarify

As dúvidas foram resolvidas em `clarifications.md`. Nenhuma permanece bloqueante
para o plano.
