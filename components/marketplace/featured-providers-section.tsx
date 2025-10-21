"use client";

import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { ChevronRight } from "lucide-react";

import ProviderCard from "./provider-card";
import { Provider } from "./types";

interface FeaturedProvidersSectionProps {
  providers: Provider[];
}

export default function FeaturedProvidersSection({
  providers,
}: FeaturedProvidersSectionProps) {
  const featuredProviders = providers.filter((p) => p.featured);

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-dark-on-white mb-2">
              Featured Providers
            </h2>
            <p className="text-dark-on-white-muted">
              Top-rated providers with exceptional performance
            </p>
          </div>
          <Button
            as={Link}
            endContent={<ChevronRight size={16} />}
            href="/providers"
            variant="light"
          >
            View All Providers
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProviders.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              variant="featured"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
