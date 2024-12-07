import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import bcrypt from 'bcrypt';

export const generateTokenSet = (userInfo) => {
  const accessToken = jwt.sign(userInfo, env.jwt.access_secret, {
    expiresIn: `${env.jwt.accessExpirationMinutes}m`,
  });
  const refreshToken = jwt.sign(userInfo, env.jwt.refresh_secret, {
    expiresIn: `${env.jwt.refreshExpirationDays}d`,
  });

  return {
    accessToken,
    refreshToken,
  };
};

export const extractUser = async (token, secret) => {
  return jwt.verify(token, secret);
};

export const decodeUser = (token, secret) => {
  return jwt.decode(token, secret);
};

export const formatError = (error) => {
  if (Array.isArray(error)) {
    return error;
  } else if (typeof error === 'object') {
    const extractedErrors = [];
    Object.values(error).forEach((errorObj) => {
      extractedErrors.push({ message: errorObj });
    });
    return extractedErrors;
  }

  return error;
};

export const generatePassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(password, salt);
    return newPassword;
  } catch (error) {
    return false;
  }
};

export const checkPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
