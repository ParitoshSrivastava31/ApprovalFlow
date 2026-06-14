import crypto from "node:crypto";

import { getSupabaseAdmin } from "./supabase";
import type { Deliverable } from "./types";

function secret() {
  return (
    process.env.REVIEW_ACTION_SECRET ??
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    "approvalflow-local-secret"
  );
}

export function publicId() {
  return crypto.randomBytes(12).toString("base64url");
}

export function hashValue(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function createActionNonce(deliverable: Deliverable) {
  return crypto
    .createHmac("sha256", secret())
    .update(
      [
        deliverable.id,
        deliverable.publicId,
        deliverable.version,
        deliverable.status,
      ].join(":"),
    )
    .digest("base64url");
}

export function verifyActionNonce(deliverable: Deliverable, nonce: string) {
  const expected = Buffer.from(createActionNonce(deliverable));
  const received = Buffer.from(nonce);

  if (expected.length !== received.length) {
    return false;
  }

  return crypto.timingSafeEqual(expected, received);
}

export function requestIp(headersList: Headers) {
  const forwarded = headersList.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }

  return (
    headersList.get("x-real-ip") ??
    headersList.get("cf-connecting-ip") ??
    "unknown"
  );
}

export function requestBrowser(headersList: Headers) {
  return headersList.get("user-agent") ?? "unknown";
}

export function sanitizeText(value: FormDataEntryValue | null, maxLength: number) {
  const text = String(value ?? "").trim().replace(/\s+/g, " ");
  return text.slice(0, maxLength);
}

export async function enforcePublicRateLimit(
  rateKey: string,
  limit: number,
  windowSeconds: number,
) {
  const db = getSupabaseAdmin();
  if (!db) {
    return true;
  }

  const now = new Date();
  const expiresAt = new Date(now.getTime() + windowSeconds * 1000).toISOString();

  const { count, error: countError } = await db
    .from("public_rate_limits")
    .select("id", { count: "exact", head: true })
    .eq("rate_key", rateKey)
    .gt("expires_at", now.toISOString());

  if (countError) {
    return true;
  }

  if ((count ?? 0) >= limit) {
    return false;
  }

  await db.from("public_rate_limits").insert({
    rate_key: rateKey,
    expires_at: expiresAt,
  });

  return true;
}
