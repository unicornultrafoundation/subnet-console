"use client";

import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Target, CheckCircle, Network, Cpu, HardDrive } from "lucide-react";

export const MissionSection = () => {
  return (
    <section className="py-16">
      <div className="w-full px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-4">
              <Chip
                color="secondary"
                startContent={<Target size={16} />}
                variant="flat"
              >
                Our Mission
              </Chip>
              <h2 className="text-4xl font-bold">
                Democratizing Access to Computing Resources
              </h2>
              <p className="text-lg text-default-600 leading-relaxed">
                We believe that access to computing resources should be
                decentralized, affordable, and available to everyone. Our
                overlay network connects developers with providers worldwide,
                creating a truly global computing marketplace.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-success mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">
                    Decentralized Infrastructure
                  </h3>
                  <p className="text-sm text-default-600">
                    No single point of failure. Distributed across thousands of
                    providers globally.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-success mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">Transparent Pricing</h3>
                  <p className="text-sm text-default-600">
                    Pay only for what you use. No hidden fees or vendor lock-in.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-success mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">Developer First</h3>
                  <p className="text-sm text-default-600">
                    Simple SDL templates and one-click deployment for any
                    application.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <Card className="subnet-card">
              <CardBody className="p-8">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mx-auto mb-4">
                      <Network className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">
                      Network Architecture
                    </h3>
                    <p className="text-default-600">
                      Our overlay network sits on top of existing
                      infrastructure, creating a seamless decentralized
                      computing experience.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 rounded-lg bg-primary/5">
                      <Cpu className="w-8 h-8 text-primary mx-auto mb-2" />
                      <div className="text-sm font-semibold">Compute</div>
                      <div className="text-xs text-default-600">CPU & GPU</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-secondary/5">
                      <HardDrive className="w-8 h-8 text-secondary mx-auto mb-2" />
                      <div className="text-sm font-semibold">Storage</div>
                      <div className="text-xs text-default-600">SSD & HDD</div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
