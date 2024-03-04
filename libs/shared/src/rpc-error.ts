import { HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

export class RpcError extends RpcException {
  constructor(error: { status: HttpStatus; message: string }) {
    super(error);
  }
}
