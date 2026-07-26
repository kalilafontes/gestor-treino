import type {
  ApiEnvelope,
  RegisterRequest,
  UpdateProfileRequest,
  UserDto,
} from '@/services/api/contracts/auth.v1';
import type { ApiClient } from '@/services/api/http/api-client';

export const authApi = (client: ApiClient) => ({
  me: () => client.request<ApiEnvelope<UserDto>>('/v1/auth/me').then((response) => response.data),
  register: (input: RegisterRequest) =>
    client.request<ApiEnvelope<UserDto>>('/v1/auth/register', {
      method: 'POST',
      auth: false,
      body: input,
    }),
  updateProfile: (input: UpdateProfileRequest) =>
    client
      .request<ApiEnvelope<UserDto>>('/v1/auth/me', { method: 'PATCH', body: input })
      .then((response) => response.data),
});
