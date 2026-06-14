"use server";

import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getCurrentUser, getPublicReview } from "@/lib/data";
import { sendEmailNotification } from "@/lib/notifications";
import {
  createActionNonce,
  enforcePublicRateLimit,
  hashValue,
  requestBrowser,
  requestIp,
  sanitizeText,
  verifyActionNonce,
} from "@/lib/security";
import {
  detectFileKind,
  getSupabaseAdmin,
  uploadDeliverableFile,
  validateExternalUrl,
} from "@/lib/supabase";

function requireValue(value: string, message: string) {
  if (!value) {
    throw new Error(message);
  }

  return value;
}

export async function createClientAction(formData: FormData) {
  const db = getSupabaseAdmin();
  const user = await getCurrentUser();
  const name = requireValue(sanitizeText(formData.get("name"), 120), "Client name is required.");
  const email = requireValue(sanitizeText(formData.get("email"), 160), "Client email is required.");
  const phone = sanitizeText(formData.get("phone"), 40) || null;

  if (!db) {
    redirect("/clients?created=demo");
  }

  const { error } = await db.from("clients").insert({
    agency_id: user.agencyId,
    name,
    email,
    phone,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/clients");
  revalidatePath("/projects");
  redirect("/clients?created=1");
}

export async function createProjectAction(formData: FormData) {
  const db = getSupabaseAdmin();
  const clientId = requireValue(
    sanitizeText(formData.get("clientId"), 80),
    "Choose a client.",
  );
  const name = requireValue(sanitizeText(formData.get("name"), 140), "Project name is required.");
  const description = sanitizeText(formData.get("description"), 500) || null;

  if (!db) {
    redirect("/projects?created=demo");
  }

  const { error } = await db.from("projects").insert({
    client_id: clientId,
    name,
    description,
    status: "ACTIVE",
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/projects");
  revalidatePath("/deliverables");
  redirect("/projects?created=1");
}

export async function createDeliverableAction(formData: FormData) {
  const db = getSupabaseAdmin();
  const user = await getCurrentUser();
  const projectId = requireValue(
    sanitizeText(formData.get("projectId"), 80),
    "Choose a project.",
  );
  const title = requireValue(sanitizeText(formData.get("title"), 160), "Title is required.");
  const description = sanitizeText(formData.get("description"), 800) || null;
  const externalUrlInput = sanitizeText(formData.get("externalUrl"), 500);
  const existingGroupId = sanitizeText(formData.get("versionGroupId"), 80);
  const uploadedFile = formData.get("file");

  if (!db) {
    redirect("/deliverables?created=demo");
  }

  let fileUrl = "";
  let fileKind: ReturnType<typeof detectFileKind>;

  if (externalUrlInput) {
    fileUrl = validateExternalUrl(externalUrlInput);
    fileKind = "URL";
  } else if (uploadedFile instanceof File && uploadedFile.size > 0) {
    const uploaded = await uploadDeliverableFile(uploadedFile, user.agencyId);
    fileUrl = uploaded.fileUrl;
    fileKind = uploaded.fileKind;
  } else {
    throw new Error("Upload a file or provide an external URL.");
  }

  const versionGroupId = existingGroupId || nanoid(14);
  const { data: latestVersion } = await db
    .from("deliverables")
    .select("version")
    .eq("version_group_id", versionGroupId)
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextVersion = (latestVersion?.version ?? 0) + 1;
  const publicReviewId = nanoid(18);

  const { error } = await db.from("deliverables").insert({
    project_id: projectId,
    title,
    description,
    file_url: fileUrl,
    file_kind: fileKind,
    public_id: publicReviewId,
    version_group_id: versionGroupId,
    version: nextVersion,
    status: "PENDING",
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
  revalidatePath("/deliverables");
  redirect(`/deliverables?created=${publicReviewId}`);
}

export async function addCommentAction(formData: FormData) {
  const publicReviewId = sanitizeText(formData.get("publicId"), 80);
  const nonce = sanitizeText(formData.get("nonce"), 120);
  const honeypot = sanitizeText(formData.get("company"), 120);
  const authorName = sanitizeText(formData.get("authorName"), 100) || "Client";
  const message = sanitizeText(formData.get("message"), 1500);
  const headersList = await headers();
  const ipAddress = requestIp(headersList);
  const browser = requestBrowser(headersList);

  if (honeypot) {
    redirect(`/r/${publicReviewId}`);
  }

  if (!message || message.length < 3) {
    throw new Error("Comment is too short.");
  }

  const review = await getPublicReview(publicReviewId);
  if (!review || !verifyActionNonce(review.deliverable, nonce)) {
    throw new Error("This review link could not be verified.");
  }

  const allowed = await enforcePublicRateLimit(
    `comment:${publicReviewId}:${hashValue(ipAddress)}`,
    5,
    900,
  );

  if (!allowed) {
    throw new Error("Too many comments. Please wait a few minutes.");
  }

  const db = getSupabaseAdmin();
  if (db) {
    await db.from("comments").insert({
      deliverable_id: review.deliverable.id,
      author_name: authorName,
      message,
    });

    await db.from("approval_events").insert({
      deliverable_id: review.deliverable.id,
      event_type: "COMMENTED",
      metadata: {
        authorName,
        ipAddress,
        ipHash: hashValue(ipAddress),
        browser,
        timestamp: new Date().toISOString(),
      },
    });

    await sendEmailNotification({
      subject: `New comment on ${review.deliverable.title}`,
      preview: `${authorName} commented: ${message}`,
      reviewPath: `/r/${publicReviewId}`,
    });
  }

  revalidatePath(`/r/${publicReviewId}`);
  redirect(`/r/${publicReviewId}?commented=1`);
}

export async function requestChangesAction(formData: FormData) {
  const publicReviewId = sanitizeText(formData.get("publicId"), 80);
  const nonce = sanitizeText(formData.get("nonce"), 120);
  const authorName = sanitizeText(formData.get("authorName"), 100) || "Client";
  const message = sanitizeText(formData.get("message"), 1500);
  const headersList = await headers();
  const ipAddress = requestIp(headersList);
  const browser = requestBrowser(headersList);

  if (!message || message.length < 5) {
    throw new Error("Please describe the requested changes.");
  }

  const review = await getPublicReview(publicReviewId);
  if (!review || !verifyActionNonce(review.deliverable, nonce)) {
    throw new Error("This review link could not be verified.");
  }

  if (review.deliverable.status === "APPROVED") {
    redirect(`/r/${publicReviewId}?approved=1`);
  }

  const allowed = await enforcePublicRateLimit(
    `changes:${publicReviewId}:${hashValue(ipAddress)}`,
    3,
    900,
  );

  if (!allowed) {
    throw new Error("Too many change requests. Please wait a few minutes.");
  }

  const db = getSupabaseAdmin();
  if (db) {
    await db
      .from("deliverables")
      .update({ status: "CHANGES_REQUESTED" })
      .eq("id", review.deliverable.id)
      .neq("status", "APPROVED");

    await db.from("comments").insert({
      deliverable_id: review.deliverable.id,
      author_name: authorName,
      message,
    });

    await db.from("approval_events").insert({
      deliverable_id: review.deliverable.id,
      event_type: "REJECTED",
      metadata: {
        authorName,
        feedback: message,
        ipAddress,
        ipHash: hashValue(ipAddress),
        browser,
        timestamp: new Date().toISOString(),
      },
    });

    await sendEmailNotification({
      subject: `Changes requested for ${review.deliverable.title}`,
      preview: `${authorName} requested changes: ${message}`,
      reviewPath: `/r/${publicReviewId}`,
    });
  }

  revalidatePath(`/r/${publicReviewId}`);
  revalidatePath("/dashboard");
  revalidatePath("/deliverables");
  redirect(`/r/${publicReviewId}?changes=1`);
}

export async function approveDeliverableAction(formData: FormData) {
  const publicReviewId = sanitizeText(formData.get("publicId"), 80);
  const nonce = sanitizeText(formData.get("nonce"), 120);
  const headersList = await headers();
  const ipAddress = requestIp(headersList);
  const browser = requestBrowser(headersList);

  const review = await getPublicReview(publicReviewId);
  if (!review || !verifyActionNonce(review.deliverable, nonce)) {
    throw new Error("This review link could not be verified.");
  }

  if (review.deliverable.status === "APPROVED") {
    redirect(`/r/${publicReviewId}?approved=1`);
  }

  const allowed = await enforcePublicRateLimit(
    `approve:${publicReviewId}:${hashValue(ipAddress)}`,
    2,
    900,
  );

  if (!allowed) {
    throw new Error("Too many approval attempts. Please wait a few minutes.");
  }

  const db = getSupabaseAdmin();
  if (db) {
    await db
      .from("deliverables")
      .update({ status: "APPROVED" })
      .eq("id", review.deliverable.id)
      .neq("status", "APPROVED");

    await db.from("approval_events").insert({
      deliverable_id: review.deliverable.id,
      event_type: "APPROVED",
      metadata: {
        ipAddress,
        ipHash: hashValue(ipAddress),
        browser,
        timestamp: new Date().toISOString(),
        actionNonceHash: hashValue(createActionNonce(review.deliverable)),
      },
    });

    await sendEmailNotification({
      subject: `Approved: ${review.deliverable.title}`,
      preview: `${review.deliverable.clientName} approved version ${review.deliverable.version}.`,
      reviewPath: `/r/${publicReviewId}`,
    });
  }

  revalidatePath(`/r/${publicReviewId}`);
  revalidatePath("/dashboard");
  revalidatePath("/deliverables");
  redirect(`/r/${publicReviewId}?approved=1`);
}
