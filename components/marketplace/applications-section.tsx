"use client";

import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { ChevronRight } from "lucide-react";

import AppCard, { App } from "./app-card";

interface ApplicationsSectionProps {
  apps: App[];
}

export default function ApplicationsSection({
  apps,
}: ApplicationsSectionProps) {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-dark-on-white mb-2">
              Applications
            </h2>
            <p className="text-dark-on-white-muted">
              Deploy pre-built applications instantly
            </p>
          </div>
          <Button
            as={Link}
            endContent={<ChevronRight size={16} />}
            href="/applications"
            variant="light"
          >
            Browse All
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      </div>
    </section>
  );
}
