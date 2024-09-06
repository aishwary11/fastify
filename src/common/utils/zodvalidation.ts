import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';
import { AnyZodObject, ZodError } from 'zod';
import { HTTP_STATUS_CODE } from '../constant';
import responseHelper from './responsehelper';

export default function zodValidation(schema: AnyZodObject) {
  return (request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => {
    try {
      request.body = schema.parse(request.body);
      done();
    } catch (error) {
      if (error instanceof ZodError) {
        return responseHelper(reply, HTTP_STATUS_CODE.BAD_REQUEST, `${error.errors[0].path[0]} is ${error.errors[0].message}`);
      }
      return responseHelper(reply, HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR, 'Internal Server Error');
    }
  };
}
