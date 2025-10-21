"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Switch } from "@heroui/switch";
import { Divider } from "@heroui/divider";
import { Badge } from "@heroui/badge";
import { useTheme } from "next-themes";
import {
  Settings,
  Palette,
  ArrowLeft,
  User,
  Bell,
  Shield,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import Link from "next/link";

import { ThemeSelector } from "@/components/common/theme-selector";

export default function SettingsPage() {
  const { theme } = useTheme();

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: false,
    updates: true,
  });

  const [privacy, setPrivacy] = useState({
    profile: "public",
    analytics: true,
    cookies: true,
  });

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50">
      {/* Header */}
      <section className="relative py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5" />

        <div className="relative max-w-7xl mx-auto">
          {/* Back Button */}
          <div className="mb-8">
            <Button
              as={Link}
              className="text-default-600 hover:text-primary"
              href="/"
              startContent={<ArrowLeft size={16} />}
              variant="light"
            >
              Back to Dashboard
            </Button>
          </div>

          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Settings className="text-primary" size={20} />
              <span className="text-sm font-medium text-primary">Settings</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Settings
              </span>
            </h1>

            <p className="text-xl text-default-700 max-w-3xl mx-auto">
              Customize your experience and manage your preferences
            </p>
          </div>
        </div>
      </section>

      {/* Settings Content */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-8">
            {/* Appearance Settings */}
            <Card className="p-6">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Palette className="text-primary" size={20} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Appearance</h2>
                    <p className="text-default-600">
                      Customize how the interface looks
                    </p>
                  </div>
                </div>
              </CardHeader>
              <Divider />
              <CardBody className="pt-6">
                <div className="space-y-6">
                  {/* Theme Selection */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Theme</h3>
                    <ThemeSelector variant="card" />
                  </div>

                  {/* Current Theme Info */}
                  <div className="p-4 rounded-lg bg-default-100">
                    <div className="flex items-center gap-3">
                      {getThemeIcon(theme || "light")}
                      <div>
                        <p className="font-medium">Current Theme</p>
                        <p className="text-sm text-default-600">
                          {getThemeDescription(theme || "light")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Notifications Settings */}
            <Card className="p-6">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-warning-100 to-warning-200 flex items-center justify-center">
                    <Bell className="text-warning-600" size={20} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Notifications</h2>
                    <p className="text-default-600">
                      Manage your notification preferences
                    </p>
                  </div>
                </div>
              </CardHeader>
              <Divider />
              <CardBody className="pt-6">
                <div className="space-y-4">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </p>
                        <p className="text-sm text-default-600">
                          {key === "email" && "Receive email notifications"}
                          {key === "push" && "Receive push notifications"}
                          {key === "marketing" && "Receive marketing emails"}
                          {key === "updates" && "Receive product updates"}
                        </p>
                      </div>
                      <Switch
                        color="primary"
                        isSelected={value}
                        onValueChange={(checked) =>
                          setNotifications((prev) => ({
                            ...prev,
                            [key]: checked,
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Privacy Settings */}
            <Card className="p-6">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-success-100 to-success-200 flex items-center justify-center">
                    <Shield className="text-success-600" size={20} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Privacy & Security</h2>
                    <p className="text-default-600">
                      Control your privacy settings
                    </p>
                  </div>
                </div>
              </CardHeader>
              <Divider />
              <CardBody className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Profile Visibility</p>
                      <p className="text-sm text-default-600">
                        Control who can see your profile
                      </p>
                    </div>
                    <Badge color="primary" variant="flat">
                      {privacy.profile}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Analytics</p>
                      <p className="text-sm text-default-600">
                        Help improve the platform with usage data
                      </p>
                    </div>
                    <Switch
                      color="primary"
                      isSelected={privacy.analytics}
                      onValueChange={(checked) =>
                        setPrivacy((prev) => ({ ...prev, analytics: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Cookies</p>
                      <p className="text-sm text-default-600">
                        Allow cookies for better experience
                      </p>
                    </div>
                    <Switch
                      color="primary"
                      isSelected={privacy.cookies}
                      onValueChange={(checked) =>
                        setPrivacy((prev) => ({ ...prev, cookies: checked }))
                      }
                    />
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Account Settings */}
            <Card className="p-6">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center">
                    <User className="text-primary" size={20} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Account</h2>
                    <p className="text-default-600">
                      Manage your account information
                    </p>
                  </div>
                </div>
              </CardHeader>
              <Divider />
              <CardBody className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Language</p>
                      <p className="text-sm text-default-600">
                        Choose your preferred language
                      </p>
                    </div>
                    <Badge color="default" variant="flat">
                      English
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Timezone</p>
                      <p className="text-sm text-default-600">
                        Set your local timezone
                      </p>
                    </div>
                    <Badge color="default" variant="flat">
                      UTC+7
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Data Export</p>
                      <p className="text-sm text-default-600">
                        Download your data
                      </p>
                    </div>
                    <Button color="primary" size="sm" variant="flat">
                      Export Data
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button className="px-8" color="primary" size="lg">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
