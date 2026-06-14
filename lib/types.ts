export type UserRole = "AGENCY_OWNER" | "AGENCY_MEMBER";

export type DeliverableStatus = "PENDING" | "APPROVED" | "CHANGES_REQUESTED";

export type ApprovalEventType = "APPROVED" | "REJECTED" | "COMMENTED" | "VIEWED";

export type FileKind = "IMAGE" | "PDF" | "VIDEO" | "URL";

export type AgencyUser = {
  id: string;
  agencyId: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
};

export type Client = {
  id: string;
  agencyId: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
};

export type Project = {
  id: string;
  clientId: string;
  clientName: string;
  name: string;
  description: string | null;
  status: "ACTIVE" | "ARCHIVED";
  createdAt: string;
};

export type Deliverable = {
  id: string;
  projectId: string;
  projectName: string;
  clientName: string;
  title: string;
  description: string | null;
  fileUrl: string;
  fileKind: FileKind;
  publicId: string;
  versionGroupId: string;
  version: number;
  status: DeliverableStatus;
  createdAt: string;
};

export type Comment = {
  id: string;
  deliverableId: string;
  authorName: string;
  message: string;
  createdAt: string;
};

export type ApprovalEvent = {
  id: string;
  deliverableId: string;
  eventType: ApprovalEventType;
  metadata: Record<string, unknown>;
  createdAt: string;
};

export type DashboardOverview = {
  pendingApprovals: number;
  approvedDeliverables: number;
  changesRequested: number;
  recentActivity: Array<ApprovalEvent & { deliverableTitle: string }>;
  deliverables: Deliverable[];
};

export type PublicReview = {
  deliverable: Deliverable;
  comments: Comment[];
  events: ApprovalEvent[];
  versions: Deliverable[];
  actionNonce: string;
};
