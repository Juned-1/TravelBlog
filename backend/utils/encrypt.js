const crypto = require("crypto")
const { messagePadding } = require("../configuration");
async function encryptAES(data, key) {
  const cipher = crypto.createCipheriv("aes-256-cbc", key, messagePadding);
  let encrypted = cipher.update(data, "utf-8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
}

async function decryptAES(encryptedData, key) {
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, messagePadding);
  let decryptedMessage = decipher.update(encryptedData, "base64", "utf-8");
  decryptedMessage += decipher.final("utf-8");
  return decryptedMessage;
}
module.exports = { encryptAES, decryptAES};