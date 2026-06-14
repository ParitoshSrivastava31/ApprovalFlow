import {
  demoClients,
  demoComments,
  demoDeliverables,
  demoEvents,
  demoProjects,
  demoUser,
} from "./demo-data";
import { createActionNonce, enforcePublicRateLimit, hashValue } from "./security";
import {
  getConfiguredAgencyId,
  getSupabaseAdmin,
  resolveDeliverableFileUrl,
} from "./supabase";
import type {
  AgencyUser,
  ApprovalEvent,
  Client,
  DashboardOverview,
  Deliverable,
  Project,
  PublicReview,
} from "./types";

type DbRow = Record<string, unknown>;

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function asNullableString(value: unknown) {
  return typeof value === "string" ? value : null;
}

function asNumber(value: unknown, fallback = 0) {
  return typeof value === "number" ? value : fallback;
}

function asObject(value: unknown): DbRow {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as DbRow)
    : {};
}

function mapClient(row: DbRow): Client {
  return {
    id: asString(row.id),
    agencyId: asString(row.agency_id),
    name: asString(row.name),
    email: asString(row.email),
    phone: asNullableString(row.phone),
    createdAt: asString(row.created_at),
  };
}

function mapProject(row: DbRow): Project {
  const client = asObject(row.clients);

  return {
    id: asString(row.id),
    clientId: asString(row.client_id),
    clientName: asString(client.name, asString(row.client_name, "Client")),
    name: asString(row.name),
    description: asNullableString(row.description),
    status: asString(row.status, "ACTIVE") === "ARCHIVED" ? "ARCHIVED" : "ACTIVE",
    createdAt: asString(row.created_at),
  };
}

async function mapDeliverable(row: DbRow): Promise<Deliverable> {
  const fileKind = asString(row.file_kind) as Deliverable["fileKind"];
  const project = asObject(row.projects);
  const nestedClient = asObject(project.clients);
  const flatClient = asObject(row.clients);

  return {
    id: asString(row.id),
    projectId: asString(row.project_id),
    projectName: asString(project.name, asString(row.project_name, "Project")),
    clientName:
      asString(nestedClient.name) ||
      asString(row.client_name) ||
      asString(flatClient.name, "Client"),
    title: asString(row.title),
    description: asNullableString(row.description),
    fileUrl: await resolveDeliverableFileUrl(asString(row.file_url), fileKind),
    fileKind,
    publicId: asString(row.public_id),
    versionGroupId: asString(row.version_group_id),
    version: asNumber(row.version, 1),
    status: asString(row.status, "PENDING") as Deliverable["status"],
    createdAt: asString(row.created_at),
  };
}

function mapEvent(row: DbRow): ApprovalEvent {
  const metadata = asObject(row.metadata);

  return {
    id: asString(row.id),
    deliverableId: asString(row.deliverable_id),
    eventType: asString(row.event_type) as ApprovalEvent["eventType"],
    metadata,
    createdAt: asString(row.created_at),
  };
}

export async function getCurrentUser(): Promise<AgencyUser> {
  const db = getSupabaseAdmin();
  const agencyId = getConfiguredAgencyId();

  if (!db) {
    return demoUser;
  }

  const { data } = await db
    .from("users")
    .select("id, agency_id, name, email, role, created_at")
    .eq("agency_id", agencyId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!data) {
    return demoUser;
  }

  return {
    id: data.id,
    agencyId: data.agency_id,
    name: data.name,
    email: data.email,
    role: data.role,
    createdAt: data.created_at,
  };
}

export async function getClients(): Promise<Client[]> {
  const db = getSupabaseAdmin();
  const agencyId = getConfiguredAgencyId();

  if (!db) {
    return demoClients;
  }

  const { data, error } = await db
    .from("clients")
    .select("id, agency_id, name, email, phone, created_at")
    .eq("agency_id", agencyId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map(mapClient);
}

export async function getProjects(): Promise<Project[]> {
  const db = getSupabaseAdmin();
  const agencyId = getConfiguredAgencyId();

  if (!db) {
    return demoProjects;
  }

  const { data, error } = await db
    .from("projects")
    .select("id, client_id, name, description, status, created_at, clients!inner(name, agency_id)")
    .eq("clients.agency_id", agencyId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map(mapProject);
}

export async function getDeliverables(): Promise<Deliverable[]> {
  const db = getSupabaseAdmin();
  const agencyId = getConfiguredAgencyId();

  if (!db) {
    return demoDeliverables.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  const { data, error } = await db
    .from("deliverables")
    .select(
      "id, project_id, title, description, file_url, file_kind, public_id, version_group_id, version, status, created_at, projects!inner(name, clients!inner(name, agency_id))",
    )
    .eq("projects.clients.agency_id", agencyId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return Promise.all(data.map(mapDeliverable));
}

export async function getDashboardOverview(): Promise<DashboardOverview> {
  const deliverables = await getDeliverables();
  const db = getSupabaseAdmin();

  const pendingApprovals = deliverables.filter((item) => item.status === "PENDING").length;
  const approvedDeliverables = deliverables.filter((item) => item.status === "APPROVED").length;
  const changesRequested = deliverables.filter(
    (item) => item.status === "CHANGES_REQUESTED",
  ).length;

  if (!db) {
    const recentActivity = demoEvents
      .slice()
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 6)
      .map((event) => ({
        ...event,
        deliverableTitle:
          deliverables.find((item) => item.id === event.deliverableId)?.title ??
          "Deliverable",
      }));

    return {
      pendingApprovals,
      approvedDeliverables,
      changesRequested,
      recentActivity,
      deliverables,
    };
  }

  const ids = deliverables.map((item) => item.id);
  if (ids.length === 0) {
    return {
      pendingApprovals,
      approvedDeliverables,
      changesRequested,
      recentActivity: [],
      deliverables,
    };
  }

  const { data } = await db
    .from("approval_events")
    .select("id, deliverable_id, event_type, metadata, created_at")
    .in("deliverable_id", ids)
    .order("created_at", { ascending: false })
    .limit(8);

  const recentActivity =
    data?.map((row) => ({
      ...mapEvent(row),
      deliverableTitle:
        deliverables.find((item) => item.id === row.deliverable_id)?.title ??
        "Deliverable",
    })) ?? [];

  return {
    pendingApprovals,
    approvedDeliverables,
    changesRequested,
    recentActivity,
    deliverables,
  };
}

export async function getPublicReview(publicId: string): Promise<PublicReview | null> {
  const db = getSupabaseAdmin();

  if (!db) {
    const deliverable = demoDeliverables.find((item) => item.publicId === publicId);
    if (!deliverable) {
      return null;
    }

    const versions = demoDeliverables
      .filter((item) => item.versionGroupId === deliverable.versionGroupId)
      .sort((a, b) => b.version - a.version);

    const comments = demoComments.filter(
      (item) => item.deliverableId === deliverable.id,
    );

    const events = demoEvents
      .filter((item) => item.deliverableId === deliverable.id)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

    return {
      deliverable,
      comments,
      events,
      versions,
      actionNonce: createActionNonce(deliverable),
    };
  }

  const { data, error } = await db
    .from("deliverables")
    .select(
      "id, project_id, title, description, file_url, file_kind, public_id, version_group_id, version, status, created_at, projects!inner(name, clients!inner(name))",
    )
    .eq("public_id", publicId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const deliverable = await mapDeliverable(data);

  const [{ data: comments }, { data: events }, { data: versions }] =
    await Promise.all([
      db
        .from("comments")
        .select("id, deliverable_id, author_name, message, created_at")
        .eq("deliverable_id", deliverable.id)
        .order("created_at", { ascending: true }),
      db
        .from("approval_events")
        .select("id, deliverable_id, event_type, metadata, created_at")
        .eq("deliverable_id", deliverable.id)
        .order("created_at", { ascending: true }),
      db
        .from("deliverables")
        .select(
          "id, project_id, title, description, file_url, file_kind, public_id, version_group_id, version, status, created_at, projects!inner(name, clients!inner(name))",
        )
        .eq("version_group_id", deliverable.versionGroupId)
        .order("version", { ascending: false }),
    ]);

  return {
    deliverable,
    comments:
      comments?.map((row) => ({
        id: row.id,
        deliverableId: row.deliverable_id,
        authorName: row.author_name,
        message: row.message,
        createdAt: row.created_at,
      })) ?? [],
    events: events?.map(mapEvent) ?? [],
    versions: versions ? await Promise.all(versions.map(mapDeliverable)) : [deliverable],
    actionNonce: createActionNonce(deliverable),
  };
}

export async function recordReviewView(
  deliverable: Deliverable,
  ipAddress: string,
  browser: string,
) {
  const db = getSupabaseAdmin();
  if (!db) {
    return;
  }

  const ipHash = hashValue(ipAddress);
  const allowed = await enforcePublicRateLimit(
    `view:${deliverable.publicId}:${ipHash}`,
    4,
    600,
  );

  if (!allowed) {
    return;
  }

  await db.from("approval_events").insert({
    deliverable_id: deliverable.id,
    event_type: "VIEWED",
    metadata: {
      ipAddress,
      ipHash,
      browser,
      timestamp: new Date().toISOString(),
    },
  });
}
