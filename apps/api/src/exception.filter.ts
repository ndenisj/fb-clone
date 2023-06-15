import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

@Catch(RpcException)
export class MyExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const error: any = exception.getError();
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(error.statusCode).json(error);
  }
}

// import { Catch, RpcExceptionFilter, ArgumentsHost } from '@nestjs/common';
// import { Observable, throwError } from 'rxjs';
// import { RpcException } from '@nestjs/microservices';

// @Catch(RpcException)
// export class ExceptionFilter implements RpcExceptionFilter<RpcException> {
//   catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
//     return throwError(() => exception.getError());
//   }
// }
