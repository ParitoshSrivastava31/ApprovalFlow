import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { nanoid } from "nanoid";

import type { FileKind } from "./types";

let cachedAdmin: SupabaseClient | null | undefined;

export function getSupabaseAdmin() {
  if (cachedAdmin !== undefined) {
    return cachedAdmin;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    cachedAdmin = null;
    return cachedAdmin;
  }

  cachedAdmin = createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return cachedAdmin;
}

export function getConfiguredAgencyId() {
  return process.env.APP_AGENCY_ID ?? "agy_demo";
}

export function getAppBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
    "http://localhost:3000"
  );
}

export function getReviewUrl(publicId: string) {
  return `${getAppBaseUrl()}/r/${publicId}`;
}

export function detectFileKind(contentType: string, externalUrl?: string): FileKind {
  if (externalUrl) {
    return "URL";
  }

  if (contentType.startsWith("image/")) {
    return "IMAGE";
  }

  if (contentType === "application/pdf") {
    return "PDF";
  }

  if (contentType.startsWith("video/")) {
    return "VIDEO";
  }

  throw new Error("Unsupported file type. Upload an image, PDF, video, or use an external URL.");
}

export function validateExternalUrl(value: string) {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error("Enter a valid external URL.");
  }

  if (!["https:", "http:"].includes(url.protocol)) {
    throw new Error("External URLs must use http or https.");
  }

  return url.toString();
}

export async function uploadDeliverableFile(file: File, agencyId: string) {
  const db = getSupabaseAdmin();

  if (!db) {
    throw new Error("Supabase is not configured.");
  }

  const maxBytes = 250 * 1024 * 1024;
  if (file.size <= 0) {
    throw new Error("Choose a file to upload or provide an external URL.");
  }

  if (file.size > maxBytes) {
    throw new Error("Files must be 250 MB or smaller.");
  }

  const fileKind = detectFileKind(file.type);
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const storagePath = `${agencyId}/${new Date().getUTCFullYear()}/${nanoid(18)}.${extension}`;
  const bytes = await file.arrayBuffer();

  const { error } = await db.storage
    .from("deliverables")
    .upload(storagePath, bytes, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return {
    fileKind,
    fileUrl: storagePath,
  };
}

export async function resolveDeliverableFileUrl(fileUrl: string, fileKind: FileKind) {
  if (fileKind === "URL" || /^https?:\/\//.test(fileUrl)) {
    return fileUrl;
  }

  const db = getSupabaseAdmin();
  if (!db) {
    return fileUrl;
  }

  const { data } = await db.storage
    .from("deliverables")
    .createSignedUrl(fileUrl, 60 * 30);

  return data?.signedUrl ?? fileUrl;
}
