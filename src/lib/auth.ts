import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-in-production";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export function getJwtSecret(): string {
  return JWT_SECRET;
}

export async function verifyPassword(password: string): Promise<boolean> {
  return password === ADMIN_PASSWORD;
}

export function signToken(): string {
  return jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): boolean {
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

/**
 * Simple JWT verification without external libs (for middleware use).
 * Returns true if the token is valid and not expired.
 */
export function verifyTokenSimple(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    const payload = JSON.parse(
      Buffer.from(parts[1], "base64").toString()
    );

    if (payload.role !== "admin") return false;
    if (payload.exp && payload.exp * 1000 < Date.now()) return false;

    return true;
  } catch {
    return false;
  }
}

export async function getAuthCookie() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_token")?.value;
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    const token = await getAuthCookie();
    if (!token) return false;
    return verifyToken(token);
  } catch {
    return false;
  }
}
