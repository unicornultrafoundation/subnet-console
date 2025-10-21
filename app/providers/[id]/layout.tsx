import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Provider Details | Subnet Console",
  description:
    "View detailed information about compute providers including performance metrics, pricing, and customer reviews.",
  keywords: [
    "provider",
    "details",
    "compute",
    "performance",
    "metrics",
    "pricing",
  ],
  openGraph: {
    title: "Provider Details | Subnet Console",
    description:
      "View detailed information about compute providers including performance metrics, pricing, and customer reviews.",
    type: "website",
  },
};

export default function ProviderDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
