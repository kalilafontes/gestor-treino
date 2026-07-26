import type { UserDto } from '@/services/api/contracts/auth.v1';

export const mockUsers = {
  aluno: {
    id: 'usr-aluno',
    nome_completo: 'Ana Aluna',
    email: 'aluno@prisma.test',
    role_global: 'padrao',
    academias: [
      {
        academia_id: 'academia-prisma',
        academia_nome: 'Academia Prisma',
        funcao: 'aluno',
      },
    ],
  },
  professor: {
    id: 'usr-professor',
    nome_completo: 'Paulo Professor',
    email: 'professor@prisma.test',
    role_global: 'padrao',
    academias: [
      {
        academia_id: 'academia-prisma',
        academia_nome: 'Academia Prisma',
        funcao: 'professor',
      },
    ],
  },
  adminAcademia: {
    id: 'usr-admin',
    nome_completo: 'Amanda Administradora',
    email: 'admin@prisma.test',
    role_global: 'padrao',
    academias: [
      {
        academia_id: 'academia-prisma',
        academia_nome: 'Academia Prisma',
        funcao: 'admin_academia',
      },
    ],
  },
  multi: {
    id: 'usr-multi',
    nome_completo: 'Marina Multi',
    email: 'multi@prisma.test',
    role_global: 'padrao',
    academias: [
      {
        academia_id: 'academia-prisma',
        academia_nome: 'Academia Prisma',
        funcao: 'professor',
      },
      {
        academia_id: 'academia-prisma',
        academia_nome: 'Academia Prisma',
        funcao: 'admin_academia',
      },
      {
        academia_id: 'academia-centro',
        academia_nome: 'Prisma Centro',
        funcao: 'professor',
      },
    ],
  },
  semAcademia: {
    id: 'usr-sem-academia',
    nome_completo: 'Samuel Sem Academia',
    email: 'semacademia@prisma.test',
    role_global: 'padrao',
    academias: [],
  },
  superAdmin: {
    id: 'usr-super',
    nome_completo: 'Sara Super Admin',
    email: 'superadmin@prisma.test',
    role_global: 'super_admin',
    academias: [],
  },
} satisfies Record<string, UserDto>;

export type MockUserKey = keyof typeof mockUsers;
