# Constituição do Frontend Prisma Academia

**Versão:** 1.1.0  
**Ratificação:** 2026-07-25  
**Última alteração:** 2026-07-25  
**Status:** aprovada para planejamento

Esta Constituição governa especificação, planejamento, implementação e
validação do frontend. Planos e tarefas devem demonstrar conformidade com seus
princípios.

## I. Contrato da API como limite

- O frontend deve consumir somente endpoints, parâmetros, campos, estados e
  comportamentos confirmados pelo backend.
- OpenAPI, implementação, migrations e testes são usados como evidência.
- Divergências entre fontes devem ser registradas; nenhuma interpretação pode
  ser escolhida silenciosamente.
- Necessidades sem suporte devem ser classificadas como pendentes ou futuras,
  nunca simuladas como funcionalidade real.
- Contratos de mock podem antecipar mudanças planejadas apenas quando estiverem
  explicitamente marcados como provisórios, versionados e ligados a uma issue
  ou decisão. Eles não comprovam comportamento do backend.

**Razão:** impedir contratos fictícios e retrabalho de integração.

## II. Isolamento por identidade e contexto

- Toda experiência deve considerar `role_global`, academia ativa e função ativa.
- Chaves de cache, navegação e ações devem carregar o escopo necessário.
- Troca de contexto deve ser explícita e revalidada contra `/v1/auth/me`.
- Ocultar uma ação não é controle de segurança; o backend permanece soberano.
- Falhas conhecidas de isolamento no backend devem ser destacadas na spec e no
  gate de release da feature afetada.

**Razão:** reduzir risco de confusão e vazamento entre academias.

## III. Segurança e privacidade por padrão

- Senhas, access tokens e refresh tokens nunca devem aparecer em logs,
  telemetria, URLs ou mensagens de erro.
- Sessão deve ser limpa no logout e após falha irrecuperável de autenticação.
- Uma resposta 401 pode produzir no máximo uma repetição após refresh.
- Respostas 403 não devem encerrar uma sessão válida.
- Mensagens técnicas do backend devem ser convertidas em mensagens seguras.
- Dependências e decisões de armazenamento de token exigem revisão explícita.

**Razão:** limitar exposição de credenciais e dados pessoais.

## IV. Acessibilidade e responsividade verificáveis

- Jornadas críticas devem cumprir WCAG 2.2 AA.
- A aplicação deve ser operável por teclado e possuir foco visível.
- HTML semântico, nomes acessíveis e associação de erros a campos são
  obrigatórios.
- O fluxo do aluno é mobile-first e deve funcionar a partir de 320 CSS px.
- Estados de loading, vazio, erro e sucesso fazem parte do requisito, não são
  acabamento opcional.

**Razão:** garantir uso real em desktop, tablet, celular e tecnologias assistivas.

## V. Dados remotos têm uma única fonte

- TanStack Query administrará dados vindos da API.
- Dados remotos não serão duplicados em stores globais.
- Estado global será limitado a sessão e contexto ativo.
- Cada mutação deve declarar invalidações de cache.
- Troca ou encerramento de sessão deve cancelar e limpar dados privados.

**Razão:** evitar inconsistência e estado obsoleto.

## VI. Tipagem e validação nas fronteiras

- TypeScript deve operar em modo estrito.
- Tipos gerados do OpenAPI não devem ser editados manualmente.
- Contratos genéricos ou inconsistentes devem possuir adaptadores explícitos.
- React Hook Form e Zod devem refletir apenas restrições confirmadas.
- O backend permanece a autoridade final para validação.

**Razão:** detectar incompatibilidades perto da origem.

## VII. Testes orientados a comportamento

- Todo requisito funcional deve ser verificável por critério de aceite.
- Regras puras terão testes unitários.
- Integrações de tela usarão contratos HTTP simulados de forma fiel.
- Jornadas principais terão testes Playwright.
- Testes de permissão devem cobrir acesso pela URL direta, não apenas menus.
- Testes de acessibilidade fazem parte da definição de pronto.

**Razão:** medir comportamento observável em vez de detalhes internos.

## VIII. Entregas pequenas e independentes

- Features devem ser decomponíveis por história de usuário.
- Tarefas devem indicar dependências, arquivos esperados e condição de conclusão.
- Nenhuma implementação começa com requisito bloqueante não resolvido.
- Funcionalidades condicionadas podem ser especificadas, mas não liberadas como
  completas.
- Dashboards e recursos analíticos vêm depois do fluxo principal.

**Razão:** permitir validação incremental e reduzir risco.

## IX. Desenvolvimento contract-first com mocks

- Cada feature deve declarar um contrato HTTP de frontend antes da implementação.
- O contrato deve indicar sua origem: `backend-confirmed` ou `frontend-provisional`.
- MSW simulará rede e envelopes; componentes não importarão fixtures diretamente.
- Cenários de mock devem incluir sucesso, vazio, 401, 403, 409, 422, 5xx e rede
  quando aplicáveis.
- Adaptadores devem isolar divergências entre contrato provisório e backend.
- A integração real exige testes de contrato contra uma instância do backend.
- Divergências descobertas serão resolvidas alterando o adaptador, a spec ou o
  contrato em decisão explícita, nunca silenciosamente.

**Razão:** permitir avanço independente do frontend sem confundir simulação com
integração validada.

## Gate obrigatório antes da implementação

Uma feature somente pode receber status `Ready for implementation` quando:

1. possui histórias priorizadas e testáveis;
2. requisitos e não objetivos estão identificados;
3. contratos e permissões estão ligados a evidências do backend;
4. dúvidas bloqueantes foram resolvidas;
5. plano técnico foi revisado contra esta Constituição;
6. tarefas cobrem requisitos e critérios de aceite;
7. análise de consistência não contém erro crítico.

## Governança

- Alterações exigem justificativa e revisão dos artefatos dependentes.
- Mudança incompatível de princípio incrementa a versão major.
- Novo princípio ou expansão material incrementa a versão minor.
- Esclarecimento sem mudança de obrigação incrementa a versão patch.
- Toda análise de feature deve registrar violações e sua decisão.

## Histórico

- `1.1.0`: adiciona governança de contratos provisórios e desenvolvimento com mocks.
- `1.0.0`: ratificação inicial.
