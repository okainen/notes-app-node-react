import {RefreshToken} from '@/entities';

export default interface IRefreshTokenGateway {
  create: (token: RefreshToken) => Promise<RefreshToken>;
  get: (id: string) => Promise<RefreshToken | null>;
  getByUserId: (userId: string) => Promise<RefreshToken | null>;
  delete: (id: string) => Promise<RefreshToken | null>;
}
