import jwt, { SignOptions } from "jsonwebtoken";

export const signJwt = (
  payload: Object,
  key: "accessTokenPrivateKey" | "refreshTokenPrivateKey",
  options: SignOptions = {}
) => {
  const privateKey = Buffer.from(
    key === "accessTokenPrivateKey"
      ? (process.env.ACCESS_TOKEN_PRIVATE_KEY as string)
      : (process.env.REFRESH_TOKEN_PRIVATE_KEY as string),
    "base64"
  ).toString("ascii");
  return jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: "RS256",
  });
};

export const verifyJwt = <T>(
  token: string,
  key: "accessTokenPublicKey" | "refreshTokenPublicKey"
): T | null => {
  try {
    const publicKey = Buffer.from(
      key === "accessTokenPublicKey"
        ? (process.env.ACCESS_TOKEN_PUBLIC_KEY as string)
        : (process.env.REFRESH_TOKEN_PUBLIC_KEY as string),
      "base64"
    ).toString("ascii");
    return jwt.verify(token, publicKey) as T;
  } catch (error) {
    return null;
  }
};
