import { headers } from "next/headers";

export function isValidBasicAuth(authorization: string | null) {
  if (!authorization?.startsWith("Basic ")) {
    return false;
  }

  const [user, password] = Buffer.from(authorization.slice("Basic ".length), "base64")
    .toString("utf8")
    .split(":");

  const expectedUser = process.env.ADMIN_USER || "admin";
  const expectedPassword = process.env.ADMIN_PASSWORD || "safehands";

  return user === expectedUser && password === expectedPassword;
}

export async function isAdminRequest() {
  const authorization = (await headers()).get("authorization");
  return isValidBasicAuth(authorization);
}
