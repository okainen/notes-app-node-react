import {User} from '@/entities';

export default interface IUserGateway {
  create: (user: User) => Promise<User>;
  get: (id: string) => Promise<User | null>;
  getByEmail: (email: string) => Promise<User | null>;
  getByUsername: (username: string) => Promise<User | null>;
  update: (user: User) => Promise<User | null>;
  delete: (id: string) => Promise<User | null>;
}
