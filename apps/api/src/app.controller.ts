import { AuthGuard } from '@app/shared';
import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, throwError } from 'rxjs';

@Controller()
export class AppController {
  constructor(
    @Inject('AUTH_SERVICE') private authService: ClientProxy,
    @Inject('PRESENCE_SERVICE') private presenceService: ClientProxy,
  ) {}

  // AUTH MICRO-SERVICE
  @Get('auth')
  async getUsers() {
    return this.authService.send({ cmd: 'get-users' }, {});
  }

  @Post('auth/register')
  async register(
    @Body('firstName') firstName: string,
    @Body('lastName') lastName: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService
      .send(
        { cmd: 'register' },
        {
          firstName,
          lastName,
          email,
          password,
        },
      )
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  @Post('auth/login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService
      .send(
        { cmd: 'login' },
        {
          email,
          password,
        },
      )
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  // PRESENCE MICRO-SERVICE
  @UseGuards(AuthGuard)
  @Get('presence')
  async getPresence() {
    return this.presenceService
      .send({ cmd: 'get-presence' }, {})
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }
}
