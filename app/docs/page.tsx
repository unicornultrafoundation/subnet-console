"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import {
  BookOpen,
  Rocket,
  Shield,
  Zap,
  Server,
  Database,
  Network,
  AlertCircle,
  CheckCircle,
  Globe,
  Code as CodeIcon,
} from "lucide-react";
import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="space-y-12">
      {/* Getting Started */}
      <section className="scroll-mt-20" id="getting-started">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <BookOpen className="text-primary" size={28} />
            Getting Started
          </h2>
          <p className="text-default-600">
            Learn how to deploy and manage your applications on the Subnet
            Console
          </p>
        </div>

        <Card className="subnet-card shadow-lg">
          <CardBody className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">
                Welcome to Subnet Console
              </h3>
              <p className="text-default-600 mb-4">
                Subnet Console is a decentralized application deployment
                platform that enables you to deploy and manage your applications
                on a distributed network of providers. With MetaMask
                integration, you can seamlessly manage your deployments and
                payments.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Quick Start</h3>
              <ol className="space-y-3 list-decimal list-inside">
                <li>
                  <strong>Connect Wallet</strong> - Click &quot;Connect
                  Wallet&quot; to link your MetaMask
                </li>
                <li>
                  <strong>Build Application</strong> - Create your application
                  using the Application Builder
                </li>
                <li>
                  <strong>Deploy</strong> - Choose deployment settings and
                  request bids from providers
                </li>
                <li>
                  <strong>Manage</strong> - Monitor and manage your deployments
                </li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Requirements</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-success" size={16} />
                  <span>MetaMask browser extension installed</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-success" size={16} />
                  <span>Sufficient balance in your wallet</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-success" size={16} />
                  <span>Active internet connection</span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </section>

      {/* Features */}
      <section className="scroll-mt-20" id="features">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Zap className="text-primary" size={28} />
            Features
          </h2>
          <p className="text-default-600">
            Discover the powerful features of Subnet Console
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="subnet-card shadow-lg">
            <CardBody>
              <div className="flex items-center gap-3 mb-3">
                <Server className="text-primary" size={24} />
                <h3 className="text-xl font-semibold">
                  Decentralized Deployment
                </h3>
              </div>
              <p className="text-default-600">
                Deploy your applications across a distributed network of
                providers, ensuring high availability and redundancy.
              </p>
            </CardBody>
          </Card>

          <Card className="subnet-card shadow-lg">
            <CardBody>
              <div className="flex items-center gap-3 mb-3">
                <Network className="text-primary" size={24} />
                <h3 className="text-xl font-semibold">
                  Multi-Provider Support
                </h3>
              </div>
              <p className="text-default-600">
                Choose from multiple providers based on pricing, location, and
                available resources.
              </p>
            </CardBody>
          </Card>

          <Card className="subnet-card shadow-lg">
            <CardBody>
              <div className="flex items-center gap-3 mb-3">
                <Database className="text-primary" size={24} />
                <h3 className="text-xl font-semibold">Auto Scaling</h3>
              </div>
              <p className="text-default-600">
                Automatic scaling based on demand ensures optimal performance
                and cost efficiency.
              </p>
            </CardBody>
          </Card>

          <Card className="subnet-card shadow-lg">
            <CardBody>
              <div className="flex items-center gap-3 mb-3">
                <Globe className="text-primary" size={24} />
                <h3 className="text-xl font-semibold">Global CDN</h3>
              </div>
              <p className="text-default-600">
                Built-in content delivery network for fast global access to your
                applications.
              </p>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Deployment Guide */}
      <section className="scroll-mt-20" id="deployment">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Rocket className="text-primary" size={28} />
            Deployment Guide
          </h2>
          <p className="text-default-600">
            Step-by-step instructions for deploying your applications
          </p>
        </div>

        <Card className="subnet-card shadow-lg">
          <CardBody className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">
                1. Create an Application
              </h3>
              <p className="text-default-600 mb-3">
                Start by building your application using our Application
                Builder. You can:
              </p>
              <ul className="space-y-2 list-disc list-inside ml-4">
                <li>Define your services and containers</li>
                <li>Configure CPU, memory, and storage requirements</li>
                <li>Set up GPU support if needed</li>
                <li>Configure networking and ports</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">
                2. Configure Deployment
              </h3>
              <p className="text-default-600 mb-3">
                Set your deployment preferences:
              </p>
              <ul className="space-y-2 list-disc list-inside ml-4">
                <li>Maximum price per hour</li>
                <li>Preferred region (or any region)</li>
                <li>Resource requirements</li>
                <li>Deployment name and description</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">3. Request Bids</h3>
              <p className="text-default-600 mb-3">
                Providers will submit bids based on your requirements. You can:
              </p>
              <ul className="space-y-2 list-disc list-inside ml-4">
                <li>View all available providers</li>
                <li>Compare pricing and features</li>
                <li>Check provider ratings and uptime</li>
                <li>Select the best provider for your needs</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">4. Deploy</h3>
              <p className="text-default-600">
                Once you&apos;ve selected a provider, click deploy to start your
                application. Monitor the deployment status and manage your
                application from the dashboard.
              </p>
            </div>
          </CardBody>
        </Card>
      </section>

      {/* API Reference */}
      <section className="scroll-mt-20" id="api">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <CodeIcon className="text-primary" size={28} />
            API Reference
          </h2>
          <p className="text-default-600">
            Programmatic access to Subnet Console features
          </p>
        </div>

        <Card className="subnet-card shadow-lg">
          <CardBody className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Authentication</h3>
              <p className="text-default-600 mb-3">
                All API requests require authentication via your MetaMask
                wallet.
              </p>
              <div className="bg-default-100 p-4 rounded-lg font-mono text-sm">
                <code>Authorization: Bearer YOUR_WALLET_ADDRESS</code>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Endpoints</h3>
              <div className="space-y-4">
                <div className="border border-default-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Chip color="success" size="sm">
                      GET
                    </Chip>
                    <code className="font-semibold">/api/deployments</code>
                  </div>
                  <p className="text-sm text-default-600">
                    List all deployments for the authenticated user
                  </p>
                </div>

                <div className="border border-default-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Chip color="primary" size="sm">
                      POST
                    </Chip>
                    <code className="font-semibold">/api/deployments</code>
                  </div>
                  <p className="text-sm text-default-600">
                    Create a new deployment
                  </p>
                </div>

                <div className="border border-default-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Chip color="warning" size="sm">
                      PUT
                    </Chip>
                    <code className="font-semibold">/api/deployments/:id</code>
                  </div>
                  <p className="text-sm text-default-600">
                    Update an existing deployment
                  </p>
                </div>

                <div className="border border-default-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Chip color="danger" size="sm">
                      DELETE
                    </Chip>
                    <code className="font-semibold">/api/deployments/:id</code>
                  </div>
                  <p className="text-sm text-default-600">
                    Delete a deployment
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </section>

      {/* Security */}
      <section className="scroll-mt-20" id="security">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Shield className="text-primary" size={28} />
            Security
          </h2>
          <p className="text-default-600">
            How we protect your applications and data
          </p>
        </div>

        <Card className="subnet-card shadow-lg">
          <CardBody className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Wallet Security</h3>
              <p className="text-default-600">
                All transactions and authentications are secured through your
                MetaMask wallet. Private keys never leave your device, ensuring
                complete security.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Data Encryption</h3>
              <p className="text-default-600">
                All data transmitted between your browser and providers is
                encrypted using TLS/SSL protocols. Application data is encrypted
                at rest.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Access Control</h3>
              <p className="text-default-600">
                Only you have access to your deployments through your wallet.
                Providers cannot access your application data or logs without
                your permission.
              </p>
            </div>
          </CardBody>
        </Card>
      </section>

      {/* FAQ */}
      <section className="scroll-mt-20" id="faq">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <AlertCircle className="text-primary" size={28} />
            Frequently Asked Questions
          </h2>
          <p className="text-default-600">Common questions and answers</p>
        </div>

        <div className="space-y-4">
          <Card className="subnet-card shadow-lg">
            <CardHeader>
              <h3 className="text-lg font-semibold">How do I get started?</h3>
            </CardHeader>
            <CardBody>
              <p className="text-default-600">
                Simply connect your MetaMask wallet, build your application, and
                deploy. No credit card or registration required.
              </p>
            </CardBody>
          </Card>

          <Card className="subnet-card shadow-lg">
            <CardHeader>
              <h3 className="text-lg font-semibold">
                What are the pricing models?
              </h3>
            </CardHeader>
            <CardBody>
              <p className="text-default-600">
                Pricing is based on resource usage (CPU, memory, storage, GPU).
                You set your maximum price per hour, and providers bid within
                that limit.
              </p>
            </CardBody>
          </Card>

          <Card className="subnet-card shadow-lg">
            <CardHeader>
              <h3 className="text-lg font-semibold">
                Can I scale my deployment?
              </h3>
            </CardHeader>
            <CardBody>
              <p className="text-default-600">
                Yes! You can scale your deployment up or down at any time
                through the dashboard. Changes take effect immediately.
              </p>
            </CardBody>
          </Card>

          <Card className="subnet-card shadow-lg">
            <CardHeader>
              <h3 className="text-lg font-semibold">
                What payment methods are supported?
              </h3>
            </CardHeader>
            <CardBody>
              <p className="text-default-600">
                Currently, we support payment through cryptocurrency (Ethereum,
                Polygon) via your MetaMask wallet. Traditional payment methods
                coming soon.
              </p>
            </CardBody>
          </Card>

          <Card className="subnet-card shadow-lg">
            <CardHeader>
              <h3 className="text-lg font-semibold">
                How is my application data protected?
              </h3>
            </CardHeader>
            <CardBody>
              <p className="text-default-600">
                All data is encrypted both in transit and at rest. Only you have
                access to your deployments through your wallet. See our{" "}
                <Link className="text-primary hover:underline" href="#security">
                  Security section
                </Link>{" "}
                for more details.
              </p>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="mt-12">
        <Card className="subnet-card shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
          <CardBody className="text-center py-12">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-default-600 mb-6 max-w-md mx-auto">
              Deploy your first application in minutes. No credit card required.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/deploy">
                <Button color="primary" size="lg">
                  <Rocket size={20} />
                  Start Deploying
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button size="lg" variant="bordered">
                  Browse Marketplace
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
