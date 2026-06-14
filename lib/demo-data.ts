import type {
  AgencyUser,
  ApprovalEvent,
  Client,
  Comment,
  Deliverable,
  Project,
} from "./types";

export const demoUser: AgencyUser = {
  id: "usr_demo_owner",
  agencyId: "agy_demo",
  name: "Maya Shah",
  email: "maya@northstar.studio",
  role: "AGENCY_OWNER",
  createdAt: "2026-06-01T09:00:00.000Z",
};

export const demoClients: Client[] = [
  {
    id: "cli_aurora",
    agencyId: demoUser.agencyId,
    name: "Aurora Kitchen",
    email: "nina@aurorakitchen.example",
    phone: "+1 415 555 0149",
    createdAt: "2026-06-02T10:30:00.000Z",
  },
  {
    id: "cli_vertex",
    agencyId: demoUser.agencyId,
    name: "Vertex Labs",
    email: "sam@vertex.example",
    phone: "+1 212 555 0194",
    createdAt: "2026-06-04T13:15:00.000Z",
  },
];

export const demoProjects: Project[] = [
  {
    id: "prj_social_launch",
    clientId: "cli_aurora",
    clientName: "Aurora Kitchen",
    name: "June campaign approvals",
    description: "Social creatives and launch assets awaiting client sign-off.",
    status: "ACTIVE",
    createdAt: "2026-06-05T08:30:00.000Z",
  },
  {
    id: "prj_deck_refresh",
    clientId: "cli_vertex",
    clientName: "Vertex Labs",
    name: "Investor deck refresh",
    description: "Deck revisions, export PDFs, and sign-off trail.",
    status: "ACTIVE",
    createdAt: "2026-06-06T11:45:00.000Z",
  },
];

export const demoDeliverables: Deliverable[] = [
  {
    id: "del_launch_v1",
    projectId: "prj_social_launch",
    projectName: "June campaign approvals",
    clientName: "Aurora Kitchen",
    title: "Launch carousel creative",
    description: "Instagram carousel for the seasonal menu launch.",
    fileUrl:
      "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1600&q=80",
    fileKind: "IMAGE",
    publicId: "rvw_launch_v1",
    versionGroupId: "grp_launch_carousel",
    version: 1,
    status: "CHANGES_REQUESTED",
    createdAt: "2026-06-07T09:20:00.000Z",
  },
  {
    id: "del_launch_v2",
    projectId: "prj_social_launch",
    projectName: "June campaign approvals",
    clientName: "Aurora Kitchen",
    title: "Launch carousel creative",
    description: "Updated CTA and final slide copy for sign-off.",
    fileUrl:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80",
    fileKind: "IMAGE",
    publicId: "rvw_demo_review",
    versionGroupId: "grp_launch_carousel",
    version: 2,
    status: "PENDING",
    createdAt: "2026-06-09T15:10:00.000Z",
  },
  {
    id: "del_deck_v1",
    projectId: "prj_deck_refresh",
    projectName: "Investor deck refresh",
    clientName: "Vertex Labs",
    title: "Investor deck PDF",
    description: "PDF export for final founder review.",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    fileKind: "PDF",
    publicId: "rvw_vertex_pdf",
    versionGroupId: "grp_vertex_deck",
    version: 1,
    status: "APPROVED",
    createdAt: "2026-06-08T12:05:00.000Z",
  },
];

export const demoComments: Comment[] = [
  {
    id: "cmt_1",
    deliverableId: "del_launch_v1",
    authorName: "Nina Patel",
    message: "Please make the discount clearer on the last slide.",
    createdAt: "2026-06-07T11:35:00.000Z",
  },
  {
    id: "cmt_2",
    deliverableId: "del_launch_v2",
    authorName: "Nina Patel",
    message: "This version is much closer. Checking with our founder now.",
    createdAt: "2026-06-10T10:10:00.000Z",
  },
];

export const demoEvents: ApprovalEvent[] = [
  {
    id: "evt_1",
    deliverableId: "del_launch_v1",
    eventType: "VIEWED",
    metadata: { browser: "WhatsApp WebView", ipAddress: "redacted" },
    createdAt: "2026-06-07T10:02:00.000Z",
  },
  {
    id: "evt_2",
    deliverableId: "del_launch_v1",
    eventType: "COMMENTED",
    metadata: { authorName: "Nina Patel" },
    createdAt: "2026-06-07T11:35:00.000Z",
  },
  {
    id: "evt_3",
    deliverableId: "del_launch_v1",
    eventType: "REJECTED",
    metadata: { reason: "Needs clearer discount copy" },
    createdAt: "2026-06-07T11:36:00.000Z",
  },
  {
    id: "evt_4",
    deliverableId: "del_launch_v2",
    eventType: "VIEWED",
    metadata: { browser: "Mobile Safari", ipAddress: "redacted" },
    createdAt: "2026-06-10T09:58:00.000Z",
  },
  {
    id: "evt_5",
    deliverableId: "del_deck_v1",
    eventType: "APPROVED",
    metadata: { browser: "Chrome", ipAddress: "redacted" },
    createdAt: "2026-06-09T16:44:00.000Z",
  },
];
