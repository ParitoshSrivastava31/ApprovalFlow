export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export function eventLabel(eventType: string) {
  switch (eventType) {
    case "APPROVED":
      return "Approved";
    case "REJECTED":
      return "Requested changes";
    case "COMMENTED":
      return "Commented";
    case "VIEWED":
      return "Viewed";
    default:
      return eventType;
  }
}

export function statusLabel(status: string) {
  switch (status) {
    case "PENDING":
      return "Pending";
    case "APPROVED":
      return "Approved";
    case "CHANGES_REQUESTED":
      return "Changes requested";
    default:
      return status;
  }
}
