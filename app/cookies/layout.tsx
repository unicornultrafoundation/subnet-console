import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | Subnet Console",
  description:
    "Learn about how Subnet Console uses cookies and similar technologies to enhance your experience on our platform.",
  keywords:
    "cookie policy, cookies, tracking, privacy, subnet console, data protection",
};

export default function CookiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
