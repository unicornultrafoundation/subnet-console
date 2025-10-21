import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Subnet Console",
  description:
    "Terms and conditions for using Subnet Console decentralized cloud platform.",
  keywords:
    "terms of service, terms and conditions, user agreement, subnet console",
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
