import { generateKeyPairSync } from 'node:crypto';
import jwt from 'jsonwebtoken';

export const { publicKey, privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'pkcs1',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs1',
    format: 'pem'
  }
});

export const dummyToken = jwt.sign({ dummy: 'content' }, privateKey, {
  algorithm: 'RS512'
});
