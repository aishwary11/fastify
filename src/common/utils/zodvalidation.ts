import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';
import { ZodError, ZodType } from 'zod';
import { HTTP_STATUS_CODE } from '../constant';
import responseHelper from './responsehelper';

export default function zodValidation(schema: ZodType) {
  return (request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => {
    try {
      request.body = schema.parse(request.body);
      done();
    } catch (error) {
      if (error instanceof ZodError) {
        const firstError = error.issues[0];
        const message = `${String(firstError?.path[0]) || 'Field'} is ${firstError?.message || 'invalid'}`;
        responseHelper(reply, HTTP_STATUS_CODE.BAD_REQUEST, message);
      } else {
        responseHelper(reply, HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR, 'Internal Server Error');
      }
    }
  };
}
