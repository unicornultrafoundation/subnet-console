"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { 
  Plus, 
  Trash2, 
  Save, 
  ArrowLeft, 
  Settings, 
  Code, 
  CheckCircle,
  Gpu,
  Cpu,
  MemoryStick,
  HardDrive,
  Server,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff
} from "lucide-react";

// Import existing components
import BuilderConfiguration from "@/components/deploy/BuilderConfiguration";

interface Service {
  id: string;
  name: string;
  image: string;
  command: string[];
  args: string[];
  env: { key: string; value: string }[];
  volumes: {
    id: string;
    name: string;
    size: string;
    sizeUnit: string;
    type: string;
    mount: string;
    readOnly: boolean;
  }[];
  expose: {
    id: string;
    port: number;
    as: number;
    protocol: string;
    acceptDomains: string[];
    toServices: string[];
  }[];
  resources: {
    cpu: { units: string };
    memory: { size: string };
    storage: { size: string }[];
    gpu: {
      units: string;
      configs: {
        vendor: string;
        model: string;
        memory: string;
        interface: string;
      }[];
    };
  };
  replicas?: number;
  registryUrl?: string;
  registryUsername?: string;
  registryPassword?: string;
}

interface Application {
  id: string;
  name: string;
  description: string;
  version: string;
  category: string;
  tags: string[];
  services: Service[];
  createdAt: string;
  updatedAt: string;
}

export default function ApplicationBuilder() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [applicationName, setApplicationName] = useState("");
  const [applicationDescription, setApplicationDescription] = useState("");
  const [applicationCategory, setApplicationCategory] = useState("");
  const [applicationTags, setApplicationTags] = useState<string[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [hiddenServices, setHiddenServices] = useState<Set<string>>(new Set());

  // Load application data when editing
  useEffect(() => {
    const appId = searchParams.get('id') || searchParams.get('edit');
    console.log('App ID from URL:', appId);
    
    if (appId) {
      const savedApplications = JSON.parse(localStorage.getItem('applications') || '[]');
      console.log('Saved applications:', savedApplications);
      
      const application = savedApplications.find((app: any) => app.id === appId);
      console.log('Found application:', application);
      
      if (application) {
        console.log('Setting form data:', {
          name: application.name,
          description: application.description,
          category: application.category,
          tags: application.tags,
          services: application.services
        });
        
        setApplicationName(application.name || "");
        setApplicationDescription(application.description || "");
        setApplicationCategory(application.category || "");
        setApplicationTags(application.tags || []);
        setServices(application.services || []);
      } else {
        console.log('Application not found with ID:', appId);
      }
    }
  }, [searchParams]);

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

  const handleAddService = () => {
    const newService: Service = {
      id: `service-${Date.now()}`,
      name: `service-${services.length + 1}`,
      image: "nginx:latest",
      command: ["nginx", "-g", "daemon off;"],
      args: [],
      env: [],
      volumes: [{ 
        id: `volume-${Date.now()}`,
        name: "data-volume",
        size: "10",
        sizeUnit: "GB",
        type: "ssd",
        mount: "/data",
        readOnly: false
      }],
      expose: [{ 
        id: `port-${Date.now()}`,
        port: 80, 
        as: 80, 
        protocol: "http",
        acceptDomains: [],
        toServices: []
      }],
      resources: {
        cpu: { units: "1" },
        memory: { size: "1Gi" },
        storage: [{ size: "10Gi" }],
        gpu: {
          units: "0",
          configs: [],
        },
      },
      replicas: 1,
    };

    setServices([...services, newService]);
  };

  const handleRemoveService = (serviceId: string) => {
    setServices(services.filter(s => s.id !== serviceId));
  };

  const toggleServiceVisibility = (serviceId: string) => {
    const newHiddenServices = new Set(hiddenServices);
    if (newHiddenServices.has(serviceId)) {
      newHiddenServices.delete(serviceId);
    } else {
      newHiddenServices.add(serviceId);
    }
    setHiddenServices(newHiddenServices);
  };

  const handleUpdateService = (serviceId: string, field: string, value: any) => {
    setServices(services.map(s => {
      if (s.id === serviceId) {
        if (field === "cpu") {
          return { ...s, resources: { ...s.resources, cpu: { units: value } } };
        } else if (field === "memory") {
          return { ...s, resources: { ...s.resources, memory: { size: value } } };
        } else if (field === "storage") {
          return { ...s, resources: { ...s.resources, storage: [{ size: value }] } };
        } else if (field === "gpu_units") {
          return { 
            ...s, 
            resources: { 
              ...s.resources, 
              gpu: { 
                ...s.resources.gpu, 
                units: value,
                configs: s.resources.gpu?.configs || []
              } 
            }
          };
        } else if (field === "gpu_configs") {
          return { 
            ...s, 
            resources: { 
              ...s.resources, 
              gpu: { 
                ...s.resources.gpu, 
                configs: value
              } 
            }
          };
        } else {
          return { ...s, [field]: value };
        }
      }
      return s;
    }));
  };

  const handleSaveApplication = async () => {
    if (!applicationName.trim()) {
      alert("Application name is required");
      return;
    }

    if (services.length === 0) {
      alert("At least one service is required");
      return;
    }

    setIsSaving(true);

    try {
      const appId = searchParams.get('id') || searchParams.get('edit');
      const isEditing = !!appId;
      
      const application: Application = {
        id: isEditing ? appId : `app-${Date.now()}`,
        name: applicationName,
        description: applicationDescription,
        version: "1.0.0",
        category: applicationCategory,
        tags: applicationTags,
        services: services,
        createdAt: isEditing ? 
          JSON.parse(localStorage.getItem('applications') || '[]')
            .find((app: any) => app.id === appId)?.createdAt || new Date().toISOString() :
          new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save to localStorage for now (in real app, this would be API call)
      const existingApps = JSON.parse(localStorage.getItem('applications') || '[]');
      
      if (isEditing) {
        // Update existing application
        const updatedApps = existingApps.map((app: any) => 
          app.id === appId ? application : app
        );
        localStorage.setItem('applications', JSON.stringify(updatedApps));
      } else {
        // Create new application
        existingApps.push(application);
        localStorage.setItem('applications', JSON.stringify(existingApps));
      }

      // Redirect to deploy page with the new application selected
      router.push(`/deploy?app=${application.id}&mode=application`);
      
    } catch (error) {
      console.error("Error saving application:", error);
      alert("Error saving application");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              isIconOnly
              variant="bordered"
              onClick={() => window.history.back()}
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">
                {(searchParams.get('id') || searchParams.get('edit')) ? 'Edit Application' : 'Application Builder'}
              </h1>
              <p className="text-default-600 mt-1">
                Build and configure your application for deployment
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="bordered"
              onClick={() => router.push('/my-applications')}
            >
              Back to My Applications
            </Button>
            <Button
              color="primary"
              startContent={<Save size={16} />}
              onClick={handleSaveApplication}
              isLoading={isSaving}
            >
              {searchParams.get('id') || searchParams.get('edit') ? 'Update & Deploy' : 'Save & Deploy'}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Application Info */}
          <div className="lg:col-span-1">
            <Card className="subnet-card">
              <CardHeader className="flex items-center gap-2">
                <Settings className="text-primary" size={20} />
                <h3 className="text-lg font-semibold">Application Info</h3>
              </CardHeader>
              <CardBody className="space-y-4">
                {/* Info Banner */}
                <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-xs font-bold">i</span>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-primary mb-1">Next Steps</p>
                      <p className="text-default-600">
                        After saving, you'll be redirected to the deploy page where you can choose deployment settings and request bids from providers.
                      </p>
                    </div>
                  </div>
                </div>
                
                <Input
                  label="Application Name"
                  placeholder="Enter application name"
                  value={applicationName}
                  onChange={(e) => setApplicationName(e.target.value)}
                  isRequired
                />
                
                <Input
                  label="Description"
                  placeholder="Describe your application"
                  value={applicationDescription}
                  onChange={(e) => setApplicationDescription(e.target.value)}
                  multiline
                  minRows={3}
                />
                
                <Select
                  label="Category"
                  placeholder="Select category"
                  selectedKeys={applicationCategory ? [applicationCategory] : []}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;
                    setApplicationCategory(selected);
                  }}
                >
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </Select>
                
                <div>
                  <label className="text-sm font-medium text-default-700 mb-2 block">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {applicationTags.map((tag, index) => (
                      <Chip
                        key={index}
                        onClose={() => setApplicationTags(applicationTags.filter((_, i) => i !== index))}
                        variant="flat"
                        color="primary"
                      >
                        {tag}
                      </Chip>
                    ))}
                    <Button
                      size="sm"
                      variant="bordered"
                      startContent={<Plus size={14} />}
                      onClick={() => {
                        const tag = prompt("Enter tag:");
                        if (tag && tag.trim()) {
                          setApplicationTags([...applicationTags, tag.trim()]);
                        }
                      }}
                    >
                      Add Tag
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Services Configuration */}
          <div className="lg:col-span-2">
            <Card className="subnet-card">
              <CardHeader className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code className="text-primary" size={20} />
                  <h3 className="text-lg font-semibold">Services Configuration</h3>
                </div>
              </CardHeader>
              <CardBody>
                {services.length === 0 ? (
                  <div className="text-center py-12">
                    <Server className="mx-auto text-default-400 mb-4" size={48} />
                    <h4 className="text-lg font-semibold text-default-600 mb-2">
                      No Services Added
                    </h4>
                    <p className="text-default-500 mb-4">
                      Add your first service to start building your application
                    </p>
                    <Button
                      color="primary"
                      startContent={<Plus size={16} />}
                      onClick={handleAddService}
                    >
                      Add First Service
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {services.map((service, index) => (
                      <Card key={service.id} className="border border-default-200">
                        <CardHeader className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-primary font-semibold text-sm">
                                {index + 1}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-semibold">{service.name}</h4>
                              <p className="text-sm text-default-500">{service.image}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              color={hiddenServices.has(service.id) ? "default" : "primary"}
                              onClick={() => toggleServiceVisibility(service.id)}
                            >
                              {hiddenServices.has(service.id) ? <EyeOff size={16} /> : <Eye size={16} />}
                            </Button>
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              color="danger"
                              onClick={() => handleRemoveService(service.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </CardHeader>
                        {!hiddenServices.has(service.id) && (
                          <CardBody>
                            <BuilderConfiguration
                              service={service}
                              onUpdateService={(field, value) => {
                                handleUpdateService(service.id, field, value);
                              }}
                              availableServices={services
                                .filter(s => s.id !== service.id)
                                .map(s => s.name)
                                .filter(name => name.trim() !== "")
                              }
                            />
                          </CardBody>
                        )}
                      </Card>
                    ))}
                  </div>
                )}
                
                {/* Add Service Button */}
                <div className="flex justify-center pt-4 border-t border-default-200 mt-6">
                  <Button
                    color="primary"
                    startContent={<Plus size={16} />}
                    onClick={handleAddService}
                    size="lg"
                  >
                    Add Service
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
