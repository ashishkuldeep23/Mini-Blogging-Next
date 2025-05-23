import { ENCRYPTION_KEY } from "@/constant";
import CryptoJS from "crypto-js";

const encryptionKey = ENCRYPTION_KEY;

export const encryptMessage = (message: CryptoJS.lib.WordArray | string) => {
  return CryptoJS.AES.encrypt(message, encryptionKey).toString();
};

export const decryptMessage = (
  encryptedMessage: CryptoJS.lib.CipherParams | string
) => {
  try {
    let returnThis = CryptoJS.AES.decrypt(
      encryptedMessage,
      encryptionKey
    ).toString(CryptoJS.enc.Utf8);
    return returnThis;
  } catch (error) {
    console.error("Error while decrypting message: ", error);
    return "";
  }
};
