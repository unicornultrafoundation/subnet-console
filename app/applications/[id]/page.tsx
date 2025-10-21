"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Chip } from "@heroui/chip";
import { Tabs, Tab } from "@heroui/tabs";
import {
  Star,
  Zap,
  BarChart3,
  ArrowLeft,
  Play,
  Copy,
  Download,
  Eye,
  Heart,
  Share2,
  Bot,
  FileText,
  Terminal,
  Settings,
  Cpu,
  HardDrive,
  MemoryStick,
} from "lucide-react";

import { App } from "@/components/marketplace/types";

export default function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [isDeploying, setIsDeploying] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Mock app data - in real app, this would be fetched based on resolvedParams.id
  const app: App = {
    id: resolvedParams.id,
    name: "AI Model Training",
    category: "AI/ML",
    price: 0.45,
    rating: 4.8,
    downloads: 1250,
    provider: "Quantum Computing Solutions",
    description:
      "Advanced AI model training application with GPU acceleration for machine learning workflows. Supports TensorFlow, PyTorch, and custom model architectures.",
    image: "/images/ai-training.jpg",
    tags: [
      "AI",
      "Machine Learning",
      "GPU",
      "TensorFlow",
      "PyTorch",
      "Deep Learning",
    ],
    featured: true,
  };

  // SDL Template (Akash Network style)
  const sdlTemplate = `version: "2.0"

services:
  ai-training:
    image: tensorflow/tensorflow:latest-gpu
    command: |
      python -c "
      import tensorflow as tf
      print('TensorFlow version:', tf.__version__)
      print('GPU available:', tf.config.list_physical_devices('GPU'))
      
      # Your AI training code here
      import numpy as np
      from tensorflow import keras
      
      # Example: Simple neural network
      model = keras.Sequential([
          keras.layers.Dense(128, activation='relu', input_shape=(784,)),
          keras.layers.Dropout(0.2),
          keras.layers.Dense(10, activation='softmax')
      ])
      
      model.compile(optimizer='adam',
                    loss='sparse_categorical_crossentropy',
                    metrics=['accuracy'])
      
      print('Model compiled successfully!')
      print('Ready for training...')
      "
    env:
      - CUDA_VISIBLE_DEVICES=0
      - TF_FORCE_GPU_ALLOW_GROWTH=true
    resources:
      cpu:
        units: 4
      memory:
        size: 8Gi
      storage:
        size: 50Gi
      gpu:
        units: 1
        attributes:
          vendor:
            - nvidia
          model:
            - rtx4090
    expose:
      - port: 8080
        as: 80
        to:
          - global: true
      - port: 8888
        as: 8888
        to:
          - global: true

profiles:
  compute:
    ai-training:
      resources:
        cpu:
          units: 4
        memory:
          size: 8Gi
        storage:
          size: 50Gi
        gpu:
          units: 1
          attributes:
            vendor:
              - nvidia
            model:
              - rtx4090

  placement:
    westcoast:
      attributes:
        region:
          - us-west
        provider:
          - quantum-computing-solutions
      pricing:
        ai-training:
          denom: scu
          amount: 450000

deployment:
  ai-training:
    westcoast:
      profile: ai-training
      count: 1`;

  const handleDeploy = async () => {
    setIsDeploying(true);
    // Redirect to deployment configuration page
    router.push(`/deploy?appId=${resolvedParams.id}`);
  };

  const handleCopySDL = async () => {
    try {
      await navigator.clipboard.writeText(sdlTemplate);
      alert("SDL template copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
      alert("Failed to copy template. Please try again.");
    }
  };

  const handleDownloadSDL = () => {
    const blob = new Blob([sdlTemplate], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `${app.name.toLowerCase().replace(/\s+/g, "-")}-sdl.yaml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50">
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 py-16">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-6 relative">
          <div className="mb-8">
            <Button
              as={Link}
              className="text-default-600 hover:text-primary"
              href="/applications"
              startContent={<ArrowLeft size={16} />}
              variant="light"
            >
              Back to Applications
            </Button>
          </div>

          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <Bot className="text-primary" size={32} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-dark-on-white">
                  {app.name}
                </h1>
                {app.featured && (
                  <Chip
                    color="warning"
                    size="lg"
                    startContent={<Star size={16} />}
                    variant="flat"
                  >
                    Featured
                  </Chip>
                )}
              </div>
              <div className="flex items-center gap-1 text-lg text-dark-on-white-muted mb-3">
                <span>{app.category}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Star className="text-warning" size={16} />
                  <span>{app.rating}/5</span>
                </div>
                <span>•</span>
                <span>{app.downloads} downloads</span>
              </div>
              <p className="text-lg text-dark-on-white-muted">
                {app.description}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">
                ${app.price}/hr
              </div>
              <div className="text-sm text-default-600">Starting price</div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center p-6 rounded-xl bg-primary/5">
              <div className="text-4xl font-bold text-primary">4</div>
              <div className="text-sm text-default-600">CPU Cores</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-secondary/5">
              <div className="text-4xl font-bold text-secondary">8GB</div>
              <div className="text-sm text-default-600">Memory</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-warning-100">
              <div className="text-4xl font-bold text-warning-600">50GB</div>
              <div className="text-sm text-default-600">Storage</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-danger-100">
              <div className="text-4xl font-bold text-danger-600">1</div>
              <div className="text-sm text-default-600">GPU Unit</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Tabs */}
              <Card className="subnet-card">
                <CardBody className="p-0">
                  <Tabs
                    aria-label="Application details"
                    className="w-full"
                    selectedKey={activeTab}
                    onSelectionChange={(key) => setActiveTab(key as string)}
                  >
                    <Tab
                      key="overview"
                      title={
                        <div className="flex items-center gap-2">
                          <Eye size={16} />
                          <span>Overview</span>
                        </div>
                      }
                    >
                      <div className="p-6">
                        <div className="space-y-6">
                          {/* Description */}
                          <div>
                            <h3 className="text-xl font-bold mb-3">
                              Description
                            </h3>
                            <p className="text-default-600 leading-relaxed">
                              {app.description}
                            </p>
                          </div>

                          {/* Features */}
                          <div>
                            <h3 className="text-xl font-bold mb-3">
                              Key Features
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5">
                                <Cpu className="text-primary" size={20} />
                                <span>GPU-accelerated training</span>
                              </div>
                              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/5">
                                <MemoryStick
                                  className="text-secondary"
                                  size={20}
                                />
                                <span>TensorFlow & PyTorch support</span>
                              </div>
                              <div className="flex items-center gap-3 p-3 rounded-lg bg-warning-100">
                                <HardDrive
                                  className="text-warning-600"
                                  size={20}
                                />
                                <span>Persistent storage</span>
                              </div>
                              <div className="flex items-center gap-3 p-3 rounded-lg bg-danger-100">
                                <Settings
                                  className="text-danger-600"
                                  size={20}
                                />
                                <span>Custom model architectures</span>
                              </div>
                            </div>
                          </div>

                          {/* Tags */}
                          <div>
                            <h3 className="text-xl font-bold mb-3">
                              Technologies
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {app.tags.map((tag, index) => (
                                <Chip
                                  key={index}
                                  color="primary"
                                  size="lg"
                                  variant="flat"
                                >
                                  {tag}
                                </Chip>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Tab>

                    <Tab
                      key="sdl"
                      title={
                        <div className="flex items-center gap-2">
                          <FileText size={16} />
                          <span>SDL Template</span>
                        </div>
                      }
                    >
                      <div className="p-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="text-xl font-bold mb-2">
                                Subnet SDL Template
                              </h3>
                              <p className="text-sm text-default-600">
                                Copy or download this SDL template to deploy the
                                application on Subnet Network
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                startContent={<Copy size={14} />}
                                variant="bordered"
                                onClick={handleCopySDL}
                              >
                                Copy
                              </Button>
                              <Button
                                color="primary"
                                size="sm"
                                startContent={<Download size={14} />}
                                onClick={handleDownloadSDL}
                              >
                                Download
                              </Button>
                            </div>
                          </div>

                          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                            <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                              {sdlTemplate}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </Tab>

                    <Tab
                      key="deployment"
                      title={
                        <div className="flex items-center gap-2">
                          <Terminal size={16} />
                          <span>Deployment Guide</span>
                        </div>
                      }
                    >
                      <div className="p-6">
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-xl font-bold mb-3">
                              Quick Start Guide
                            </h3>
                            <div className="space-y-4">
                              <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                                  1
                                </div>
                                <div>
                                  <h4 className="font-semibold">
                                    Install Subnet Overlay Network
                                  </h4>
                                  <p className="text-sm text-default-600">
                                    Install the Subnet overlay network client on
                                    your machine
                                  </p>
                                  <code className="text-xs bg-gray-100 p-1 rounded">
                                    npm install -g @subnet/cli
                                  </code>
                                </div>
                              </div>
                              <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                                  2
                                </div>
                                <div>
                                  <h4 className="font-semibold">
                                    Connect to Network
                                  </h4>
                                  <p className="text-sm text-default-600">
                                    Connect your wallet to the Subnet overlay
                                    network
                                  </p>
                                  <code className="text-xs bg-gray-100 p-1 rounded">
                                    subnet connect --wallet
                                  </code>
                                </div>
                              </div>
                              <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                                  3
                                </div>
                                <div>
                                  <h4 className="font-semibold">
                                    Deploy Application
                                  </h4>
                                  <p className="text-sm text-default-600">
                                    Simply click the Deploy button below to
                                    start your application
                                  </p>
                                  <div className="mt-2">
                                    <Button
                                      color="primary"
                                      size="sm"
                                      startContent={<Play size={14} />}
                                      onClick={handleDeploy}
                                    >
                                      Deploy Now
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-xl font-bold mb-3">
                              Resource Requirements
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-4 rounded-lg border border-default-200">
                                <div className="flex items-center gap-2 mb-2">
                                  <Cpu className="text-primary" size={16} />
                                  <span className="font-semibold">CPU</span>
                                </div>
                                <div className="text-2xl font-bold text-primary">
                                  4 cores
                                </div>
                                <div className="text-xs text-default-600">
                                  Recommended for training
                                </div>
                              </div>
                              <div className="p-4 rounded-lg border border-default-200">
                                <div className="flex items-center gap-2 mb-2">
                                  <MemoryStick
                                    className="text-secondary"
                                    size={16}
                                  />
                                  <span className="font-semibold">Memory</span>
                                </div>
                                <div className="text-2xl font-bold text-secondary">
                                  8GB RAM
                                </div>
                                <div className="text-xs text-default-600">
                                  Minimum requirement
                                </div>
                              </div>
                              <div className="p-4 rounded-lg border border-default-200">
                                <div className="flex items-center gap-2 mb-2">
                                  <HardDrive
                                    className="text-warning"
                                    size={16}
                                  />
                                  <span className="font-semibold">Storage</span>
                                </div>
                                <div className="text-2xl font-bold text-warning">
                                  50GB
                                </div>
                                <div className="text-xs text-default-600">
                                  For datasets & models
                                </div>
                              </div>
                              <div className="p-4 rounded-lg border border-default-200">
                                <div className="flex items-center gap-2 mb-2">
                                  <Zap className="text-danger" size={16} />
                                  <span className="font-semibold">GPU</span>
                                </div>
                                <div className="text-2xl font-bold text-danger">
                                  1 RTX 4090
                                </div>
                                <div className="text-xs text-default-600">
                                  For acceleration
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Tab>
                  </Tabs>
                </CardBody>
              </Card>
            </div>

            {/* Right Column - Actions */}
            <div className="space-y-6">
              {/* Deploy Card */}
              <Card className="subnet-card">
                <CardHeader>
                  <h3 className="text-xl font-bold">Deploy Now</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      ${app.price}/hr
                    </div>
                    <div className="text-sm text-default-600">
                      Starting price
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    color="primary"
                    isLoading={isDeploying}
                    size="lg"
                    startContent={!isDeploying ? <Play size={20} /> : undefined}
                    onClick={handleDeploy}
                  >
                    {isDeploying ? "Deploying..." : "Deploy Application"}
                  </Button>

                  <div className="text-xs text-default-500 text-center">
                    Deploy this AI training environment on Subnet Network
                  </div>
                </CardBody>
              </Card>

              {/* App Info */}
              <Card className="subnet-card">
                <CardHeader>
                  <h3 className="text-xl font-bold">Application Info</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-default-600">Category</span>
                    <span className="font-semibold">{app.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-default-600">Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="text-warning" size={14} />
                      <span className="font-semibold">{app.rating}/5</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-default-600">Downloads</span>
                    <span className="font-semibold">{app.downloads}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-default-600">Provider</span>
                    <span className="font-semibold">{app.provider}</span>
                  </div>
                </CardBody>
              </Card>

              {/* Actions */}
              <Card className="subnet-card">
                <CardHeader>
                  <h3 className="text-xl font-bold">Actions</h3>
                </CardHeader>
                <CardBody className="space-y-3">
                  <Button
                    className="w-full"
                    startContent={<Heart size={16} />}
                    variant="bordered"
                  >
                    Add to Favorites
                  </Button>
                  <Button
                    className="w-full"
                    startContent={<Share2 size={16} />}
                    variant="bordered"
                  >
                    Share Application
                  </Button>
                  <Button
                    className="w-full"
                    startContent={<BarChart3 size={16} />}
                    variant="bordered"
                  >
                    View Analytics
                  </Button>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
