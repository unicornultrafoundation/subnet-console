"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { Divider } from "@heroui/divider";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Server,
  Terminal,
  XCircle,
  Download,
  Trash2,
} from "lucide-react";

type DeploymentStatus = "pending" | "running" | "failed" | "completed";

interface ServiceItem {
  name: string;
  image: string;
  status: DeploymentStatus;
  ports?: Array<{
    name?: string;
    container: number;
    host?: number;
    url?: string; // direct URL if available
  }>;
}

interface DeploymentDetail {
  id: string;
  name: string;
  application: string;
  provider: string;
  region: string;
  pricePerHour: string;
  createdAt: string;
  status: DeploymentStatus;
  services: ServiceItem[];
  leaseEndAt: string; // when the current lease expires
  autoRenew: boolean;
  commitment: "hour" | "day" | "week" | "month";
}

const STATUS_META: Record<
  DeploymentStatus,
  {
    label: string;
    color: "default" | "primary" | "success" | "warning" | "danger";
  }
> = {
  pending: { label: "Pending", color: "warning" },
  running: { label: "Running", color: "primary" },
  failed: { label: "Failed", color: "danger" },
  completed: { label: "Completed", color: "success" },
};

export default function DeploymentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const deploymentId = (params?.id as string) || "";

  const [deployment, setDeployment] = useState<DeploymentDetail | null>(null);
  const [activeService, setActiveService] = useState<string>("");
  const [serviceLogs, setServiceLogs] = useState<Record<string, string[]>>({});
  const logIntervals = useRef<Record<string, number>>({});
  const [terminalInput, setTerminalInput] = useState<Record<string, string>>(
    {},
  );
  const [terminalHistory, setTerminalHistory] = useState<
    Record<string, string[]>
  >({});
  const [servicePaneTab, setServicePaneTab] = useState<
    "logs" | "terminal" | "details"
  >("details");
  const [nowTs, setNowTs] = useState<number>(Date.now());

  // Mock load deployment detail
  useEffect(() => {
    const mock: DeploymentDetail = {
      id: deploymentId || "dep-001",
      name: "my-nginx-site",
      application: "Nginx Web Server",
      provider: "Quantum Computing Solutions",
      region: "north-america",
      pricePerHour: "1.2",
      createdAt: "2025-10-18T10:12:00.000Z",
      status: "running",
      services: [
        {
          name: "web",
          image: "nginx:latest",
          status: "running",
          ports: [
            {
              name: "http",
              container: 80,
              host: 30080,
              url: "https://deploy-001.cloudtech.solutions",
            },
          ],
        },
        {
          name: "metrics",
          image: "prom/prometheus:latest",
          status: "running",
          ports: [{ name: "http", container: 9090, host: 30990 }],
        },
      ],
      leaseEndAt: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
      autoRenew: false,
      commitment: "month",
    };

    setDeployment(mock);
    // init logs buffers
    const initialLogs: Record<string, string[]> = {};
    const initialTermIn: Record<string, string> = {};
    const initialTermHist: Record<string, string[]> = {};

    for (const s of mock.services) {
      initialLogs[s.name] = [
        `[${new Date().toLocaleTimeString()}] ${s.name}: service starting...`,
      ];
      initialTermIn[s.name] = "";
      initialTermHist[s.name] = [];
    }
    setServiceLogs(initialLogs);
    setTerminalInput(initialTermIn);
    setTerminalHistory(initialTermHist);
  }, [deploymentId]);

  // Mock live logs per service
  useEffect(() => {
    if (!deployment) return;
    // clear previous intervals
    Object.values(logIntervals.current).forEach((id) =>
      window.clearInterval(id),
    );
    logIntervals.current = {};

    for (const s of deployment.services) {
      const id = window.setInterval(() => {
        setServiceLogs((prev) => {
          const next = { ...prev };
          const arr = next[s.name] ? [...next[s.name]] : [];

          arr.push(
            `[${new Date().toLocaleTimeString()}] ${s.name}: heartbeat ok`,
          );
          if (arr.length > 500) arr.shift();
          next[s.name] = arr;

          return next;
        });
      }, 3000);

      logIntervals.current[s.name] = id;
    }

    return () => {
      Object.values(logIntervals.current).forEach((id) =>
        window.clearInterval(id),
      );
      logIntervals.current = {};
    };
  }, [deployment]);

  // Clock tick for usage/lease countdown
  useEffect(() => {
    const id = window.setInterval(() => setNowTs(Date.now()), 1000);

    return () => window.clearInterval(id);
  }, []);

  const elapsedSeconds = useMemo(() => {
    if (!deployment) return 0;
    const start = new Date(deployment.createdAt).getTime();

    return Math.max(0, Math.floor((nowTs - start) / 1000));
  }, [deployment, nowTs]);

  const remainingSeconds = useMemo(() => {
    if (!deployment) return 0;
    const end = new Date(deployment.leaseEndAt).getTime();

    return Math.max(0, Math.floor((end - nowTs) / 1000));
  }, [deployment, nowTs]);

  const formatHMS = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((totalSeconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(totalSeconds % 60)
      .toString()
      .padStart(2, "0");

    return `${h}:${m}:${s}`;
  };

  const estimateCostSCU = useMemo(() => {
    if (!deployment) return "0.00";
    const perHour = parseFloat(deployment.pricePerHour);
    const hours = elapsedSeconds / 3600;

    return (perHour * hours).toFixed(2);
  }, [deployment, elapsedSeconds]);

  const getCommitmentMs = (unit: "hour" | "day" | "week" | "month") => {
    switch (unit) {
      case "hour":
        return 3600 * 1000;
      case "day":
        return 24 * 3600 * 1000;
      case "week":
        return 7 * 24 * 3600 * 1000;
      case "month":
        return 30 * 24 * 3600 * 1000; // simplified month
      default:
        return 24 * 3600 * 1000;
    }
  };

  const getCommitmentLabel = (unit: "hour" | "day" | "week" | "month") => {
    switch (unit) {
      case "hour":
        return "+1 hour";
      case "day":
        return "+1 day";
      case "week":
        return "+1 week";
      case "month":
        return "+1 month";
      default:
        return "+1 term";
    }
  };

  const handleRenew = () => {
    setDeployment((prev) => {
      if (!prev) return prev;
      const currentEnd = new Date(prev.leaseEndAt).getTime();
      const extended = new Date(
        Math.max(currentEnd, Date.now()) + getCommitmentMs(prev.commitment),
      ).toISOString();

      return { ...prev, leaseEndAt: extended };
    });
  };

  const toggleAutoRenew = () => {
    setDeployment((prev) =>
      prev ? { ...prev, autoRenew: !prev.autoRenew } : prev,
    );
  };

  // No filters needed when service count is small

  const handleDownloadLogs = (serviceName: string) => {
    const content = (serviceLogs[serviceName] || []).join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `${deployment?.name || "deployment"}-${serviceName}-logs.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleClearLogs = (serviceName: string) => {
    setServiceLogs((prev) => ({ ...prev, [serviceName]: [] }));
  };

  const handleSendCommand = (serviceName: string) => {
    const cmd = (terminalInput[serviceName] || "").trim();

    if (!cmd) return;
    setTerminalHistory((prev) => ({
      ...prev,
      [serviceName]: [
        ...(prev[serviceName] || []),
        `$ ${cmd}`,
        `response: ok (${serviceName})`,
      ],
    }));
    setTerminalInput((prev) => ({ ...prev, [serviceName]: "" }));
  };

  if (!deployment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background/50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-default-600">Loading deployment...</div>
        </div>
      </div>
    );
  }

  // filteredServices is computed above to keep hooks order stable

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/70">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl border border-default-200 bg-gradient-to-r from-primary/10 via-background to-background p-5 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                isIconOnly
                className="text-default-500 hover:text-primary"
                variant="light"
                onClick={() => router.back()}
              >
                <ArrowLeft size={18} />
              </Button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-semibold tracking-tight">
                    {deployment.name}
                  </h1>
                  <Chip
                    color={STATUS_META[deployment.status].color}
                    size="sm"
                    variant="flat"
                  >
                    {STATUS_META[deployment.status].label}
                  </Chip>
                </div>
                <div className="flex items-center gap-2 text-sm text-default-600 mt-1">
                  <span>{deployment.application}</span>
                  <span>•</span>
                  <span>{deployment.provider}</span>
                  <span>•</span>
                  <span className="capitalize">
                    {deployment.region.replace("-", " ")}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="bordered">Redeploy</Button>
              {deployment.status === "running" && (
                <Button color="danger" variant="flat">
                  Stop
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left/Right: Portainer-like layout */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Sidebar services list */}
              <div className="md:col-span-4">
                <Card className="subnet-card h-full rounded-2xl border border-default-200">
                  <CardHeader className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Server className="text-primary" size={18} />
                      <h2 className="text-lg font-semibold tracking-tight">
                        Services
                      </h2>
                    </div>
                  </CardHeader>
                  <CardBody className="space-y-3">
                    <div className="text-xs text-default-500">
                      Chọn một service để xem chi tiết
                    </div>
                    <div className="space-y-2">
                      {deployment.services.map((s) => (
                        <div
                          key={s.name}
                          className={`rounded-xl border p-3 cursor-pointer transition-colors ${activeService === s.name ? "border-primary bg-primary/5 shadow-sm" : "border-default-200 hover:bg-default-100"}`}
                          role="button"
                          tabIndex={0}
                          onClick={() => setActiveService(s.name)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setActiveService(s.name);
                            }
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-medium capitalize tracking-tight">
                                {s.name}
                              </span>
                              <Chip
                                color={STATUS_META[s.status].color}
                                size="sm"
                                variant="flat"
                              >
                                {STATUS_META[s.status].label}
                              </Chip>
                            </div>
                            <span className="text-[11px] text-default-500 max-w-[45%] truncate whitespace-nowrap overflow-hidden text-right">
                              {s.image}
                            </span>
                          </div>
                          <div className="text-[11px] text-default-500 mt-1">
                            Image:{" "}
                            <span className="truncate inline-block max-w-full align-bottom">
                              {s.image}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* Main panel */}
              <div className="md:col-span-8">
                <Card className="subnet-card h-full rounded-2xl border border-default-200">
                  <CardHeader className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Terminal className="text-default-600" size={16} />
                      <span className="font-medium tracking-tight">
                        Service Panel
                      </span>
                      {activeService && (
                        <Chip color="primary" size="sm" variant="flat">
                          {activeService}
                        </Chip>
                      )}
                    </div>
                    <div className="flex items-center gap-1 bg-default-100 rounded-lg p-1">
                      <Button
                        size="sm"
                        variant={servicePaneTab === "logs" ? "solid" : "light"}
                        onClick={() => setServicePaneTab("logs")}
                      >
                        Logs
                      </Button>
                      <Button
                        size="sm"
                        variant={
                          servicePaneTab === "terminal" ? "solid" : "light"
                        }
                        onClick={() => setServicePaneTab("terminal")}
                      >
                        Console
                      </Button>
                      <Button
                        size="sm"
                        variant={
                          servicePaneTab === "details" ? "solid" : "light"
                        }
                        onClick={() => setServicePaneTab("details")}
                      >
                        Details
                      </Button>
                    </div>
                  </CardHeader>
                  <CardBody className="p-5">
                    {!activeService ? (
                      <div className="text-default-500 text-sm">
                        Hãy chọn một service ở bên trái.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {servicePaneTab === "logs" && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium tracking-tight">
                                Logs
                              </span>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  startContent={<Download size={14} />}
                                  variant="bordered"
                                  onClick={() =>
                                    handleDownloadLogs(activeService)
                                  }
                                >
                                  Download
                                </Button>
                                <Button
                                  size="sm"
                                  startContent={<Trash2 size={14} />}
                                  variant="light"
                                  onClick={() => handleClearLogs(activeService)}
                                >
                                  Clear
                                </Button>
                              </div>
                            </div>
                            <div className="h-72 overflow-y-auto font-mono text-xs bg-black/95 text-green-400 p-3 rounded-xl">
                              {(serviceLogs[activeService] || []).map(
                                (line, idx) => (
                                  <div key={idx}>{line}</div>
                                ),
                              )}
                            </div>
                          </div>
                        )}

                        {servicePaneTab === "terminal" && (
                          <div className="space-y-3">
                            <div className="h-60 overflow-y-auto font-mono text-xs bg-default-100 p-3 rounded-xl">
                              {(terminalHistory[activeService] || []).map(
                                (line, idx) => (
                                  <div key={idx}>{line}</div>
                                ),
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Input
                                placeholder={`Enter command for ${activeService}...`}
                                value={terminalInput[activeService] || ""}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleSendCommand(activeService);
                                  }
                                }}
                                onValueChange={(v) =>
                                  setTerminalInput((prev) => ({
                                    ...prev,
                                    [activeService]: v,
                                  }))
                                }
                              />
                              <Button
                                color="primary"
                                onClick={() => handleSendCommand(activeService)}
                              >
                                Send
                              </Button>
                            </div>
                          </div>
                        )}

                        {servicePaneTab === "details" && (
                          <div className="text-sm text-default-600">
                            {deployment.services
                              .filter((s) => s.name === activeService)
                              .map((s) => (
                                <div key={s.name} className="space-y-3">
                                  <div>
                                    <span className="text-default-500">
                                      Name:
                                    </span>{" "}
                                    <span className="font-medium tracking-tight">
                                      {s.name}
                                    </span>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <span className="text-default-500">
                                      Image:
                                    </span>
                                    <span className="font-medium tracking-tight break-all">
                                      {s.image}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-default-500">
                                      Status:
                                    </span>
                                    <Chip
                                      className="ml-2"
                                      color={STATUS_META[s.status].color}
                                      size="sm"
                                      variant="flat"
                                    >
                                      {STATUS_META[s.status].label}
                                    </Chip>
                                  </div>
                                  {s.ports && s.ports.length > 0 && (
                                    <div>
                                      <div className="text-default-500 mb-1">
                                        Endpoints
                                      </div>
                                      <div className="space-y-2">
                                        {s.ports.map((p, idx) => (
                                          <div
                                            key={idx}
                                            className="flex items-center justify-between p-2 rounded-md border border-default-200"
                                          >
                                            <div className="text-xs">
                                              <div className="font-medium">
                                                {p.name || "port"}
                                              </div>
                                              <div className="text-default-500">
                                                container: {p.container}
                                                {p.host
                                                  ? ` • host: ${p.host}`
                                                  : ""}
                                              </div>
                                              {p.url && (
                                                <div className="text-default-500 break-all">
                                                  {p.url}
                                                </div>
                                              )}
                                            </div>
                                            {(p.url || p.host) && (
                                              <Button
                                                color="primary"
                                                size="sm"
                                                variant="bordered"
                                                onClick={() => {
                                                  const target =
                                                    p.url ||
                                                    `${window.location.protocol}//${window.location.hostname}:${p.host}`;

                                                  window.open(target, "_blank");
                                                }}
                                              >
                                                Open
                                              </Button>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    )}
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="space-y-6">
            <Card className="subnet-card">
              <CardHeader>
                <h3 className="font-semibold">Deployment Summary</h3>
              </CardHeader>
              <CardBody className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  {deployment.status === "running" && (
                    <Server className="text-primary" size={16} />
                  )}
                  {deployment.status === "pending" && (
                    <Clock className="text-warning" size={16} />
                  )}
                  {deployment.status === "failed" && (
                    <XCircle className="text-danger" size={16} />
                  )}
                  {deployment.status === "completed" && (
                    <CheckCircle className="text-success" size={16} />
                  )}
                  <span className="font-medium">{deployment.name}</span>
                  <Chip
                    color={STATUS_META[deployment.status].color}
                    size="sm"
                    variant="flat"
                  >
                    {STATUS_META[deployment.status].label}
                  </Chip>
                </div>
                <Divider />
                <div>
                  <div>
                    <span className="text-default-600">Application:</span>{" "}
                    {deployment.application}
                  </div>
                  <div>
                    <span className="text-default-600">Provider:</span>{" "}
                    {deployment.provider}
                  </div>
                  <div>
                    <span className="text-default-600">Region:</span>{" "}
                    {deployment.region}
                  </div>
                  <div>
                    <span className="text-default-600">Price:</span>{" "}
                    {deployment.pricePerHour} SCU/hour
                  </div>
                  <div className="text-default-500">
                    Started {new Date(deployment.createdAt).toLocaleString()}
                  </div>
                </div>
                <Divider />
                <div>
                  <div className="text-default-600 mb-1">Services</div>
                  <div className="flex flex-wrap gap-2">
                    {deployment.services.map((s) => (
                      <Chip
                        key={s.name}
                        color={STATUS_META[s.status].color}
                        variant="flat"
                      >
                        {s.name}
                      </Chip>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Usage & Billing */}
            <Card className="subnet-card">
              <CardHeader>
                <h3 className="font-semibold">Usage & Billing</h3>
              </CardHeader>
              <CardBody className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-default-600">Uptime:</span>{" "}
                  <span className="font-medium">
                    {formatHMS(elapsedSeconds)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-default-600">Rate:</span>{" "}
                  <span className="font-medium">
                    {deployment.pricePerHour} SCU/hour
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-default-600">Estimated Cost:</span>{" "}
                  <span className="font-semibold text-primary">
                    {estimateCostSCU} SCU
                  </span>
                </div>
              </CardBody>
            </Card>

            {/* Lease Management */}
            <Card className="subnet-card">
              <CardHeader>
                <h3 className="font-semibold">Lease Management</h3>
              </CardHeader>
              <CardBody className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-default-600">Expires In:</span>{" "}
                  <span className="font-medium">
                    {formatHMS(remainingSeconds)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-default-600">Expiry Time:</span>{" "}
                  <span className="font-medium">
                    {new Date(deployment.leaseEndAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-default-600">Commitment:</span>{" "}
                  <span className="font-medium capitalize">
                    {deployment.commitment}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-default-600">Auto-Renew</span>
                  <Button
                    color={deployment.autoRenew ? "success" : "default"}
                    size="sm"
                    variant={deployment.autoRenew ? "solid" : "bordered"}
                    onClick={toggleAutoRenew}
                  >
                    {deployment.autoRenew ? "Enabled" : "Disabled"}
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button color="primary" size="sm" onClick={handleRenew}>
                    Renew {getCommitmentLabel(deployment.commitment)}
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
