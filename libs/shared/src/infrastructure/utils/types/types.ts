import { SetMetadata } from '@nestjs/common';

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
}

export type User = {
  id: string;
  email: string;
  role: UserRole;
};

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
