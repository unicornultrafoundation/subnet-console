"use client";

import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { Tabs, Tab } from "@heroui/tabs";
import { Search, Heart, Star, Server, Code, ExternalLink } from "lucide-react";

interface ApplicationSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectApplication: (application: any) => void;
  currentApplication?: any;
}

export default function ApplicationSelectionModal({ 
  isOpen, 
  onClose, 
  onSelectApplication, 
  currentApplication 
}: ApplicationSelectionModalProps) {
  console.log('ApplicationSelectionModal render:', { isOpen, currentApplication });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [favoriteApplications, setFavoriteApplications] = useState<any[]>([]);
  const [marketApplications, setMarketApplications] = useState<any[]>([]);
  const [filteredMarketApps, setFilteredMarketApps] = useState<any[]>([]);

  // Load applications on mount
  useEffect(() => {
    if (isOpen) {
      // Load my applications
      const savedApps = JSON.parse(localStorage.getItem('applications') || '[]');
      setMyApplications(savedApps);

      // Load favorite applications
      const favorites = JSON.parse(localStorage.getItem('favoriteApplications') || '[]');
      setFavoriteApplications(favorites);

      // Mock market applications
      const marketApps = [
        {
          id: "market-web-app-1",
          name: "React Web App",
          description: "Modern React application with Node.js backend",
          category: "Web",
          image: "nginx:latest",
          resources: { cpu: "1", memory: "1Gi", storage: "10Gi" },
          tags: ["react", "nodejs", "web"],
          author: "Subnet Community",
          downloads: 1250,
          rating: 4.8,
          price: "Free"
        },
        {
          id: "market-api-service-1",
          name: "REST API Template",
          description: "Express.js REST API with MongoDB",
          category: "API",
          image: "node:18-alpine",
          resources: { cpu: "0.5", memory: "512Mi", storage: "5Gi" },
          tags: ["express", "mongodb", "api"],
          author: "Dev Team",
          downloads: 890,
          rating: 4.6,
          price: "Free"
        },
        {
          id: "market-ml-training-1",
          name: "ML Training Job",
          description: "PyTorch training job with GPU support",
          category: "AI/ML",
          image: "pytorch/pytorch:latest",
          resources: { cpu: "4", memory: "8Gi", storage: "50Gi" },
          tags: ["pytorch", "gpu", "ml"],
          author: "AI Labs",
          downloads: 567,
          rating: 4.9,
          price: "Premium"
        },
        {
          id: "market-database-1",
          name: "PostgreSQL Database",
          description: "High-performance PostgreSQL database",
          category: "Database",
          image: "postgres:15",
          resources: { cpu: "2", memory: "4Gi", storage: "100Gi" },
          tags: ["postgresql", "database", "sql"],
          author: "DB Experts",
          downloads: 2100,
          rating: 4.7,
          price: "Free"
        }
      ];
      setMarketApplications(marketApps);
      setFilteredMarketApps(marketApps);
    }
  }, [isOpen]);

  // Filter market applications based on search
  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = marketApplications.filter(app =>
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredMarketApps(filtered);
    } else {
      setFilteredMarketApps(marketApplications);
    }
  }, [searchTerm, marketApplications]);

  const handleSelectApplication = (application: any) => {
    onSelectApplication(application);
    onClose();
  };

  const toggleFavorite = (appId: string) => {
    const favorites = JSON.parse(localStorage.getItem('favoriteApplications') || '[]');
    const isFavorite = favorites.some((fav: any) => fav.id === appId);
    
    if (isFavorite) {
      const newFavorites = favorites.filter((fav: any) => fav.id !== appId);
      setFavoriteApplications(newFavorites);
      localStorage.setItem('favoriteApplications', JSON.stringify(newFavorites));
    } else {
      const app = [...myApplications, ...marketApplications].find(a => a.id === appId);
      if (app) {
        const newFavorites = [...favorites, app];
        setFavoriteApplications(newFavorites);
        localStorage.setItem('favoriteApplications', JSON.stringify(newFavorites));
      }
    }
  };

  const renderApplicationCard = (app: any, showFavoriteButton = true) => {
    const isFavorite = favoriteApplications.some((fav: any) => fav.id === app.id);
    const isCurrentApp = currentApplication?.id === app.id;

    return (
      <div
        key={app.id}
        className="cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('Card wrapper clicked for app:', app);
          handleSelectApplication(app);
        }}
      >
        <Card 
          className={`transition-all hover:shadow-lg ${
            isCurrentApp ? 'ring-2 ring-primary' : 'hover:border-primary/50'
          }`}
        >
        <CardHeader className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Chip size="sm" color="primary" variant="flat">
                {app.category || 'Custom'}
              </Chip>
              {isCurrentApp && (
                <Chip size="sm" color="success" variant="flat">
                  Current
                </Chip>
              )}
            </div>
            <h3 className="font-semibold text-default-900 mb-1">{app.name}</h3>
            <p className="text-sm text-default-600 mb-2">{app.description}</p>
            <div className="flex items-center gap-4 text-xs text-default-500">
              <span className="flex items-center gap-1">
                <Server size={12} />
                {app.services?.length || 1} service{(app.services?.length || 1) !== 1 ? 's' : ''}
              </span>
              {app.tags && app.tags.length > 0 && (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  {app.tags.slice(0, 2).join(', ')}
                </span>
              )}
              {app.downloads && (
                <span className="flex items-center gap-1">
                  <ExternalLink size={12} />
                  {app.downloads} downloads
                </span>
              )}
            </div>
          </div>
          {showFavoriteButton && (
            <Button
              isIconOnly
              size="sm"
              variant="light"
              color={isFavorite ? "danger" : "default"}
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(app.id);
              }}
            >
              <Heart size={14} fill={isFavorite ? "currentColor" : "none"} />
            </Button>
          )}
        </CardHeader>
      </Card>
      </div>
    );
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()} size="5xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex items-center gap-2">
          <Code className="text-primary" size={20} />
          <span>Select Application</span>
        </ModalHeader>
        <ModalBody>
          <Tabs aria-label="Application selection tabs" className="w-full">
            <Tab key="my-apps" title="My Applications">
              <div className="space-y-4">
                {myApplications.length === 0 ? (
                  <div className="text-center py-12 text-default-500">
                    <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 mb-6">
                      <Code className="mx-auto text-primary mb-4" size={64} />
                      <h3 className="text-2xl font-bold text-primary mb-3">
                        No Applications Built Yet
                      </h3>
                      <p className="text-default-600 mb-6 max-w-md mx-auto">
                        Create your first application using our Application Builder to get started with deployment
                      </p>
                      <Button
                        color="primary"
                        size="lg"
                        startContent={<Code size={20} />}
                        onClick={() => {
                          onClose();
                          window.open('/applications/builder', '_blank');
                        }}
                        className="font-semibold px-8"
                      >
                        Open Application Builder
                      </Button>
                    </div>
                    <div className="text-sm text-default-500">
                      <p>💡 Tip: Use the Application Builder to create and configure your applications</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Application Builder Section */}
                    <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Code className="text-primary" size={24} />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-primary">Application Builder</h3>
                            <p className="text-sm text-default-600">Create new applications or modify existing ones</p>
                          </div>
                        </div>
                        <Button
                          color="primary"
                          variant="bordered"
                          startContent={<Code size={16} />}
                          onClick={() => {
                            onClose();
                            window.open('/applications/builder', '_blank');
                          }}
                        >
                          Open Builder
                        </Button>
                      </div>
                    </div>

                    {/* My Applications */}
                    <div>
                      <h4 className="text-lg font-semibold mb-4">My Applications</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {myApplications.map(app => renderApplicationCard(app, false))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Tab>
            
            <Tab key="favorites" title="Favorites">
              <div className="space-y-4">
                {favoriteApplications.length === 0 ? (
                  <div className="text-center py-8 text-default-500">
                    <Heart className="mx-auto text-default-400 mb-4" size={48} />
                    <h3 className="text-lg font-semibold text-default-600 mb-2">
                      No Favorite Applications
                    </h3>
                    <p className="text-default-500">
                      Add applications to your favorites to access them quickly
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {favoriteApplications.map(app => renderApplicationCard(app, true))}
                  </div>
                )}
              </div>
            </Tab>
            
            <Tab key="market" title="Market">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Search applications..."
                    startContent={<Search size={16} />}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                </div>
                
                {filteredMarketApps.length === 0 ? (
                  <div className="text-center py-8 text-default-500">
                    <Search className="mx-auto text-default-400 mb-4" size={48} />
                    <h3 className="text-lg font-semibold text-default-600 mb-2">
                      No Applications Found
                    </h3>
                    <p className="text-default-500">
                      Try adjusting your search criteria
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {filteredMarketApps.map(app => renderApplicationCard(app, true))}
                  </div>
                )}
              </div>
            </Tab>
          </Tabs>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
