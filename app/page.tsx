import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Link } from "@heroui/link";
import { Badge } from "@heroui/badge";
import { Progress } from "@heroui/progress";

import { FeatureIcon } from "@/components/ui/feature-icons";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 animated-gradient" />
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl float" />
        <div
          className="absolute top-40 right-20 w-32 h-32 bg-secondary/20 rounded-full blur-xl float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-40 left-1/4 w-24 h-24 bg-primary/30 rounded-full blur-xl float"
          style={{ animationDelay: "4s" }}
        />

        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 flex items-center min-h-screen">
          <div className="mx-auto max-w-4xl text-center bg-overlay rounded-3xl p-12">
            <div className="badge-white mb-8 pulse-glow">
              🚀 Decentralized Cloud Platform
            </div>

            <h1 className="text-5xl font-bold tracking-tight hero-text-white sm:text-7xl lg:text-8xl">
              Deploy on the{" "}
              <span className="subnet-gradient-text">Subnet Network</span>
            </h1>

            <p className="mt-8 text-xl leading-8 hero-text-white-light max-w-3xl mx-auto">
              The unified dashboard for decentralized cloud computing. Deploy
              applications, manage infrastructure, and scale your workloads on a
              truly decentralized network powered by blockchain technology.
            </p>

            <div className="mt-12 flex items-center justify-center gap-x-6">
              <Button
                as={Link}
                className="px-10 py-4 text-lg font-semibold subnet-button-primary"
                color="primary"
                href="/deploy"
                size="lg"
              >
                Start Deploying
              </Button>
              <Button
                as={Link}
                className="px-10 py-4 text-lg font-semibold subnet-button-secondary"
                href="/docs"
                size="lg"
                variant="bordered"
              >
                View Documentation
              </Button>
            </div>

            {/* Enhanced Stats */}
            <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="text-center">
                <div className="text-4xl font-bold stats-text-white mb-2">
                  1000+
                </div>
                <div className="text-sm stats-text-white-muted uppercase tracking-wider">
                  Active Nodes
                </div>
                <div className="mt-2 w-16 h-1 bg-white/30 mx-auto rounded-full" />
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold stats-text-white mb-2">
                  99.9%
                </div>
                <div className="text-sm stats-text-white-muted uppercase tracking-wider">
                  Uptime
                </div>
                <div className="mt-2 w-16 h-1 bg-white/30 mx-auto rounded-full" />
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold stats-text-white mb-2">
                  24/7
                </div>
                <div className="text-sm stats-text-white-muted uppercase tracking-wider">
                  Support
                </div>
                <div className="mt-2 w-16 h-1 bg-white/30 mx-auto rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-background relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          {/* Section Header */}
          <div className="mx-auto max-w-4xl text-center mb-20">
            <Badge
              className="mb-6 glass-enhanced"
              color="secondary"
              variant="flat"
            >
              ✨ Features
            </Badge>
            <h2 className="text-5xl font-bold tracking-tight text-dark-on-white sm:text-6xl mb-8">
              Built for Developers &{" "}
              <span className="text-primary font-bold">Providers</span>
            </h2>
            <p className="text-xl leading-8 text-dark-on-white-medium max-w-3xl mx-auto">
              Whether you&apos;re deploying applications or providing compute
              resources, Subnet Console has everything you need to succeed in
              the decentralized cloud.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2 mx-auto">
            {/* For Users Card */}
            <Card className="subnet-card group relative overflow-hidden">
              {/* Card Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <CardHeader className="pb-6 relative z-10">
                <div className="flex items-center gap-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/20 to-primary/10 group-hover:scale-110 transition-all duration-300 shadow-lg">
                    <FeatureIcon
                      className="w-10 h-10 text-primary"
                      name="user"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold text-dark-on-white mb-2">
                      For Users
                    </h3>
                    <p className="text-dark-on-white-medium text-lg">
                      Deploy & Manage Applications
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <Chip
                        className="glass-enhanced"
                        color="primary"
                        size="sm"
                        startContent={
                          <FeatureIcon className="w-4 h-4" name="rocket" />
                        }
                        variant="flat"
                      >
                        Deploy
                      </Chip>
                      <Chip
                        className="glass-enhanced"
                        color="primary"
                        size="sm"
                        startContent={
                          <FeatureIcon className="w-4 h-4" name="monitor" />
                        }
                        variant="flat"
                      >
                        Monitor
                      </Chip>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardBody className="pt-0 relative z-10">
                <div className="grid gap-6">
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/10 transition-all duration-300">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <FeatureIcon className="w-6 h-6" name="deploy" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-lg text-dark-on-white mb-1">
                        One-Click Deployment
                      </div>
                      <div className="text-dark-on-white-medium">
                        Deploy applications in seconds with pre-configured
                        templates and automated setup
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/10 transition-all duration-300">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <FeatureIcon className="w-6 h-6" name="monitor" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-lg text-dark-on-white mb-1">
                        Real-time Monitoring
                      </div>
                      <div className="text-dark-on-white-medium">
                        Track CPU, memory, bandwidth, and uptime metrics with
                        live dashboards
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-r from-secondary/5 to-transparent hover:from-secondary/10 transition-all duration-300">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                      <FeatureIcon className="w-6 h-6" name="billing" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-lg text-dark-on-white mb-1">
                        Usage-based Billing
                      </div>
                      <div className="text-dark-on-white-medium">
                        Pay only for what you use with transparent pricing and
                        automatic billing
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/10 transition-all duration-300">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <FeatureIcon className="w-6 h-6" name="scale" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-lg text-dark-on-white mb-1">
                        Auto-scaling
                      </div>
                      <div className="text-dark-on-white-medium">
                        Automatically scale resources based on demand and
                        performance metrics
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* For Providers Card */}
            <Card className="subnet-card group relative overflow-hidden">
              {/* Card Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <CardHeader className="pb-6 relative z-10">
                <div className="flex items-center gap-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-secondary/20 to-secondary/10 group-hover:scale-110 transition-all duration-300 shadow-lg">
                    <FeatureIcon
                      className="w-10 h-10 text-secondary"
                      name="provider"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold text-dark-on-white mb-2">
                      For Providers
                    </h3>
                    <p className="text-dark-on-white-medium text-lg">
                      Monetize Your Infrastructure
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <Chip
                        className="glass-enhanced"
                        color="secondary"
                        size="sm"
                        startContent={
                          <FeatureIcon className="w-4 h-4" name="register" />
                        }
                        variant="flat"
                      >
                        Register
                      </Chip>
                      <Chip
                        className="glass-enhanced"
                        color="secondary"
                        size="sm"
                        startContent={
                          <FeatureIcon className="w-4 h-4" name="stake" />
                        }
                        variant="flat"
                      >
                        Stake
                      </Chip>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardBody className="pt-0 relative z-10">
                <div className="grid gap-6">
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-r from-secondary/5 to-transparent hover:from-secondary/10 transition-all duration-300">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                      <FeatureIcon className="w-6 h-6" name="register" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-lg text-dark-on-white mb-1">
                        Node Registration
                      </div>
                      <div className="text-dark-on-white-medium">
                        Register your hardware and start earning rewards with
                        minimal setup
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-r from-secondary/5 to-transparent hover:from-secondary/10 transition-all duration-300">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                      <FeatureIcon className="w-6 h-6" name="verify" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-lg text-dark-on-white mb-1">
                        Verification System
                      </div>
                      <div className="text-dark-on-white-medium">
                        Maintain reputation through verification reports and
                        quality metrics
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/10 transition-all duration-300">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <FeatureIcon className="w-6 h-6" name="stake" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-lg text-dark-on-white mb-1">
                        Staking Rewards
                      </div>
                      <div className="text-dark-on-white-medium">
                        Earn additional rewards by staking tokens and
                        maintaining uptime
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-r from-secondary/5 to-transparent hover:from-secondary/10 transition-all duration-300">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                      <FeatureIcon className="w-6 h-6" name="manage" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-lg text-dark-on-white mb-1">
                        Resource Management
                      </div>
                      <div className="text-dark-on-white-medium">
                        Efficiently manage workloads and resources with advanced
                        tools
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-32 bg-gradient-to-br from-default-50 to-primary/5 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-20">
            <Badge className="mb-6" color="primary" variant="flat">
              🛠️ Technology
            </Badge>
            <h2 className="text-4xl font-bold tracking-tight text-dark-on-white sm:text-5xl">
              Powered by Modern Technology
            </h2>
            <p className="mt-8 text-xl leading-8 text-dark-on-white-medium">
              Built with cutting-edge technologies for performance, security,
              and scalability.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-4">
            <Card className="subnet-card text-center group">
              <CardBody className="p-8">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 group-hover:scale-110 transition-transform duration-300 mb-6">
                  <span className="text-3xl">⚡</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-dark-on-white">
                  Next.js 15
                </h3>
                <p className="text-dark-on-white-medium">
                  React framework with App Router and Turbopack
                </p>
                <div className="mt-4">
                  <Progress className="w-full" color="primary" value={95} />
                  <div className="text-xs text-dark-on-white-muted mt-1">
                    Performance
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="subnet-card text-center group">
              <CardBody className="p-8">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/10 group-hover:scale-110 transition-transform duration-300 mb-6">
                  <span className="text-3xl">🔗</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-dark-on-white">
                  Blockchain
                </h3>
                <p className="text-dark-on-white-medium">
                  EVM-compatible smart contracts and Web3 integration
                </p>
                <div className="mt-4">
                  <Progress className="w-full" color="secondary" value={90} />
                  <div className="text-xs text-dark-on-white-muted mt-1">
                    Security
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="subnet-card text-center group">
              <CardBody className="p-8">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 group-hover:scale-110 transition-transform duration-300 mb-6">
                  <span className="text-3xl">🐳</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-dark-on-white">
                  Containerized
                </h3>
                <p className="text-dark-on-white-medium">
                  Docker containers with K3s orchestration
                </p>
                <div className="mt-4">
                  <Progress className="w-full" color="primary" value={88} />
                  <div className="text-xs text-dark-on-white-muted mt-1">
                    Scalability
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="subnet-card text-center group">
              <CardBody className="p-8">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/10 group-hover:scale-110 transition-transform duration-300 mb-6">
                  <span className="text-3xl">📊</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-dark-on-white">
                  Real-time
                </h3>
                <p className="text-dark-on-white-medium">
                  WebSocket and gRPC for live monitoring
                </p>
                <div className="mt-4">
                  <Progress className="w-full" color="secondary" value={92} />
                  <div className="text-xs text-dark-on-white-muted mt-1">
                    Efficiency
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 animated-gradient opacity-90" />
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <Card className="glass-enhanced-dark border-primary/20">
            <CardBody className="px-8 py-20 sm:px-16 sm:py-24">
              <div className="mx-auto max-w-3xl text-center">
                <Badge
                  className="mb-8 glass-enhanced"
                  color="primary"
                  variant="flat"
                >
                  🚀 Get Started
                </Badge>
                <h2 className="text-4xl font-bold tracking-tight text-white-on-gradient sm:text-5xl">
                  Ready to Get Started?
                </h2>
                <p className="mt-8 text-xl leading-8 text-white-on-gradient-light">
                  Join thousands of developers and providers building the future
                  of decentralized cloud computing.
                </p>
                <div className="mt-12 flex items-center justify-center gap-x-6">
                  <Button
                    as={Link}
                    className="px-10 py-4 text-lg font-semibold subnet-button-primary"
                    color="primary"
                    href="/deploy"
                    size="lg"
                  >
                    Start Deploying
                  </Button>
                  <Button
                    as={Link}
                    className="px-10 py-4 text-lg font-semibold subnet-button-secondary"
                    href="/docs"
                    size="lg"
                    variant="bordered"
                  >
                    Read Documentation
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </section>
    </div>
  );
}
