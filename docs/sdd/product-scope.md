# Escopo do Produto — Prisma Academia

**Versão:** 0.1  
**Status:** proposta  
**Backend de referência:** commit
`16763b0b3e894744048c34b8ed672133aa`

## Identidade provisória

- Nome do produto: **Prisma Academia**
- Nome curto: **Prisma**
- Repositório sugerido: `prisma-academia-web`
- Package sugerido: `prisma-academia-frontend`

O nome é provisório até validação comercial, de domínio e marca.

## Visão

Aplicação web responsiva e única para uma plataforma SaaS multi-tenant de
academias. Super Admin, administradores e professores usam uma experiência
administrativa otimizada para desktop/tablet. Alunos usam uma experiência
mobile-first para consultar e realizar treinos.

## Resultado principal do MVP

O MVP deve permitir, dentro dos limites da API atual:

1. autenticar o usuário;
2. selecionar academia e função quando houver mais de um vínculo;
3. adicionar professor e aluno à academia;
4. criar o vínculo entre professor e aluno;
5. associar exercícios à academia;
6. criar um plano com exercícios;
7. atribuir o plano ao aluno;
8. permitir que o aluno consulte o plano;
9. registrar e consultar as próprias execuções.

O professor não poderá consultar o histórico das execuções do aluno nesta
versão, pois o backend não fornece contrato autorizado para isso.

## Perfis

### Super Admin

- administra academias;
- administra o catálogo de exercícios conforme permissões efetivas da API;
- pode atribuir a função `admin_academia`.

### Administrador da academia

- administra membros;
- pesquisa usuários;
- administra associações de exercícios;
- administra vínculos professor–aluno.

### Professor

- consulta os próprios alunos vinculados;
- consulta exercícios da academia;
- cria e consulta planos próprios;
- atribui planos próprios;
- administra o status das próprias atribuições.

### Aluno

- consulta atribuições;
- abre os planos recebidos;
- registra execuções;
- consulta o próprio histórico;
- altera o próprio nome.

## Fora do escopo

- pagamentos, assinaturas e mensalidades;
- reconhecimento facial;
- chat e notificações push;
- dieta e avaliação física;
- wearables e inteligência artificial;
- edição ou exclusão de planos;
- edição ou exclusão de execuções;
- acompanhamento de execução pelo professor;
- novos endpoints do backend.

## Decisões provisórias

- Desenvolvimento começa com contratos simulados por MSW.
- Contratos simulados são provisórios e possuem origem declarada.
- Access token permanece em memória no modelo alvo.
- Refresh token será modelado em cookie HttpOnly no contrato provisório, conforme
  a issue de backend #5. Um adaptador temporário será avaliado se o backend real
  ainda retornar o token no corpo durante a integração.
- A UI não expõe criação de planos a usuários que não estejam no contexto
  `professor`, apesar de o backend atualmente exigir somente autenticação.
- O detalhe de plano do aluno só será alcançável a partir de uma atribuição.
- Essas limitações não corrigem problemas de autorização do backend e precisam
  permanecer registradas como risco.

## Estratégia de integração

1. implementar jornadas contra MSW e contratos versionados;
2. validar comportamento visual e critérios de aceite;
3. executar testes de contrato contra o backend;
4. registrar divergências;
5. ajustar adaptadores ou negociar alteração do contrato;
6. somente então declarar a feature integrada.

## Indicadores de sucesso do MVP

- fluxo administrador → professor → aluno concluído em teste ponta a ponta;
- nenhuma jornada crítica depende de endpoint inexistente;
- todos os requisitos funcionais possuem critério de aceite;
- fluxo do aluno funciona a 320 CSS px e somente com teclado;
- nenhuma credencial aparece em logs ou URLs.

## Fontes

- `../../../backend/docs/swagger.json`
- `../../../backend/cmd/api/main.go`
- `../../../backend/internal/`
- `../../../backend/db/migrations/`
- `../../../frontend-spec-v0.1.md`
