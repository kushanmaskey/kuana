const crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc';
const ENC_PREFIX = 'enc:';

function getKey() {
  const hex = process.env.FIELD_ENCRYPTION_KEY;
  if (!hex || hex.length !== 64) {
    throw new Error('FIELD_ENCRYPTION_KEY must be set to 64 hex characters (32 bytes)');
  }
  return Buffer.from(hex, 'hex');
}

// Deterministic IV derived from the normalized plaintext so the same email
// always produces the same ciphertext, enabling WHERE email = $1 lookups.
function encrypt(plaintext) {
  if (!plaintext) return plaintext;
  const normalized = plaintext.trim().toLowerCase();
  const key = getKey();
  const ivFull = crypto.createHash('sha256').update(normalized).digest();
  const iv = ivFull.subarray(0, 16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(normalized, 'utf8'), cipher.final()]);
  return `${ENC_PREFIX}${iv.toString('base64')}:${encrypted.toString('base64')}`;
}

// Transparently handles both encrypted values (enc:...) and legacy plaintext.
function decrypt(value) {
  if (!value || !value.startsWith(ENC_PREFIX)) return value;
  const parts = value.slice(ENC_PREFIX.length).split(':');
  if (parts.length !== 2) return value;
  const [ivB64, encB64] = parts;
  const key = getKey();
  const iv = Buffer.from(ivB64, 'base64');
  const encrypted = Buffer.from(encB64, 'base64');
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
}

module.exports = { encrypt, decrypt };
