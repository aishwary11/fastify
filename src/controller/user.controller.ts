import { generateQrCode, HTTP_STATUS_CODE, totpSecret, verifyTokenTotp } from '@/common/constant';
import responseHelper from '@/common/utils/responsehelper';
import UserModel from '@/models/user';
import { FastifyReply, FastifyRequest } from 'fastify';

export const signIn = async (request: FastifyRequest, reply: FastifyReply) => {
  const { name, email } = request.body as User;
  const isUser = await UserModel.findOne({ name, email });
  if (!isUser) return responseHelper(reply, HTTP_STATUS_CODE.NOT_FOUND, 'User not found');
  return responseHelper(reply, HTTP_STATUS_CODE.OK, 'Login successful', { name, email });
};

export const verifyTotp = async (request: FastifyRequest, reply: FastifyReply) => {
  const { name, email, otp } = request.body as User & { otp: string };
  const isUser = await UserModel.findOne({ name, email });
  if (!isUser) return responseHelper(reply, HTTP_STATUS_CODE.NOT_FOUND, 'User not found');
  const verifyOtp = verifyTokenTotp(isUser.secret, otp);
  if (!verifyOtp) return responseHelper(reply, HTTP_STATUS_CODE.UNAUTHORIZED, 'Invalid TOTP');
  const token = request.server.jwt.sign({ name, email }, { expiresIn: '1d' });
  return responseHelper(reply, HTTP_STATUS_CODE.OK, 'Verify TOTP successful', { token });
};

export const signUp = async (request: FastifyRequest, reply: FastifyReply) => {
  const { name, email } = request.body as User;
  const secret = totpSecret;
  const isUserSaved = await UserModel.create({ name, email, secret: secret.base32 });
  if (!isUserSaved) return responseHelper(reply, HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR, 'User not saved');
  if (!secret.otpauth_url) return responseHelper(reply, HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR, 'QrCode not generated');
  const qrcode = await generateQrCode(secret?.otpauth_url);
  if (!qrcode) return responseHelper(reply, HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR, 'QrCode not generated');
  return reply.status(HTTP_STATUS_CODE.CREATED).send(`<img src="${qrcode}">`);
};

export const getUser = async (request: FastifyRequest, reply: FastifyReply) => {
  const { name } = request.user as User;
  return responseHelper(reply, HTTP_STATUS_CODE.OK, `Hello ${name}`);
};

export const getUserId = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  return responseHelper(reply, HTTP_STATUS_CODE.OK, `ID: ${id}`);
};
