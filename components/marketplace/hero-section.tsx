"use client";

import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Search, Filter, Sparkles } from "lucide-react";

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  stats: {
    totalProviders: number;
    totalApps: number;
    totalDeployments: number;
    averageUptime: number;
  };
}

export default function HeroSection({
  searchQuery,
  setSearchQuery,
  stats,
}: HeroSectionProps) {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2334CC99' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="text-primary" size={20} />
            <span className="text-sm font-medium text-primary">
              Decentralized Marketplace
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Subnet Marketplace
            </span>
          </h1>

          <p className="text-xl text-default-700 max-w-3xl mx-auto mb-8">
            Discover verified providers and deploy applications across the
            decentralized cloud network. Find the perfect compute resources for
            your next project.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Input
                className="text-lg"
                placeholder="Search providers, apps, or categories..."
                size="lg"
                startContent={<Search className="text-default-400" size={20} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                className="absolute right-2 top-1/2 -translate-y-1/2"
                color="primary"
                size="lg"
                startContent={<Filter size={18} />}
              >
                Filter
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {stats.totalProviders}
              </div>
              <div className="text-sm text-default-600">Providers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary">
                {stats.totalApps}
              </div>
              <div className="text-sm text-default-600">Applications</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {stats.totalDeployments.toLocaleString()}
              </div>
              <div className="text-sm text-default-600">Deployments</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary">
                {stats.averageUptime.toFixed(2)}%
              </div>
              <div className="text-sm text-default-600">Avg Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
