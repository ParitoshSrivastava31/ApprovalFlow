import Link from "next/link";

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const styles = {
  pageKicker: "text-sm font-medium text-zinc-500",
  pageTitle:
    "mt-2 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl",
  pageLead: "mt-3 max-w-2xl text-sm leading-6 text-zinc-500 sm:text-base",
  card:
    "rounded-2xl border border-zinc-200/80 bg-white shadow-[0_1px_2px_rgba(24,24,27,0.04),0_16px_40px_rgba(24,24,27,0.04)]",
  cardPadding: "p-5 sm:p-6",
  panel:
    "rounded-2xl border border-zinc-200/80 bg-white/90 p-5 shadow-[0_1px_2px_rgba(24,24,27,0.04)] sm:p-6",
  input:
    "mt-2 min-h-11 w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100",
  textarea:
    "mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-3 text-sm leading-6 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100",
  label: "text-sm font-medium text-zinc-800",
  primaryButton:
    "inline-flex min-h-11 items-center justify-center rounded-xl bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(24,24,27,0.14)] transition hover:-translate-y-0.5 hover:bg-zinc-800 disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:shadow-none",
  secondaryButton:
    "inline-flex min-h-11 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-800 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-zinc-50 disabled:translate-y-0 disabled:cursor-not-allowed disabled:text-zinc-400",
  dangerButton:
    "inline-flex min-h-11 items-center justify-center rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-rose-50 disabled:translate-y-0 disabled:cursor-not-allowed disabled:border-zinc-200 disabled:text-zinc-400",
};

export function PageHeader({
  kicker,
  title,
  lead,
  action,
}: {
  kicker: string;
  title: string;
  lead?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className={styles.pageKicker}>{kicker}</p>
        <h1 className={styles.pageTitle}>{title}</h1>
        {lead ? <p className={styles.pageLead}>{lead}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cx(styles.card, styles.cardPadding, className)}>{children}</div>;
}

export function SectionTitle({
  title,
  eyebrow,
}: {
  title: string;
  eyebrow?: string;
}) {
  return (
    <div>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase text-zinc-400">{eyebrow}</p>
      ) : null}
      <h2 className="text-base font-semibold text-zinc-950">{title}</h2>
    </div>
  );
}

export function PrimaryLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={cx(styles.primaryButton, className)}>
      {children}
    </Link>
  );
}
