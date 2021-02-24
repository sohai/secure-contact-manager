import { randomBytes } from "crypto";
import { pipeline } from "stream";
import { writeFile, createReadStream } from "fs";
import * as crypto from "crypto";
import { promisify } from "util";

const writeFileAsync = promisify(writeFile);
const pipelineAsync: any = promisify(pipeline);

const ALHORITHM = "aes-256-cbc";
const KEY_LENGTH = 32;
const IV_LENGTH = 16;

function getCipherKey(password: string, keyLength = KEY_LENGTH) {
  const digestHash = crypto.createHash("sha256").update(password).digest();

  return Buffer.alloc(keyLength, digestHash);
}

export async function encryptAndSave(
  filePath: string,
  text: string,
  password: string
) {
  const key = getCipherKey(password);
  const iv = randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALHORITHM, key, iv);

  let encrypted = Buffer.concat([
    iv,
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);
  await writeFileAsync(filePath, encrypted);
}

export async function readAndDecryptFile(filePath: string, password: string) {
  const key = await getCipherKey(password);
  const iv = await pipelineAsync(
    createReadStream(filePath, { start: 0, end: IV_LENGTH - 1 }),
    async (iterable: AsyncIterable<Buffer>) => {
      let iv;
      for await (const chunk of iterable) {
        iv = chunk;
      }
      return iv;
    }
  );
  const result = await pipelineAsync(
    createReadStream(filePath, { start: IV_LENGTH }),
    crypto.createDecipheriv(ALHORITHM, key, iv),
    async (iterable: AsyncIterable<Buffer>) => {
      let decrypted = "";
      for await (const chunk of iterable) {
        decrypted += chunk.toString();
      }
      return decrypted;
    }
  );
  return JSON.parse(result);
}
