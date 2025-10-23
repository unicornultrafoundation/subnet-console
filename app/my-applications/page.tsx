"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Play, 
  Calendar,
  Tag,
  Server,
  ArrowRight
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Application {
  id: string;
  name: string;
  description: string;
  version: string;
  category: string;
  tags: string[];
  services: any[];
  createdAt: string;
  updatedAt: string;
}

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Load applications from localStorage
    const savedApps = JSON.parse(localStorage.getItem('applications') || '[]');
    setApplications(savedApps);
  }, []);

  const categories = [
    "Web Application",
    "API Service", 
    "Database",
    "Machine Learning",
    "Blockchain",
    "Game Server",
    "Media Processing",
    "Other"
  ];

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteApplication = (appId: string) => {
    if (confirm("Are you sure you want to delete this application?")) {
      const updatedApps = applications.filter(app => app.id !== appId);
      setApplications(updatedApps);
      localStorage.setItem('applications', JSON.stringify(updatedApps));
    }
  };

  const handleDeployApplication = (appId: string) => {
    // Navigate to deploy page with selected application
    router.push(`/deploy?app=${appId}&mode=application`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Applications</h1>
            <p className="text-default-600 mt-1">
              Manage your built applications and deploy them
            </p>
          </div>
          
          <Button
            color="primary"
            startContent={<Plus size={16} />}
            onClick={() => router.push('/applications/builder')}
          >
            Build New Application
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Search applications..."
            startContent={<Search size={16} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-default-200 rounded-lg bg-background text-default-700"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Applications Grid */}
        {filteredApplications.length === 0 ? (
          <Card className="subnet-card">
            <CardBody className="text-center py-12">
              <Server className="mx-auto text-default-400 mb-4" size={48} />
              <h3 className="text-lg font-semibold text-default-600 mb-2">
                {applications.length === 0 ? "No Applications Built" : "No Applications Found"}
              </h3>
              <p className="text-default-500 mb-6">
                {applications.length === 0 
                  ? "Start building your first application to get started"
                  : "Try adjusting your search or filter criteria"
                }
              </p>
              {applications.length === 0 && (
                <Button
                  color="primary"
                  startContent={<Plus size={16} />}
                  onClick={() => router.push('/applications/builder')}
                >
                  Build First Application
                </Button>
              )}
            </CardBody>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApplications.map((app) => (
              <Card key={app.id} className="subnet-card hover:shadow-lg transition-shadow">
                <CardHeader className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{app.name}</h3>
                    <p className="text-sm text-default-600 line-clamp-2">
                      {app.description || "No description provided"}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onClick={() => router.push(`/applications/builder?edit=${app.id}`)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="danger"
                      onClick={() => handleDeleteApplication(app.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardBody className="space-y-4">
                  {/* Category & Version */}
                  <div className="flex items-center justify-between text-sm">
                    <Chip size="sm" variant="flat" color="primary">
                      {app.category || "Uncategorized"}
                    </Chip>
                    <span className="text-default-500">v{app.version}</span>
                  </div>
                  
                  {/* Tags */}
                  {app.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {app.tags.slice(0, 3).map((tag, index) => (
                        <Chip key={index} size="sm" variant="flat">
                          {tag}
                        </Chip>
                      ))}
                      {app.tags.length > 3 && (
                        <Chip size="sm" variant="flat">
                          +{app.tags.length - 3} more
                        </Chip>
                      )}
                    </div>
                  )}
                  
                  {/* Services Info */}
                  <div className="flex items-center gap-2 text-sm text-default-600">
                    <Server size={14} />
                    <span>{app.services.length} service{app.services.length !== 1 ? 's' : ''}</span>
                  </div>
                  
                  {/* Created Date */}
                  <div className="flex items-center gap-2 text-sm text-default-500">
                    <Calendar size={14} />
                    <span>
                      Created {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      color="primary"
                      size="sm"
                      className="flex-1"
                      startContent={<Play size={14} />}
                      onClick={() => handleDeployApplication(app.id)}
                    >
                      Deploy
                    </Button>
                    <Button
                      variant="bordered"
                      size="sm"
                      endContent={<ArrowRight size={14} />}
                      onClick={() => router.push(`/applications/builder?edit=${app.id}`)}
                    >
                      Edit
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
