export interface JwtPayload {
  [key: string]: unknown;
}

export const decodeJwtPayload = <T extends JwtPayload = JwtPayload>(
  token: string
): T | null => {
  if (!token) {
    return null;
  }

  const segments = token.split('.');
  if (segments.length < 2) {
    return null;
  }

  try {
    const base64 = segments[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const paddedBase64 = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');

    if (typeof globalThis === 'undefined' || typeof globalThis.atob !== 'function') {
      throw new Error('Base64 decoder not available in this environment');
    }

    const decodedString = globalThis.atob(paddedBase64);

    const jsonPayload = decodeURIComponent(
      decodedString
        .split('')
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join('')
    );

    return JSON.parse(jsonPayload) as T;
  } catch (error) {
    console.warn('Failed to decode JWT payload', error);
    return null;
  }
};
