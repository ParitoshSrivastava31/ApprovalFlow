import { eventLabel, formatDateTime } from "@/lib/format";
import type { ApprovalEvent, Comment } from "@/lib/types";

export function Timeline({
  events,
  comments = [],
}: {
  events: ApprovalEvent[];
  comments?: Comment[];
}) {
  const commentMap = new Map(comments.map((comment) => [comment.createdAt, comment]));

  return (
    <div className="space-y-3">
      {events.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-zinc-200 bg-white/70 p-5 text-sm text-zinc-500">
          No activity yet.
        </p>
      ) : (
        events.map((event) => {
          const comment = commentMap.get(event.createdAt);
          return (
            <div
              key={event.id}
              className="relative rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(24,24,27,0.04)] transition hover:border-zinc-300 sm:p-5"
            >
              <div className="flex items-start gap-3">
                <span className="mt-1 size-2.5 rounded-full bg-zinc-950 shadow-[0_0_0_4px_rgba(24,24,27,0.08)]" />
                <div>
                  <p className="text-sm font-medium text-zinc-950">
                    {eventLabel(event.eventType)}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {formatDateTime(event.createdAt)}
                  </p>
                </div>
              </div>
              {comment ? (
                <p className="mt-4 rounded-2xl bg-zinc-50 p-3 text-sm leading-6 text-zinc-700">
                  {comment.message}
                </p>
              ) : null}
              {typeof event.metadata.feedback === "string" ? (
                <p className="mt-4 rounded-2xl bg-rose-50 p-3 text-sm leading-6 text-rose-800">
                  {event.metadata.feedback}
                </p>
              ) : null}
              {event.metadata.browser ? (
                <p className="mt-3 truncate text-xs text-zinc-400">
                  {String(event.metadata.browser)}
                </p>
              ) : null}
            </div>
          );
        })
      )}
    </div>
  );
}
