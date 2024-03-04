import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { DATABASE_PROVIDER, PostgresDatabase } from '@app/shared/database/database.provider';
import { eq } from 'drizzle-orm';
import schemas, { User } from '@app/shared/database/schemas/schemas';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { RmqContext, RpcException } from '@nestjs/microservices';

@Injectable()
export class UsersService {
  constructor(@Inject(DATABASE_PROVIDER) private readonly db: PostgresDatabase) {}

  async createUser(user: CreateUserDto, ctx: RmqContext) {
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

  async validate(email: string, password: string) {
    const user = await this.db.query.users.findFirst({
      where: eq(schemas.users.email, email),
    });
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credentials are not valid');
    }

    return user;
  }

  async getBy(userArgs: Partial<Omit<User, 'password'>>) {
    return this.db.query.users.findFirst({
      where: userArgs.id ? eq(schemas.users.id, userArgs.id) : eq(schemas.users.email, userArgs.email),
    });
  }

  private async validateUserCreation(user: CreateUserDto) {
    const dbUser = await this.db.select().from(schemas.users).where(eq(schemas.users.email, user.email)).execute();

    return dbUser.length <= 0;
  }
}
