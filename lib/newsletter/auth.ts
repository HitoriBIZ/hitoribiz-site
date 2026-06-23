export const NEWSLETTER_ADMIN_COOKIE = "hitoribiz_newsletter_admin";

export async function createNewsletterAdminToken(password: string) {
  const data = new TextEncoder().encode(`hitoribiz-newsletter-admin:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyNewsletterAdminPassword(password: string) {
  const configuredPassword = process.env.ADMIN_NEWSLETTER_PASSWORD;

  if (!configuredPassword) {
    return false;
  }

  return password === configuredPassword;
}

export async function getExpectedNewsletterAdminToken() {
  const configuredPassword = process.env.ADMIN_NEWSLETTER_PASSWORD;

  if (!configuredPassword) {
    return null;
  }

  return createNewsletterAdminToken(configuredPassword);
}
