import CryptoJS from "crypto-js";

const secretKey = "my-super-secret-key"; // nanti bisa diganti per-user/session

export const encryptData = (data, algorithm) => {
  const start = Date.now();
  let encrypted;

  switch (algorithm) {
    case "AES":
      encrypted = CryptoJS.AES.encrypt(data, secretKey).toString();
      break;
    case "DES":
      encrypted = CryptoJS.DES.encrypt(data, secretKey).toString();
      break;
    case "RC4":
      encrypted = CryptoJS.RC4.encrypt(data, secretKey).toString();
      break;
    default:
      throw new Error("Unsupported algorithm");
  }

  const time = Date.now() - start;
  return { encrypted, time };
};

export const decryptData = (encryptedData, algorithm) => {
  const start = Date.now();
  let decrypted;

  switch (algorithm) {
    case "AES":
      decrypted = CryptoJS.AES.decrypt(encryptedData, secretKey).toString(CryptoJS.enc.Utf8);
      break;
    case "DES":
      decrypted = CryptoJS.DES.decrypt(encryptedData, secretKey).toString(CryptoJS.enc.Utf8);
      break;
    case "RC4":
      decrypted = CryptoJS.RC4.decrypt(encryptedData, secretKey).toString(CryptoJS.enc.Utf8);
      break;
    default:
      throw new Error("Unsupported algorithm");
  }

  const time = Date.now() - start;
  return { decrypted, time };
};
