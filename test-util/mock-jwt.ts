import { createPrivateKey, generateKeyPairSync } from 'node:crypto';
import { SignJWT } from 'jose';

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

export const dummyToken = await new SignJWT({ dummy: 'content' })
  .setProtectedHeader({ alg: 'RS512' })
  .sign(createPrivateKey(privateKey));
