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
                    <h3 className="font-semibold text-default-700">
                      Navigation
                    </h3>
                  </div>
                  <Link
                    className="block py-2 px-3 rounded-lg hover:bg-default-100 transition-colors text-sm"
                    href="#getting-started"
                  >
                    Getting Started
                  </Link>
                  <Link
                    className="block py-2 px-3 rounded-lg hover:bg-default-100 transition-colors text-sm"
                    href="#features"
                  >
                    Features
                  </Link>
                  <Link
                    className="block py-2 px-3 rounded-lg hover:bg-default-100 transition-colors text-sm"
                    href="#deployment"
                  >
                    Deployment
                  </Link>
                  <Link
                    className="block py-2 px-3 rounded-lg hover:bg-default-100 transition-colors text-sm"
                    href="#api"
                  >
                    API Reference
                  </Link>
                  <Link
                    className="block py-2 px-3 rounded-lg hover:bg-default-100 transition-colors text-sm"
                    href="#security"
                  >
                    Security
                  </Link>
                  <Link
                    className="block py-2 px-3 rounded-lg hover:bg-default-100 transition-colors text-sm"
                    href="#faq"
                  >
                    FAQ
                  </Link>
                </CardBody>
              </Card>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">{children}</div>
        </div>
      </div>
    </div>
  );
}
