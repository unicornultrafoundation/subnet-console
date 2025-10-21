"use client";

import { FC } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor, CheckCircle } from "lucide-react";

export interface ThemeSelectorProps {
  className?: string;
  variant?: "card" | "button" | "compact";
}

export const ThemeSelector: FC<ThemeSelectorProps> = ({
  className,
  variant = "card",
}) => {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
  };

  const getThemeIcon = (themeType: string) => {
    switch (themeType) {
      case "light":
        return <Sun className="text-yellow-500" size={20} />;
      case "dark":
        return <Moon className="text-blue-400" size={20} />;
      case "system":
        return <Monitor className="text-gray-500" size={20} />;
      default:
        return <Sun className="text-yellow-500" size={20} />;
    }
  };

  const getThemeDescription = (themeType: string) => {
    switch (themeType) {
      case "light":
        return "Always use light theme";
      case "dark":
        return "Always use dark theme";
      case "system":
        return "Follow system preference";
      default:
        return "Always use light theme";
    }
  };

  if (variant === "button") {
    return (
      <div className={`flex gap-2 ${className}`}>
        {["light", "dark", "system"].map((themeOption) => (
          <Button
            key={themeOption}
            className="capitalize"
            color={theme === themeOption ? "primary" : "default"}
            size="sm"
            startContent={getThemeIcon(themeOption)}
            variant={theme === themeOption ? "solid" : "flat"}
            onPress={() =>
              handleThemeChange(themeOption as "light" | "dark" | "system")
            }
          >
            {themeOption}
          </Button>
        ))}
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-sm font-medium">Theme:</span>
        <div className="flex gap-1">
          {["light", "dark", "system"].map((themeOption) => (
            <Button
              key={themeOption}
              isIconOnly
              color={theme === themeOption ? "primary" : "default"}
              size="sm"
              title={getThemeDescription(themeOption)}
              variant={theme === themeOption ? "solid" : "flat"}
              onPress={() =>
                handleThemeChange(themeOption as "light" | "dark" | "system")
              }
            >
              {getThemeIcon(themeOption)}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {["light", "dark", "system"].map((themeOption) => (
          <Card
            key={themeOption}
            isPressable
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              theme === themeOption
                ? "ring-2 ring-primary bg-primary/5"
                : "hover:bg-default-50"
            }`}
            onPress={() =>
              handleThemeChange(themeOption as "light" | "dark" | "system")
            }
          >
            <CardBody className="p-4 text-center">
              <div className="flex justify-center mb-3">
                {getThemeIcon(themeOption)}
              </div>
              <h4 className="font-semibold capitalize mb-1">{themeOption}</h4>
              <p className="text-sm text-default-600">
                {getThemeDescription(themeOption)}
              </p>
              {theme === themeOption && (
                <div className="flex justify-center mt-2">
                  <CheckCircle className="text-primary" size={16} />
                </div>
              )}
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};
