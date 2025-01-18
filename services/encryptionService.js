import crypto from "crypto";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "your-secure-key"; // 32 chars
const IV_LENGTH = 16;

export const encryptData = (data) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(data);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

export const decryptData = (encryptedData) => {
  const [iv, encrypted] = encryptedData.split(":");
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), Buffer.from(iv, "hex"));
  let decrypted = decipher.update(Buffer.from(encrypted, "hex"));
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

