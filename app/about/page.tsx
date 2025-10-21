"use client";

import { HeroSection } from "@/components/about/hero-section";
import { MissionSection } from "@/components/about/mission-section";
import { FeaturesSection } from "@/components/about/features-section";
import { TeamSection } from "@/components/about/team-section";
import { CTASection } from "@/components/about/cta-section";

export default function AboutPage() {
  return (
    <div className="about-page min-h-screen bg-gradient-to-br from-background to-background/50 w-full">
      <HeroSection />
      <MissionSection />
      <FeaturesSection />
      <TeamSection />
      <CTASection />
    </div>
  );
}
