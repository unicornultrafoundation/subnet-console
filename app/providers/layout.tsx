import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Providers | Subnet Console",
  description:
    "Discover and compare verified compute providers across the decentralized cloud network. Find the perfect infrastructure for your applications.",
  keywords: [
    "providers",
    "compute",
    "decentralized",
    "cloud",
    "infrastructure",
    "nodes",
  ],
  openGraph: {
    title: "All Providers | Subnet Console",
    description:
      "Discover and compare verified compute providers across the decentralized cloud network.",
    type: "website",
  },
};

export default function ProvidersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
