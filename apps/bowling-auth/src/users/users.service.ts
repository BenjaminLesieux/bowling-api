import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { RpcException } from '@nestjs/microservices';
import schemas, { User } from '../database/schemas';
import { DATABASE_PROVIDER, PostgresDatabase } from '@app/shared/infrastructure/database/database.provider';

@Injectable()
export class UsersService {
  constructor(@Inject(DATABASE_PROVIDER) private readonly db: PostgresDatabase<typeof schemas>) {}

  async createUser(user: CreateUserDto): Promise<User> {
    if (!(await this.validateUserCreation(user))) {
      throw new RpcException({
        status: 400,
        message: 'User already exists',
      });
    }

    const createdUser = await this.db
      .insert(schemas.users)
      .values({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      })
      .returning();

    return createdUser[0];
  }

  async validate(email: string, password: string): Promise<User> {
    const user = (await this.db.select().from(schemas.users).where(eq(schemas.users.email, email)).execute())[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credentials are not valid');
    }

    return user;
  }

  async getBy(userArgs: Partial<Omit<User, 'password'>>): Promise<User> {
    return (
      await this.db
        .select()
        .from(schemas.users)
        .where(userArgs.id ? eq(schemas.users.id, userArgs.id) : eq(schemas.users.email, userArgs.email))
        .execute()
    )[0];
  }

  private async validateUserCreation(user: CreateUserDto): Promise<boolean> {
    const dbUser = await this.db.select().from(schemas.users).where(eq(schemas.users.email, user.email)).execute();

    return dbUser.length <= 0;
  }
}
