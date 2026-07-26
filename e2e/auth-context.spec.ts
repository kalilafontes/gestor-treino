import { expect, test, type Page } from '@playwright/test';

async function login(page: Page, email: string) {
  await page.goto('/login');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Senha').fill('Prisma123');
  await page.getByRole('button', { name: 'Entrar' }).click();
  const mockUserByEmail: Record<string, string> = {
    'aluno@prisma.test': 'aluno',
    'professor@prisma.test': 'professor',
    'admin@prisma.test': 'adminAcademia',
    'multi@prisma.test': 'multi',
    'semacademia@prisma.test': 'semAcademia',
    'superadmin@prisma.test': 'superAdmin',
  };
  await page.context().addCookies([
    {
      name: 'prisma_refresh',
      value: mockUserByEmail[email] ?? 'aluno',
      url: 'http://127.0.0.1:4173',
      httpOnly: true,
      sameSite: 'Lax',
    },
  ]);
}

test('cadastro, login e contexto único', async ({ page }) => {
  await page.goto('/cadastro');
  await page.getByLabel('Nome completo').fill('Pessoa Nova');
  await page.getByLabel('Email').fill('pessoa.nova@prisma.test');
  await page.getByLabel('Senha').fill('Prisma123');
  await page.getByRole('button', { name: 'Criar conta' }).click();
  await expect(page).toHaveURL(/\/login$/);

  await login(page, 'aluno@prisma.test');
  await expect(page).toHaveURL(/\/app\/treinos$/);
  await expect(page.getByRole('heading', { name: 'Treinos' })).toBeVisible();
});

test('Super Admin entra no contexto global', async ({ page }) => {
  await login(page, 'superadmin@prisma.test');
  await expect(page).toHaveURL(/\/admin\/academias$/);
  await expect(page.getByRole('heading', { name: 'Academias' })).toBeVisible();
});

test('aluno abre o detalhe de um treino', async ({ page }) => {
  await login(page, 'aluno@prisma.test');
  await page.getByRole('link', { name: 'Abrir treino' }).first().click();
  await expect(page).toHaveURL(/\/app\/treinos\/treino-a$/);
  await expect(page.getByRole('heading', { name: 'Treino A — Força' })).toBeVisible();
  await expect(page.getByText('Agachamento livre')).toBeVisible();
  await page.getByRole('button', { name: 'Iniciar treino' }).click();
  await page.getByLabel('Concluir Agachamento livre').check();
  await page.getByRole('button', { name: 'Ver instruções' }).first().click();
  await expect(page.getByText(/Mantenha a postura neutra/)).toBeVisible();
  await page.getByRole('button', { name: 'Concluir treino' }).click();
  await expect(page.getByText(/Treino registrado com sucesso/)).toBeVisible();
});

test('professor abre o detalhe de um plano', async ({ page }) => {
  await login(page, 'professor@prisma.test');
  await page.getByRole('link', { name: 'Ver plano' }).first().click();
  await expect(page).toHaveURL(/\/app\/planos\/plano-hipertrofia$/);
  await expect(page.getByRole('heading', { name: 'Hipertrofia — Iniciante' })).toBeVisible();
  await expect(page.getByText('Alunos neste plano')).toBeVisible();
  await page.getByRole('button', { name: 'Atribuir a um aluno' }).click();
  await page.getByRole('combobox', { name: 'Aluno' }).selectOption('Elisa Souza');
  await page.getByRole('button', { name: 'Confirmar atribuição' }).click();
  await expect(page.getByText(/Elisa Souza recebeu o plano/)).toBeVisible();
  await page.getByRole('button', { name: 'Detalhes' }).first().click();
  await expect(page.getByText(/Descanso recomendado/)).toBeVisible();
});

test('professor busca e cria um plano mockado', async ({ page }) => {
  await login(page, 'professor@prisma.test');
  await page.getByPlaceholder('Buscar plano').fill('mobilidade');
  await expect(page.getByText('Mobilidade e retorno')).toBeVisible();
  await page.getByPlaceholder('Buscar plano').clear();
  await page.getByRole('button', { name: 'Criar novo plano' }).click();
  await page.getByLabel('Nome do plano').fill('Resistência funcional');
  await page.getByLabel('Quantidade de exercícios').fill('4');
  await page.getByRole('button', { name: 'Criar plano', exact: true }).click();
  await expect(page.getByText('Resistência funcional')).toBeVisible();
});

test('usuário com múltiplas funções escolhe contexto por teclado', async ({ page }) => {
  await login(page, 'multi@prisma.test');
  await expect(page).toHaveURL(/\/selecionar-contexto$/);
  const professor = page.getByRole('listitem').filter({ hasText: 'Professor' }).first();
  await professor.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/app\/planos$/);
});

test('reload restaura sessão com refresh', async ({ page }) => {
  await login(page, 'professor@prisma.test');
  await expect(page).toHaveURL(/\/app\/planos$/);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Planos' })).toBeVisible();
});

test('logout local funciona mesmo sob falha da API', async ({ page }) => {
  await login(page, 'aluno@prisma.test');
  await page.evaluate(() => window.__setPrismaMockScenario?.({ failure: 'logout-network' }));
  await page.getByRole('button', { name: 'Sair' }).click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('heading', { name: 'Entre na sua conta' })).toBeVisible();
});

test('URL direta sem função é bloqueada sem encerrar sessão', async ({ page }) => {
  await login(page, 'professor@prisma.test');
  await expect(page).toHaveURL(/\/app\/planos$/);
  await page.evaluate(() => window.history.replaceState({}, '', '/app/treinos'));
  await page.reload();
  await expect(page).toHaveURL(/\/forbidden$/);
  await expect(page.getByText('Sua sessão continua ativa')).toBeVisible();
});

test('layout não cria rolagem horizontal nos viewports críticos', async ({ page }) => {
  await page.goto('/login');
  for (const width of [320, 768, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    const dimensions = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
  }
});

test('tema escuro persiste após recarregar', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('button', { name: 'Ativar modo escuro' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByRole('button', { name: 'Ativar modo claro' })).toBeVisible();
});
