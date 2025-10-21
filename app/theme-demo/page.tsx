import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Palette } from "lucide-react";

import { ThemeSelector } from "@/components/common/theme-selector";
import { EnhancedShowcase } from "@/components/ui/enhanced-showcase";

export default function ThemeDemoPage() {
  return (
    <div className="container mx-auto max-w-6xl py-8">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold mb-6 subnet-gradient-text">
          Enhanced Design System
        </h1>
        <p className="text-xl text-default-600 max-w-3xl mx-auto">
          Showcase of modern UI effects, animations, and glassmorphism design
          elements for the Subnet Console platform.
        </p>
      </div>

      {/* Theme Selector Demo */}
      <Card className="mb-8">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <Palette className="text-primary" size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Theme Selector</h2>
              <p className="text-default-600">
                Try different themes to see how the design adapts
              </p>
            </div>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="pt-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Card Variant</h3>
              <ThemeSelector variant="card" />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Button Variant</h3>
              <ThemeSelector variant="button" />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Compact Variant</h3>
              <ThemeSelector variant="compact" />
            </div>
          </div>
        </CardBody>
      </Card>

      <EnhancedShowcase />
    </div>
  );
}
