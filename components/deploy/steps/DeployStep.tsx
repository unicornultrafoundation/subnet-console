"use client";

import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Progress } from "@heroui/progress";
import { Chip } from "@heroui/chip";
import { 
  Play, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Terminal,
  Download,
  RefreshCw,
  Server,
  Database,
  Network,
  Shield,
  Zap,
  Globe,
  Activity
} from "lucide-react";

interface DeployStepProps {
  isSubmitting: boolean;
  onDeploy: () => void;
}

type DeploymentStatus = 'idle' | 'preparing' | 'pulling' | 'building' | 'deploying' | 'completed' | 'failed';

interface DeploymentLog {
  timestamp: string;
  level: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

interface DeploymentStep {
  id: string;
  name: string;
  description: string;
  icon: any;
  status: 'pending' | 'active' | 'completed' | 'failed';
  progress: number;
}

export default function DeployStep({
  isSubmitting,
  onDeploy
}: DeployStepProps) {
  const [deploymentStatus, setDeploymentStatus] = useState<DeploymentStatus>('preparing');
  const [deploymentProgress, setDeploymentProgress] = useState(0);
  const [logs, setLogs] = useState<DeploymentLog[]>([]);
  const [deploymentUrl, setDeploymentUrl] = useState<string>('');
  const [isDeploying, setIsDeploying] = useState(true);
  const [deploymentSteps, setDeploymentSteps] = useState<DeploymentStep[]>([
    {
      id: 'preparing',
      name: 'Preparing Environment',
      description: 'Setting up deployment infrastructure',
      icon: Server,
      status: 'pending',
      progress: 0
    },
    {
      id: 'pulling',
      name: 'Pulling Images',
      description: 'Downloading Docker images',
      icon: Download,
      status: 'pending',
      progress: 0
    },
    {
      id: 'building',
      name: 'Building Containers',
      description: 'Creating application containers',
      icon: Database,
      status: 'pending',
      progress: 0
    },
    {
      id: 'deploying',
      name: 'Deploying Application',
      description: 'Launching on provider infrastructure',
      icon: Globe,
      status: 'pending',
      progress: 0
    }
  ]);

  // Auto-start deployment when component mounts
  useEffect(() => {
    simulateDeployment();
  }, []);

  const addLog = (level: DeploymentLog['level'], message: string) => {
    const newLog: DeploymentLog = {
      timestamp: new Date().toLocaleTimeString(),
      level,
      message
    };
    setLogs(prev => [...prev, newLog]);
  };

  const updateStepStatus = (stepId: string, status: DeploymentStep['status'], progress: number) => {
    setDeploymentSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, status, progress }
        : step
    ));
  };

  const simulateDeployment = async () => {
    setIsDeploying(true);
    setDeploymentStatus('preparing');
    setDeploymentProgress(0);
    setLogs([]);
    
    addLog('info', '🚀 Starting deployment process...');
    
    // Step 1: Preparing
    updateStepStatus('preparing', 'active', 0);
    await new Promise(resolve => setTimeout(resolve, 1000));
    updateStepStatus('preparing', 'active', 50);
    addLog('info', '📋 Preparing deployment environment...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    updateStepStatus('preparing', 'completed', 100);
    addLog('success', '✅ Environment prepared successfully');
    setDeploymentProgress(25);
    
    // Step 2: Pulling Images
    updateStepStatus('pulling', 'active', 0);
    setDeploymentStatus('pulling');
    addLog('info', '📦 Pulling Docker images...');
    await new Promise(resolve => setTimeout(resolve, 1500));
    updateStepStatus('pulling', 'active', 60);
    addLog('info', '⬇️ Downloading nginx:latest...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    updateStepStatus('pulling', 'completed', 100);
    addLog('success', '✅ Image nginx:latest pulled successfully');
    setDeploymentProgress(50);
    
    // Step 3: Building
    updateStepStatus('building', 'active', 0);
    setDeploymentStatus('building');
    addLog('info', '🔨 Building application containers...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    updateStepStatus('building', 'active', 70);
    addLog('info', '⚙️ Configuring container settings...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    updateStepStatus('building', 'completed', 100);
    addLog('success', '✅ Container build completed');
    setDeploymentProgress(75);
    
    // Step 4: Deploying
    updateStepStatus('deploying', 'active', 0);
    setDeploymentStatus('deploying');
    addLog('info', '🌐 Deploying to provider infrastructure...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    updateStepStatus('deploying', 'active', 80);
    addLog('info', '🔗 Establishing network connections...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    updateStepStatus('deploying', 'completed', 100);
    addLog('success', '✅ Application deployed successfully');
    setDeploymentProgress(100);
    
    // Completed
    setDeploymentStatus('completed');
    const appUrl = 'https://your-app.provider.com';
    setDeploymentUrl(appUrl);
    addLog('success', '🎉 Deployment completed successfully!');
    addLog('info', '🌍 Your application is now live and accessible');
    addLog('info', '🔗 Access your app at: ' + appUrl);
    
    setIsDeploying(false);
  };

  const getStatusIcon = () => {
    switch (deploymentStatus) {
      case 'idle':
        return <Play className="text-primary" size={24} />;
      case 'preparing':
      case 'pulling':
      case 'building':
      case 'deploying':
        return <RefreshCw className="text-blue-500 animate-spin" size={24} />;
      case 'completed':
        return <CheckCircle className="text-green-500" size={24} />;
      case 'failed':
        return <AlertCircle className="text-red-500" size={24} />;
      default:
        return <Clock className="text-gray-500" size={24} />;
    }
  };

  const getStatusColor = () => {
    switch (deploymentStatus) {
      case 'completed':
        return 'success';
      case 'failed':
        return 'danger';
      case 'preparing':
      case 'pulling':
      case 'building':
      case 'deploying':
        return 'primary';
      default:
        return 'default';
    }
  };

  const getStatusText = () => {
    switch (deploymentStatus) {
      case 'idle':
        return 'Ready to Deploy';
      case 'preparing':
        return 'Preparing Environment';
      case 'pulling':
        return 'Pulling Images';
      case 'building':
        return 'Building Containers';
      case 'deploying':
        return 'Deploying Application';
      case 'completed':
        return 'Deployment Complete';
      case 'failed':
        return 'Deployment Failed';
      default:
        return 'Unknown Status';
    }
  };

  const getLogIcon = (level: DeploymentLog['level']) => {
    switch (level) {
      case 'success':
        return <CheckCircle className="text-green-500" size={14} />;
      case 'warning':
        return <AlertCircle className="text-yellow-500" size={14} />;
      case 'error':
        return <AlertCircle className="text-red-500" size={14} />;
      default:
        return <Terminal className="text-blue-500" size={14} />;
    }
  };

  const getStepIcon = (step: DeploymentStep) => {
    const IconComponent = step.icon;
    const iconClass = step.status === 'completed' 
      ? 'text-green-500' 
      : step.status === 'active' 
      ? 'text-blue-500 animate-pulse' 
      : 'text-gray-400';
    
    return <IconComponent className={iconClass} size={20} />;
  };

  return (
    <div className="space-y-6">
      {/* Deployment Status Header */}
      <Card className="subnet-card">
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <h2 className="text-2xl font-bold">{getStatusText()}</h2>
              <p className="text-sm text-default-600">
                {deploymentStatus === 'idle' ? 'Configure your deployment and launch your application' :
                 deploymentStatus === 'completed' ? 'Your application is now live and running' :
                 'Deploying your application to the cloud'}
              </p>
            </div>
          </div>
          <Chip color={getStatusColor()} variant="flat" size="lg">
            {deploymentStatus === 'idle' ? 'Ready' : 
             deploymentStatus === 'completed' ? 'Success' :
             deploymentStatus === 'failed' ? 'Failed' : 'In Progress'}
          </Chip>
        </CardHeader>
        <CardBody className="space-y-6">
          {/* Overall Progress */}
          {deploymentStatus !== 'idle' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm font-bold text-primary">{deploymentProgress}%</span>
              </div>
              <Progress 
                value={deploymentProgress} 
                color={deploymentStatus === 'completed' ? 'success' : 'primary'}
                className="w-full h-3"
              />
            </div>
          )}
          
          {/* Deployment Steps */}
          {deploymentStatus !== 'idle' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Deployment Steps</h3>
              <div className="grid gap-4">
                {deploymentSteps.map((step, index) => (
                  <div key={step.id} className="flex items-center gap-4 p-4 rounded-lg bg-white/50">
                    <div className="flex-shrink-0">
                      {getStepIcon(step)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold">{step.name}</h4>
                        <Chip 
                          color={step.status === 'completed' ? 'success' : 
                                 step.status === 'active' ? 'primary' : 'default'}
                          size="sm"
                          variant="flat"
                        >
                          {step.status === 'completed' ? 'Completed' :
                           step.status === 'active' ? 'In Progress' : 'Pending'}
                        </Chip>
                      </div>
                      <p className="text-sm text-default-600 mb-2">{step.description}</p>
                      {step.status === 'active' && (
                        <Progress 
                          value={step.progress} 
                          color="primary"
                          className="w-full h-2"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}

          {deploymentStatus === 'completed' && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-2xl font-semibold mb-2 text-green-600">Deployment Successful!</h3>
              <p className="text-default-600 mb-4 max-w-md mx-auto">
                Your application has been successfully deployed and is now live.
              </p>
              {deploymentUrl && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="text-green-600" size={16} />
                    <span className="text-sm font-medium text-green-800">Your Application URL:</span>
                  </div>
                  <a 
                    href={deploymentUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 font-mono text-sm break-all"
                  >
                    {deploymentUrl}
                  </a>
                </div>
              )}
              <div className="flex gap-4 justify-center">
                <Button
                  color="success"
                  startContent={<Globe size={20} />}
                  onClick={() => {
                    // Open deployment URL in new tab
                    window.open(deploymentUrl, '_blank');
                  }}
                >
                  View Deployment
                </Button>
                <Button
                  color="primary"
                  variant="bordered"
                  startContent={<Download size={20} />}
                >
                  Download Logs
                </Button>
                <Button
                  color="primary"
                  startContent={<RefreshCw size={20} />}
                  onClick={() => {
                    setDeploymentStatus('preparing');
                    setDeploymentProgress(0);
                    setLogs([]);
                    setDeploymentSteps(prev => prev.map(step => ({ ...step, status: 'pending', progress: 0 })));
                    setIsDeploying(true);
                    // Restart deployment
                    setTimeout(() => {
                      simulateDeployment();
                    }, 100);
                  }}
                >
                  Deploy Again
                </Button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Deployment Logs */}
      {logs.length > 0 && (
        <Card className="subnet-card">
          <CardHeader className="flex items-center gap-2">
            <Terminal className="text-primary" size={20} />
            <h2 className="text-xl font-semibold">Deployment Logs</h2>
          </CardHeader>
          <CardBody>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index} className="flex items-start gap-2 mb-1">
                  <span className="text-gray-500 text-xs mt-0.5">[{log.timestamp}]</span>
                  <div className="flex items-center gap-1">
                    {getLogIcon(log.level)}
                  </div>
                  <span className={`
                    ${log.level === 'success' ? 'text-green-400' : 
                      log.level === 'warning' ? 'text-yellow-400' :
                      log.level === 'error' ? 'text-red-400' : 'text-blue-400'}
                  `}>
                    {log.message}
                  </span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
