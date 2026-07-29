import pool from "./db";
import { RowDataPacket } from "mysql2";
import { User } from "@/types/user";

export async function findUserByEmail(
  email: string
): Promise<User | null> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `
    SELECT *
    FROM users
    WHERE email = ?
    LIMIT 1
    `,
    [email]
  );

  if (rows.length === 0) {
    return null;
  }

  return rows[0] as User;
}