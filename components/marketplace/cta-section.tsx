"use client";

import { Button } from "@heroui/button";
import { Zap, Users } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-dark-on-white mb-4">
          Ready to Deploy?
        </h2>
        <p className="text-xl text-dark-on-white-muted mb-8">
          Join thousands of developers building on the decentralized cloud
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            className="subnet-button-primary"
            color="primary"
            size="lg"
            startContent={<Zap size={20} />}
          >
            Start Deploying
          </Button>
          <Button
            className="border-primary text-primary hover:bg-primary hover:text-white"
            size="lg"
            startContent={<Users size={20} />}
            variant="bordered"
          >
            Become a Provider
          </Button>
        </div>
      </div>
    </section>
  );
}
