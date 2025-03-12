import CryptoJS from 'crypto-js';

const CRYPTO_KEY = process.env.REACT_APP_CRYPTO_KEY || 'your-secure-key';

export const encrypt = (text) => {
  return CryptoJS.AES.encrypt(text, CRYPTO_KEY).toString();
};

export const decrypt = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, CRYPTO_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};