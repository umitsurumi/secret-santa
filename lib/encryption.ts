import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

if (!ENCRYPTION_KEY) {
  throw new Error('ENCRYPTION_KEY environment variable is not set');
}

// 验证密钥长度
const keyBuffer = Buffer.from(ENCRYPTION_KEY, 'base64');
if (keyBuffer.length !== 32) {
  throw new Error('ENCRYPTION_KEY must be 32 bytes (256 bits) when base64 decoded');
}

/**
 * 加密敏感数据
 * @param text 要加密的文本
 * @returns base64编码的加密数据 (格式: iv.authTag.encryptedData)
 */
export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, keyBuffer, iv);

  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  const authTag = cipher.getAuthTag();

  // 格式: iv.authTag.encryptedData
  return `${iv.toString('base64')}.${authTag.toString('base64')}.${encrypted}`;
}

/**
 * 解密数据
 * @param encryptedText base64编码的加密数据 (格式: iv.authTag.encryptedData)
 * @returns 解密后的文本
 */
export function decrypt(encryptedText: string): string {
  const parts = encryptedText.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted text format');
  }

  const iv = Buffer.from(parts[0], 'base64');
  const authTag = Buffer.from(parts[1], 'base64');
  const encrypted = parts[2];

  const decipher = crypto.createDecipheriv(ALGORITHM, keyBuffer, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * 加密参与者敏感信息
 */
export function encryptParticipantData(data: {
  realName: string;
  phone: string;
  address: string;
}): {
  realName: string;
  phone: string;
  address: string;
} {
  return {
    realName: encrypt(data.realName),
    phone: encrypt(data.phone),
    address: encrypt(data.address),
  };
}

/**
 * 解密参与者敏感信息
 */
export function decryptParticipantData(data: {
  realName: string;
  phone: string;
  address: string;
}): {
  realName: string;
  phone: string;
  address: string;
} {
  return {
    realName: decrypt(data.realName),
    phone: decrypt(data.phone),
    address: decrypt(data.address),
  };
}