export type ContractOrigin = 'backend-confirmed' | 'frontend-provisional';

export const authContract = {
  version: 'auth.v1',
  issue: '#5',
  operations: {
    login: { origin: 'frontend-provisional', backendDifference: 'refresh_token no corpo' },
    refresh: { origin: 'frontend-provisional', backendDifference: 'refresh_token no JSON' },
    logout: { origin: 'frontend-provisional', backendDifference: 'refresh_token no JSON' },
    register: { origin: 'backend-confirmed' },
    me: { origin: 'backend-confirmed' },
    updateMe: { origin: 'backend-confirmed' },
  } satisfies Record<string, { origin: ContractOrigin; backendDifference?: string }>,
} as const;

export type GlobalRole = 'padrao' | 'super_admin';
export type AcademyFunction = 'aluno' | 'professor' | 'admin_academia';

export interface AcademyMembershipDto {
  academia_id: string;
  academia_nome: string;
  funcao: AcademyFunction;
}

export interface UserDto {
  id: string;
  nome_completo: string;
  email: string;
  role_global: GlobalRole;
  academias: AcademyMembershipDto[];
}

export interface ApiEnvelope<T> {
  data: T;
  message?: string;
}

export interface ValidationEnvelope {
  message?: string;
  errors: Record<string, string[] | string>;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface RegisterRequest extends LoginRequest {
  nome_completo: string;
}

export interface UpdateProfileRequest {
  nome_completo: string;
}

export interface AccessTokenDto {
  access_token: string;
  expires_in: number;
}

export type LoginResponse = ApiEnvelope<AccessTokenDto>;
export type RefreshResponse = ApiEnvelope<AccessTokenDto>;
export type MeResponse = ApiEnvelope<UserDto>;
