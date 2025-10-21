"use client";

import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { ArrowRight } from "lucide-react";

import ProviderCard from "./provider-card";
import { Provider } from "./types";

interface AllProvidersSectionProps {
  providers: Provider[];
}

export default function AllProvidersSection({
  providers,
}: AllProvidersSectionProps) {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-dark-on-white mb-2">
              All Providers
            </h2>
            <p className="text-dark-on-white-muted">
              Complete list of verified compute providers
            </p>
          </div>
          <Button
            as={Link}
            className="subnet-button-primary"
            color="primary"
            endContent={<ArrowRight size={16} />}
            href="/providers"
            variant="flat"
          >
            View All Providers
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              variant="compact"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
