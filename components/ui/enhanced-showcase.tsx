import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Badge } from "@heroui/badge";
import { Progress } from "@heroui/progress";

export const EnhancedShowcase = () => {
  return (
    <div className="space-y-12">
      {/* Glassmorphism Cards */}
      <Card>
        <CardHeader>
          <h3 className="text-2xl font-bold">Glassmorphism Effects</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass p-6 rounded-2xl text-center">
              <h4 className="font-semibold mb-2">Light Glass</h4>
              <p className="text-sm text-default-600">
                Transparent background with blur effect
              </p>
            </div>
            <div className="glass-dark p-6 rounded-2xl text-center">
              <h4 className="font-semibold mb-2">Dark Glass</h4>
              <p className="text-sm text-default-600">
                Dark transparent background
              </p>
            </div>
            <div className="subnet-card p-6 rounded-2xl text-center">
              <h4 className="font-semibold mb-2">Enhanced Card</h4>
              <p className="text-sm text-default-600">
                Hover for gradient border effect
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Animated Elements */}
      <Card>
        <CardHeader>
          <h3 className="text-2xl font-bold">Animations & Effects</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4 float flex items-center justify-center">
                <span className="text-2xl">🎈</span>
              </div>
              <h4 className="font-semibold">Floating</h4>
              <p className="text-sm text-default-600">Gentle up-down motion</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 animated-gradient rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🌈</span>
              </div>
              <h4 className="font-semibold">Gradient</h4>
              <p className="text-sm text-default-600">Animated color shifts</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4 pulse-glow flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
              <h4 className="font-semibold">Pulse Glow</h4>
              <p className="text-sm text-default-600">Glowing pulse effect</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full mx-auto mb-4 hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <h4 className="font-semibold">Hover Scale</h4>
              <p className="text-sm text-default-600">Scale on hover</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Enhanced Buttons */}
      <Card>
        <CardHeader>
          <h3 className="text-2xl font-bold">Enhanced Buttons</h3>
        </CardHeader>
        <CardBody>
          <div className="flex flex-wrap gap-4">
            <Button className="subnet-button-primary">Primary Button</Button>
            <Button className="subnet-button-secondary">
              Secondary Button
            </Button>
            <Button className="glass" color="primary" variant="flat">
              Glass Button
            </Button>
            <Button className="pulse-glow" color="secondary" variant="bordered">
              Glow Button
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Progress Indicators */}
      <Card>
        <CardHeader>
          <h3 className="text-2xl font-bold">Progress Indicators</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Performance</span>
                <span className="text-primary font-bold">95%</span>
              </div>
              <Progress className="w-full" color="primary" value={95} />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Security</span>
                <span className="text-secondary font-bold">90%</span>
              </div>
              <Progress className="w-full" color="secondary" value={90} />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Scalability</span>
                <span className="text-primary font-bold">88%</span>
              </div>
              <Progress className="w-full" color="primary" value={88} />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Badges & Chips */}
      <Card>
        <CardHeader>
          <h3 className="text-2xl font-bold">Badges & Status</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-3">Badges</h4>
              <div className="flex flex-wrap gap-3">
                <Badge className="glass" color="primary" variant="flat">
                  Primary Badge
                </Badge>
                <Badge className="pulse-glow" color="secondary" variant="flat">
                  Glowing Badge
                </Badge>
                <Badge color="success" variant="flat">
                  Success Badge
                </Badge>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Chips</h4>
              <div className="flex flex-wrap gap-3">
                <Chip color="primary" variant="flat">
                  Primary
                </Chip>
                <Chip color="secondary" variant="flat">
                  Secondary
                </Chip>
                <Chip color="success" variant="flat">
                  Success
                </Chip>
                <Chip color="warning" variant="flat">
                  Warning
                </Chip>
                <Chip color="danger" variant="flat">
                  Danger
                </Chip>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Gradient Text */}
      <Card>
        <CardHeader>
          <h3 className="text-2xl font-bold">Gradient Text</h3>
        </CardHeader>
        <CardBody>
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold subnet-gradient-text">
              Subnet Console
            </h1>
            <p className="text-lg text-default-600">
              Beautiful gradient text effects with CSS
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
