"use client";

import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { ChevronRight, ArrowRight } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="py-16">
      <div className="w-full px-6">
        <Card
          className="bg-gradient-to-r from-gray-800 to-gray-900 border-none"
          style={{ backgroundColor: "#1f2937" }}
        >
          <CardBody className="p-12 text-center space-y-6">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-white">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-white/90">
                Join thousands of developers already building on Subnet Network.
                Deploy your first application in minutes.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                as={Link}
                className="bg-white text-primary hover:bg-white/90"
                endContent={<ArrowRight size={20} />}
                href="/marketplace"
                size="lg"
              >
                Explore Marketplace
              </Button>
              <Button
                as={Link}
                className="border-white text-white hover:bg-white/10"
                endContent={<ChevronRight size={20} />}
                href="/applications"
                size="lg"
                variant="bordered"
              >
                Browse Applications
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </section>
  );
};
