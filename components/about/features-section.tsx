"use client";

import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import {
  Globe,
  Shield,
  Zap,
  Users,
  Target,
  Award,
  Star,
  LucideProps,
} from "lucide-react";

interface Feature {
  icon: React.ComponentType<LucideProps>;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Globe,
    title: "Global Decentralized Network",
    description:
      "Access computing resources from providers worldwide through our decentralized overlay network",
  },
  {
    icon: Shield,
    title: "Secure & Verified",
    description:
      "All providers are verified and monitored for security, ensuring reliable service delivery",
  },
  {
    icon: Zap,
    title: "Instant Deployment",
    description:
      "Deploy applications instantly with our simplified SDL templates and one-click deployment",
  },
  {
    icon: Users,
    title: "Community Driven",
    description:
      "Built by the community, for the community. Open source and transparent development",
  },
  {
    icon: Target,
    title: "Cost Effective",
    description:
      "Pay only for what you use with competitive pricing and transparent billing",
  },
  {
    icon: Award,
    title: "Enterprise Ready",
    description:
      "Production-grade infrastructure with enterprise support and SLA guarantees",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-16 bg-default-50">
      <div className="w-full px-6">
        <div className="text-center space-y-4 mb-12">
          <Chip
            color="primary"
            startContent={<Star size={16} />}
            variant="flat"
          >
            Key Features
          </Chip>
          <h2 className="text-4xl font-bold">Why Choose Subnet Network?</h2>
          <p className="text-lg text-default-600">
            We provide everything you need to deploy and scale your applications
            on a truly decentralized infrastructure.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="subnet-card hover:shadow-lg transition-all duration-300"
            >
              <CardBody className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-default-600">{feature.description}</p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
