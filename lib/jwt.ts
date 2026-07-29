import {
  SignJWT,
  jwtVerify,
  JWTPayload,
} from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET!
);

export interface AuthTokenPayload
  extends JWTPayload {
  id: number;
  email: string;
  role: string;
}

export async function signToken(
  payload: AuthTokenPayload
) {
  return await new SignJWT(payload)
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(
  token: string
) {
  const { payload } = await jwtVerify(
    token,
    secret
  );

  return payload;
}