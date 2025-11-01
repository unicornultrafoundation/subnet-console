"use client";

import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import {
  Star,
  Database,
  Bot,
  Code,
  Shield,
  Zap,
  Image,
  Play,
  Eye,
  Heart,
  Award,
} from "lucide-react";

export interface App {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  downloads: number;
  provider: string;
  description: string;
  image: string;
  tags: string[];
  featured: boolean;
}

interface AppCardProps {
  app: App;
}

export default function AppCard({ app }: AppCardProps) {
  const router = useRouter();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "AI/ML":
        return <Bot className="text-primary" size={24} />;
      case "Web Apps":
        return <Code className="text-primary" size={24} />;
      case "Data":
        return <Database className="text-primary" size={24} />;
      case "Blockchain":
        return <Shield className="text-primary" size={24} />;
      case "IoT":
        return <Zap className="text-primary" size={24} />;
      case "Media":
        return <Image className="text-primary" size={24} />;
      default:
        return <Code className="text-primary" size={24} />;
    }
  };

  const handleDeploy = () => {
    router.push(`/deploy?app=${app.id}&mode=application`);
  };

  return (
    <Card className="subnet-card hover:scale-105 transition-transform duration-300">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start w-full">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              {getCategoryIcon(app.category)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-dark-on-white">
                {app.name}
              </h3>
              <p className="text-sm text-dark-on-white-muted">{app.category}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            {app.featured && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30">
                <Award className="text-primary" size={10} />
                <span className="text-xs font-semibold text-primary">
                  Featured
                </span>
              </div>
            )}
            <Chip color="primary" size="sm" variant="flat">
              ${app.price}/hr
            </Chip>
          </div>
        </div>
      </CardHeader>

      <CardBody className="pt-0">
        <p className="text-sm text-dark-on-white-muted mb-4">
          {app.description}
        </p>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between">
            <span className="text-sm text-dark-on-white-muted">Provider</span>
            <span className="font-medium">{app.provider}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-dark-on-white-muted">Rating</span>
            <div className="flex items-center gap-1">
              <Star className="text-warning-500 fill-current" size={12} />
              <span className="font-medium">{app.rating}</span>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-dark-on-white-muted">Downloads</span>
            <span className="font-medium">
              {app.downloads.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {app.tags.map((tag) => (
            <Chip key={tag} color="secondary" size="sm" variant="flat">
              {tag}
            </Chip>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            className="flex-1"
            color="primary"
            startContent={<Play size={16} />}
            onPress={handleDeploy}
          >
            Deploy
          </Button>
          <Button isIconOnly startContent={<Eye size={16} />} variant="flat" />
          <Button
            isIconOnly
            startContent={<Heart size={16} />}
            variant="flat"
          />
        </div>
      </CardBody>
    </Card>
  );
}
