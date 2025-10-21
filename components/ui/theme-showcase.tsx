import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Progress } from "@heroui/progress";

export const ThemeShowcase = () => {
  return (
    <div className="space-y-8">
      {/* Color Palette */}
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">
            Subnet Console Color Palette
          </h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#34CC99] rounded-lg mx-auto mb-2" />
              <p className="text-sm font-medium">Primary</p>
              <p className="text-xs text-default-500">#34CC99</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#006261] rounded-lg mx-auto mb-2" />
              <p className="text-sm font-medium">Secondary</p>
              <p className="text-xs text-default-500">#006261</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-lg mx-auto mb-2" />
              <p className="text-sm font-medium">Dark</p>
              <p className="text-xs text-default-500">#000000</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white border border-default-200 rounded-lg mx-auto mb-2" />
              <p className="text-sm font-medium">Light</p>
              <p className="text-xs text-default-500">#FFFFFF</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Buttons */}
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">Button Styles</h3>
        </CardHeader>
        <CardBody>
          <div className="flex flex-wrap gap-4">
            <Button color="primary">Primary Button</Button>
            <Button color="secondary">Secondary Button</Button>
            <Button color="primary" variant="flat">
              Flat Primary
            </Button>
            <Button color="secondary" variant="flat">
              Flat Secondary
            </Button>
            <Button color="primary" variant="bordered">
              Bordered Primary
            </Button>
            <Button color="secondary" variant="bordered">
              Bordered Secondary
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Chips */}
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">Status Chips</h3>
        </CardHeader>
        <CardBody>
          <div className="flex flex-wrap gap-4">
            <Chip color="primary" variant="flat">
              Active
            </Chip>
            <Chip color="secondary" variant="flat">
              Inactive
            </Chip>
            <Chip color="primary" variant="solid">
              Running
            </Chip>
            <Chip color="secondary" variant="solid">
              Stopped
            </Chip>
            <Chip color="primary" variant="bordered">
              Verified
            </Chip>
            <Chip color="secondary" variant="bordered">
              Pending
            </Chip>
          </div>
        </CardBody>
      </Card>

      {/* Progress Bars */}
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">Progress Indicators</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">CPU Usage</span>
                <span className="text-sm text-default-600">65%</span>
              </div>
              <Progress className="w-full" color="primary" value={65} />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Memory Usage</span>
                <span className="text-sm text-default-600">78%</span>
              </div>
              <Progress className="w-full" color="secondary" value={78} />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Storage Usage</span>
                <span className="text-sm text-default-600">45%</span>
              </div>
              <Progress className="w-full" color="primary" value={45} />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Gradient Examples */}
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">Gradient Examples</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <div className="subnet-gradient h-16 rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold">
                Subnet Gradient Background
              </span>
            </div>
            <div className="h-16 rounded-lg flex items-center justify-center border border-default-200">
              <span className="subnet-gradient-text text-2xl font-bold">
                Subnet Gradient Text
              </span>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
