import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  if (!request.user) {
    null;
  }

  console.log('data', data);

  if (data) {
    return request.user[data];
  }

  return request.user;
});
