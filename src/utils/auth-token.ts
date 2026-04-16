function decodeTokenPayload(token: string | null) {
  if (!token || typeof window === "undefined") {
    return null;
  }

  try {
    const [, payload] = token.split(".");

    if (!payload) {
      return null;
    }

    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = normalizedPayload.padEnd(
      normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4),
      "=",
    );
    const decodedPayload = window.atob(paddedPayload);

    return JSON.parse(decodedPayload) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function getUserIdFromToken(token: string | null) {
  const payload = decodeTokenPayload(token);

  if (!payload) {
    return null;
  }

  if (typeof payload.userId === "string") {
    return payload.userId;
  }

  if (typeof payload.sub === "string") {
    return payload.sub;
  }

  if (typeof payload.id === "string") {
    return payload.id;
  }

  return null;
}
