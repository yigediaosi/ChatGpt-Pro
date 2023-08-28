import crypto from "crypto";

export class AESCrypto {
  private algorithm: string;
  private key: Buffer;
  private iv: Buffer;

  constructor(secretKey: string, iv: string) {
    this.algorithm = "aes-256-cbc";
    this.key = crypto.scryptSync(secretKey, "salt", 32);
    this.iv = Buffer.from(iv, "hex");
  }

  encrypt(text: string): string {
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  }

  decrypt(encryptedText: string): string {
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }
}
