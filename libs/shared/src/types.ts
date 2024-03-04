import { SetMetadata } from '@nestjs/common';

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
}

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
