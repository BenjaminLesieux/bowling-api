import { User } from '../../database/schemas';

export interface LogUserResponseDto {
  user: User;
  token: string;
  expiresIn: number;
}
