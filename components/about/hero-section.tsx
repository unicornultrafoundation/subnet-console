"use client";

import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Network, Server, Zap, Users, Shield, LucideProps } from "lucide-react";

interface Stat {
  label: string;
  value: string;
  icon: React.ComponentType<LucideProps>;
}

const stats: Stat[] = [
  { label: "Active Providers", value: "2,847", icon: Server },
  { label: "Applications Deployed", value: "15,392", icon: Zap },
  { label: "Total Users", value: "89,156", icon: Users },
  { label: "Network Uptime", value: "99.9%", icon: Shield },
];

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10" />
      <div className="relative w-full px-6 py-24">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <Chip
              className="text-sm"
              color="primary"
              startContent={<Network size={16} />}
              variant="flat"
            >
              Decentralized Computing Network
            </Chip>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              About Subnet Network
            </h1>
            <p className="text-xl text-default-600 leading-relaxed">
              We&apos;re building the future of decentralized computing by
              connecting developers with global computing resources through a
              secure, efficient overlay network.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="subnet-card border-none bg-background/60 backdrop-blur-sm"
              >
                <CardBody className="text-center space-y-2">
                  <div className="flex justify-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-sm text-default-600">{stat.label}</div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
