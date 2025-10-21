import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | Subnet Console",
  description: "Manage your account settings and preferences",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50">
      {children}
    </div>
  );
}
