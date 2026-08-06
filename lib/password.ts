import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export function isBcryptHash(value: string): boolean {
  return typeof value === "string" && value.startsWith("$2");
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, storedPassword: string): Promise<boolean> {
  if (!storedPassword) return false;

  if (isBcryptHash(storedPassword)) {
    return bcrypt.compare(password, storedPassword);
  }

  return password === storedPassword;
}
