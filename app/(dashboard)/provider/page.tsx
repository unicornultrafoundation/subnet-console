"use client";

import { useState, useEffect } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Spinner } from "@heroui/spinner";
import {
  Server,
  Database,
  Shield,
  TrendingUp,
  ArrowRight,
  Settings,
  ClipboardCheck,
} from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";
import {
  isProviderRegistered,
  getProviderInfo,
  type ProviderInfo,
} from "@/lib/blockchain/provider-contract";
import ProviderRegistration from "@/components/dashboard/provider/ProviderRegistration";

export default function ProviderDashboardPage() {
  const { address, isConnected, isLoading: walletLoading } = useWallet();
  const [isChecking, setIsChecking] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [providerInfo, setProviderInfo] = useState<ProviderInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Check provider registration status
  useEffect(() => {
    const checkRegistration = async () => {
      if (!isConnected || !address || walletLoading) {
        setIsChecking(false);
        return;
      }

      setIsChecking(true);
      setError(null);

      try {
        const registered = await isProviderRegistered(address);
        setIsRegistered(registered);

        if (registered) {
          const info = await getProviderInfo(address);
          setProviderInfo(info);
        }
      } catch (err: any) {
        console.error("Error checking registration:", err);
        setError(err.message || "Failed to check registration status");
      } finally {
        setIsChecking(false);
      }
    };

    checkRegistration();
  }, [address, isConnected, walletLoading]);

  const menuItems = [
    {
      title: "Node Management",
      description: "Manage and monitor your Subnet nodes",
      href: "/provider/nodes",
      icon: Server,
      color: "primary",
      stats: "4 nodes",
    },
    {
      title: "Hosting",
      description: "Manage deployed applications",
      href: "/provider/hosting",
      icon: Database,
      color: "secondary",
      stats: "12 deployments",
    },
    {
      title: "Open Orders",
      description: "Orders without expiration - accept anytime",
      href: "/provider/orders/open",
      icon: ClipboardCheck,
      color: "success",
      stats: "2 open",
    },
    {
      title: "Staking",
      description: "Stake tokens and claim rewards",
      href: "/provider/staking",
      icon: TrendingUp,
      color: "success",
      stats: "Active",
    },
    {
      title: "Verification",
      description: "Submit verification reports",
      href: "/provider/verification",
      icon: Shield,
      color: "warning",
      stats: "Verified",
    },
    {
      title: "Settings",
      description: "Configure provider settings and pricing",
      href: "/provider/settings",
      icon: Settings,
      color: "default",
      stats: "Configure",
    },
  ];

  // Show loading state
  if (walletLoading || isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background/50 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-dark-on-white-muted">
            Checking provider registration status...
          </p>
        </div>
      </div>
    );
  }

  // Show registration flow if not registered
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background/50">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          <Card>
            <CardBody className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
              <p className="text-dark-on-white-muted mb-6">
                Please connect your wallet to access the provider dashboard
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  if (!isRegistered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background/50">
        <div className="container mx-auto px-6 py-8">
          <ProviderRegistration />
        </div>
      </div>
    );
  }

  // Show error if there was an issue
  if (error && !isRegistered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background/50">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          <Card>
            <CardBody className="p-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4 text-danger">Error</h2>
                <p className="text-dark-on-white-muted mb-6">{error}</p>
                <Button
                  color="primary"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-dark-on-white mb-2">
            Provider Dashboard
          </h1>
          <p className="text-lg text-dark-on-white-muted">
            Manage your nodes, deployments, and provider services
          </p>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <Card
                key={item.href}
                className="subnet-card hover:shadow-lg transition-all hover:scale-[1.02]"
              >
                <CardBody className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <Icon className={`text-${item.color}`} size={24} />
                    </div>
                    <span
                      className={`text-sm font-semibold text-${item.color}`}
                    >
                      {item.stats}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-dark-on-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-dark-on-white-muted mb-4">
                    {item.description}
                  </p>
                  <Button
                    as={Link}
                    className="w-full"
                    color={item.color as any}
                    endContent={<ArrowRight size={16} />}
                    href={item.href}
                    variant="flat"
                  >
                    Go to {item.title}
                  </Button>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
