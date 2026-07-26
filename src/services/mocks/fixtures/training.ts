export const mockStudentWorkouts = [
  {
    id: 'treino-a',
    title: 'Treino A — Força',
    coach: 'Paulo Professor',
    frequency: 'Segunda e quinta',
    exercises: 6,
    duration: '50 min',
    status: 'Próximo treino',
  },
  {
    id: 'treino-b',
    title: 'Treino B — Mobilidade',
    coach: 'Paulo Professor',
    frequency: 'Terça e sexta',
    exercises: 5,
    duration: '35 min',
    status: 'Ativo',
  },
] as const;

export const mockTeacherPlans = [
  {
    id: 'plano-hipertrofia',
    title: 'Hipertrofia — Iniciante',
    students: 8,
    exercises: 7,
    updatedAt: 'Atualizado hoje',
  },
  {
    id: 'plano-condicionamento',
    title: 'Condicionamento geral',
    students: 5,
    exercises: 6,
    updatedAt: 'Atualizado ontem',
  },
  {
    id: 'plano-mobilidade',
    title: 'Mobilidade e retorno',
    students: 3,
    exercises: 5,
    updatedAt: 'Atualizado há 3 dias',
  },
];
