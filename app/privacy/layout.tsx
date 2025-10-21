import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Subnet Console",
  description:
    "Learn how Subnet Console protects your privacy and handles your data in our decentralized cloud platform.",
  keywords:
    "privacy policy, data protection, GDPR, decentralized cloud, subnet console",
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
