import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ApprovalFlow",
  description: "Structured client approvals for agency deliverables.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full bg-white text-zinc-950">{children}</body>
    </html>
  );
}
