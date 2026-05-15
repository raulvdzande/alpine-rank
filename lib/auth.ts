import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "supersecret"
);

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function signJwt(payload: Record<string, unknown>) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyJwt(token: string) {
  const { payload } = await jwtVerify(token, JWT_SECRET);
  return payload;
}

export async function getCurrentUser() {
  const session = (await cookies()).get("session")?.value;

  if (!session) return null;

  try {
    const payload = await verifyJwt(session);
    const id = payload.id;
    const email = payload.email;
    const name = payload.name;

    if (
      typeof id !== "string" ||
      typeof email !== "string" ||
      typeof name !== "string"
    ) {
      return null;
    }

    return { id, email, name };
  } catch {
    return null;
  }
}