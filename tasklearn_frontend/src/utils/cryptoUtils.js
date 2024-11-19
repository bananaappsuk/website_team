import CryptoJS from "crypto-js";

// Encrypt data
export const encryptData = (data) => {
  try {
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      process.env.NEXT_PUBLIC_SECRET_KEY
    ).toString(); 
    return encryptedData;
  } catch (error) {
    console.error("Encryption failed:", error);
    return null;
  }
};

// Decrypt data
export const decryptData = (ciphertext) => {
  try {
    const bytes = CryptoJS.AES.decrypt(
      ciphertext,
      process.env.NEXT_PUBLIC_SECRET_KEY
    );
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
};
