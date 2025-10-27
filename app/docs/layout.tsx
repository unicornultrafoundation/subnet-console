import Link from "next/link";
import { Code } from "lucide-react";
import { Card, CardBody } from "@heroui/card";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Code className="text-primary" size={28} />
            <h1 className="text-4xl font-bold">Documentation</h1>
          </div>
          <p className="text-default-600 text-lg">
            Complete guide to using the Subnet Console platform
          </p>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <nav className="sticky top-20">
              <Card className="shadow-lg">
                <CardBody className="space-y-2">
                  <div className="mb-4">
                    <h3 className="font-semibold text-default-700">Navigation</h3>
                  </div>
                  <Link
                    href="#getting-started"
                    className="block py-2 px-3 rounded-lg hover:bg-default-100 transition-colors text-sm"
                  >
                    Getting Started
                  </Link>
                  <Link
                    href="#features"
                    className="block py-2 px-3 rounded-lg hover:bg-default-100 transition-colors text-sm"
                  >
                    Features
                  </Link>
                  <Link
                    href="#deployment"
                    className="block py-2 px-3 rounded-lg hover:bg-default-100 transition-colors text-sm"
                  >
                    Deployment
                  </Link>
                  <Link
                    href="#api"
                    className="block py-2 px-3 rounded-lg hover:bg-default-100 transition-colors text-sm"
                  >
                    API Reference
                  </Link>
                  <Link
                    href="#security"
                    className="block py-2 px-3 rounded-lg hover:bg-default-100 transition-colors text-sm"
                  >
                    Security
                  </Link>
                  <Link
                    href="#faq"
                    className="block py-2 px-3 rounded-lg hover:bg-default-100 transition-colors text-sm"
                  >
                    FAQ
                  </Link>
                </CardBody>
              </Card>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
