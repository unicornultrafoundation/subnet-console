"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { Select, SelectItem } from "@heroui/select";
import {
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ArrowLeft,
  FileText,
  Eye,
  TrendingUp,
  Award,
  Star,
  Search,
} from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Progress } from "@heroui/progress";

interface VerificationRequest {
  id: string;
  verifierId: string;
  verifierName: string;
  verifierWallet: string;
  type: "initial" | "periodic" | "complaint" | "maintenance";
  status: "pending" | "in-progress" | "approved" | "rejected" | "completed";
  priority: "low" | "medium" | "high" | "urgent";
  submittedAt: string;
  startedAt?: string;
  completedAt?: string;
  scheduledDate?: string;
  report?: {
    score: number;
    findings: Array<{
      category: string;
      status: "pass" | "fail" | "warning";
      description: string;
    }>;
    notes?: string;
  };
  response?: string;
}

interface VerificationStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  averageScore: number;
  reputationScore: number;
}

export default function ProviderVerificationPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] =
    useState<VerificationRequest | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isResponseOpen, setIsResponseOpen] = useState(false);
  const [responseText, setResponseText] = useState("");

  // Mock verification requests
  const [requests, setRequests] = useState<VerificationRequest[]>([
    {
      id: "verif-1",
      verifierId: "verifier-1",
      verifierName: "Subnet Foundation",
      verifierWallet: "0x7a3f...9c2e",
      type: "periodic",
      status: "in-progress",
      priority: "medium",
      submittedAt: "2024-01-18T10:00:00Z",
      startedAt: "2024-01-18T10:30:00Z",
      scheduledDate: "2024-01-20T14:00:00Z",
    },
    {
      id: "verif-2",
      verifierId: "verifier-2",
      verifierName: "Independent Verifier Network",
      verifierWallet: "0x8b4e...1d3f",
      type: "initial",
      status: "approved",
      priority: "high",
      submittedAt: "2024-01-10T08:00:00Z",
      startedAt: "2024-01-10T09:00:00Z",
      completedAt: "2024-01-12T16:00:00Z",
      report: {
        score: 95,
        findings: [
          {
            category: "Infrastructure",
            status: "pass",
            description: "All nodes operational",
          },
          {
            category: "Security",
            status: "pass",
            description: "Security measures in place",
          },
          {
            category: "Performance",
            status: "pass",
            description: "Meets SLA requirements",
          },
          {
            category: "Compliance",
            status: "warning",
            description: "Minor documentation gaps",
          },
        ],
        notes:
          "Excellent provider with strong infrastructure. Minor documentation improvements recommended.",
      },
    },
    {
      id: "verif-3",
      verifierId: "verifier-3",
      verifierName: "Community Verifier",
      verifierWallet: "0x9c5f...2e4a",
      type: "complaint",
      status: "pending",
      priority: "urgent",
      submittedAt: "2024-01-20T15:30:00Z",
    },
  ]);

  // Calculate statistics
  const stats: VerificationStats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    inProgress: requests.filter((r) => r.status === "in-progress").length,
    completed: requests.filter(
      (r) => r.status === "approved" || r.status === "completed",
    ).length,
    averageScore:
      requests.filter((r) => r.report).length > 0
        ? requests
            .filter((r) => r.report)
            .reduce((sum, r) => sum + (r.report?.score || 0), 0) /
          requests.filter((r) => r.report).length
        : 0,
    reputationScore: 96, // Mock reputation score
  };

  // Filter requests
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.verifierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.verifierWallet
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      request.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;
    const matchesType = typeFilter === "all" || request.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleViewDetails = (request: VerificationRequest) => {
    setSelectedRequest(request);
    setIsDetailOpen(true);
  };

  const handleRespond = (request: VerificationRequest) => {
    setSelectedRequest(request);
    setResponseText("");
    setIsResponseOpen(true);
  };

  const handleSubmitResponse = () => {
    if (!selectedRequest) return;

    setRequests((prev) =>
      prev.map((req) =>
        req.id === selectedRequest.id
          ? { ...req, response: responseText, status: "completed" as const }
          : req,
      ),
    );

    setIsResponseOpen(false);
    setSelectedRequest(null);
    setResponseText("");
    alert("Response submitted successfully!");
  };

  const getStatusColor = (status: VerificationRequest["status"]) => {
    switch (status) {
      case "approved":
      case "completed":
        return "success";
      case "rejected":
        return "danger";
      case "in-progress":
        return "warning";
      case "pending":
        return "default";
      default:
        return "default";
    }
  };

  const getTypeLabel = (type: VerificationRequest["type"]) => {
    switch (type) {
      case "initial":
        return "Initial";
      case "periodic":
        return "Periodic";
      case "complaint":
        return "Complaint";
      case "maintenance":
        return "Maintenance";
      default:
        return type;
    }
  };

  const getPriorityColor = (priority: VerificationRequest["priority"]) => {
    switch (priority) {
      case "urgent":
        return "danger";
      case "high":
        return "warning";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4">
            <Button
              className="mb-4"
              startContent={<ArrowLeft size={16} />}
              variant="light"
              onPress={() => router.push("/provider")}
            >
              Back to Dashboard
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <Shield className="text-primary" size={24} />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-dark-on-white">
                  Verification Management
                </h1>
                <p className="text-lg text-dark-on-white-muted">
                  Manage verification requests and reports
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="subnet-card">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-default-600 mb-1">
                    Total Requests
                  </p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <FileText className="text-primary" size={24} />
              </div>
            </CardBody>
          </Card>

          <Card className="subnet-card">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-default-600 mb-1">In Progress</p>
                  <p className="text-2xl font-bold text-warning">
                    {stats.inProgress}
                  </p>
                </div>
                <Clock className="text-warning" size={24} />
              </div>
            </CardBody>
          </Card>

          <Card className="subnet-card">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-default-600 mb-1">Avg. Score</p>
                  <p className="text-2xl font-bold text-success">
                    {stats.averageScore.toFixed(1)}%
                  </p>
                </div>
                <TrendingUp className="text-success" size={24} />
              </div>
            </CardBody>
          </Card>

          <Card className="subnet-card">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-default-600 mb-1">Reputation</p>
                  <div className="flex items-center gap-1">
                    <p className="text-2xl font-bold text-primary">
                      {stats.reputationScore}
                    </p>
                    <Star className="text-warning fill-warning" size={20} />
                  </div>
                </div>
                <Award className="text-primary" size={24} />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Filters */}
        <Card className="subnet-card mb-6">
          <CardBody className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                className="flex-1"
                placeholder="Search by verifier name, wallet, or ID..."
                size="lg"
                startContent={<Search className="text-default-400" size={18} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Select
                className="w-[160px]"
                placeholder="All Status"
                selectedKeys={statusFilter ? [statusFilter] : []}
                size="md"
                onSelectionChange={(keys) =>
                  setStatusFilter(Array.from(keys)[0] as string)
                }
              >
                <SelectItem key="all">All Status</SelectItem>
                <SelectItem key="pending">Pending</SelectItem>
                <SelectItem key="in-progress">In Progress</SelectItem>
                <SelectItem key="approved">Approved</SelectItem>
                <SelectItem key="completed">Completed</SelectItem>
                <SelectItem key="rejected">Rejected</SelectItem>
              </Select>
              <Select
                className="w-[160px]"
                placeholder="All Types"
                selectedKeys={typeFilter ? [typeFilter] : []}
                size="md"
                onSelectionChange={(keys) =>
                  setTypeFilter(Array.from(keys)[0] as string)
                }
              >
                <SelectItem key="all">All Types</SelectItem>
                <SelectItem key="initial">Initial</SelectItem>
                <SelectItem key="periodic">Periodic</SelectItem>
                <SelectItem key="complaint">Complaint</SelectItem>
                <SelectItem key="maintenance">Maintenance</SelectItem>
              </Select>
            </div>
          </CardBody>
        </Card>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <Card key={request.id} className="subnet-card">
              <CardBody className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div>
                        <h3 className="text-lg font-bold">
                          {request.verifierName}
                        </h3>
                        <p className="text-sm text-default-600 font-mono">
                          {request.verifierWallet}
                        </p>
                      </div>
                      <Chip
                        color={getStatusColor(request.status)}
                        size="sm"
                        variant="flat"
                      >
                        {request.status.charAt(0).toUpperCase() +
                          request.status.slice(1).replace("-", " ")}
                      </Chip>
                      <Chip color="default" size="sm" variant="flat">
                        {getTypeLabel(request.type)}
                      </Chip>
                      <Chip
                        color={getPriorityColor(request.priority)}
                        size="sm"
                        variant="flat"
                      >
                        {request.priority}
                      </Chip>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-default-600">Submitted:</span>
                        <p className="font-medium">
                          {new Date(request.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                      {request.startedAt && (
                        <div>
                          <span className="text-default-600">Started:</span>
                          <p className="font-medium">
                            {new Date(request.startedAt).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      {request.completedAt && (
                        <div>
                          <span className="text-default-600">Completed:</span>
                          <p className="font-medium">
                            {new Date(request.completedAt).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      {request.scheduledDate && (
                        <div>
                          <span className="text-default-600">Scheduled:</span>
                          <p className="font-medium">
                            {new Date(
                              request.scheduledDate,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>

                    {request.report && (
                      <div className="mt-4 p-4 bg-default-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold">
                            Verification Score
                          </span>
                          <span className="text-lg font-bold text-success">
                            {request.report.score}%
                          </span>
                        </div>
                        <Progress
                          className="mb-3"
                          color="success"
                          value={request.report.score}
                        />
                        <div className="grid grid-cols-2 gap-2">
                          {request.report.findings.map((finding, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              {finding.status === "pass" ? (
                                <CheckCircle
                                  className="text-success"
                                  size={16}
                                />
                              ) : finding.status === "fail" ? (
                                <XCircle className="text-danger" size={16} />
                              ) : (
                                <AlertCircle
                                  className="text-warning"
                                  size={16}
                                />
                              )}
                              <span className="text-xs">
                                <span className="font-medium">
                                  {finding.category}:
                                </span>{" "}
                                {finding.description}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {request.response && (
                      <div className="mt-4 p-4 bg-info-50 rounded-lg border border-info-200">
                        <span className="text-sm font-semibold text-info-900 mb-2 block">
                          Your Response:
                        </span>
                        <p className="text-sm text-info-700">
                          {request.response}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      size="sm"
                      startContent={<Eye size={14} />}
                      variant="flat"
                      onPress={() => handleViewDetails(request)}
                    >
                      Details
                    </Button>
                    {request.status === "pending" ||
                    request.status === "in-progress" ? (
                      <Button
                        color="primary"
                        size="sm"
                        startContent={<FileText size={14} />}
                        variant="flat"
                        onPress={() => handleRespond(request)}
                      >
                        Respond
                      </Button>
                    ) : null}
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <Card className="subnet-card">
            <CardBody className="p-12 text-center">
              <Shield className="mx-auto mb-4 text-default-300" size={48} />
              <h3 className="text-lg font-semibold mb-2">
                No verification requests found
              </h3>
              <p className="text-default-600">
                {searchQuery || statusFilter !== "all" || typeFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Verification requests will appear here"}
              </p>
            </CardBody>
          </Card>
        )}

        {/* Detail Modal */}
        <Modal
          isOpen={isDetailOpen}
          scrollBehavior="inside"
          size="3xl"
          onOpenChange={setIsDetailOpen}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>
                  <div className="flex items-center gap-2">
                    <Shield size={20} />
                    <span>Verification Request Details</span>
                    {selectedRequest && (
                      <Chip
                        color={getStatusColor(selectedRequest.status)}
                        size="sm"
                        variant="flat"
                      >
                        {selectedRequest.status}
                      </Chip>
                    )}
                  </div>
                </ModalHeader>
                <ModalBody>
                  {selectedRequest && (
                    <div className="space-y-6">
                      {/* Verifier Info */}
                      <div>
                        <h3 className="font-semibold mb-3">
                          Verifier Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm text-default-600">
                              Name
                            </span>
                            <p className="font-medium">
                              {selectedRequest.verifierName}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm text-default-600">
                              Wallet
                            </span>
                            <p className="font-mono text-sm">
                              {selectedRequest.verifierWallet}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm text-default-600">
                              Type
                            </span>
                            <Chip size="sm" variant="flat">
                              {getTypeLabel(selectedRequest.type)}
                            </Chip>
                          </div>
                          <div>
                            <span className="text-sm text-default-600">
                              Priority
                            </span>
                            <Chip
                              color={getPriorityColor(selectedRequest.priority)}
                              size="sm"
                              variant="flat"
                            >
                              {selectedRequest.priority}
                            </Chip>
                          </div>
                        </div>
                      </div>

                      {/* Timelines */}
                      <div>
                        <h3 className="font-semibold mb-3">Timeline</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2 bg-default-50 rounded">
                            <span className="text-sm text-default-600">
                              Submitted
                            </span>
                            <span className="text-sm font-medium">
                              {new Date(
                                selectedRequest.submittedAt,
                              ).toLocaleString()}
                            </span>
                          </div>
                          {selectedRequest.startedAt && (
                            <div className="flex items-center justify-between p-2 bg-default-50 rounded">
                              <span className="text-sm text-default-600">
                                Started
                              </span>
                              <span className="text-sm font-medium">
                                {new Date(
                                  selectedRequest.startedAt,
                                ).toLocaleString()}
                              </span>
                            </div>
                          )}
                          {selectedRequest.scheduledDate && (
                            <div className="flex items-center justify-between p-2 bg-default-50 rounded">
                              <span className="text-sm text-default-600">
                                Scheduled
                              </span>
                              <span className="text-sm font-medium">
                                {new Date(
                                  selectedRequest.scheduledDate,
                                ).toLocaleString()}
                              </span>
                            </div>
                          )}
                          {selectedRequest.completedAt && (
                            <div className="flex items-center justify-between p-2 bg-default-50 rounded">
                              <span className="text-sm text-default-600">
                                Completed
                              </span>
                              <span className="text-sm font-medium">
                                {new Date(
                                  selectedRequest.completedAt,
                                ).toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Report */}
                      {selectedRequest.report && (
                        <div>
                          <h3 className="font-semibold mb-3">
                            Verification Report
                          </h3>
                          <div className="p-4 bg-default-50 rounded-lg mb-4">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-semibold">
                                Overall Score
                              </span>
                              <span className="text-2xl font-bold text-success">
                                {selectedRequest.report.score}%
                              </span>
                            </div>
                            <Progress
                              color="success"
                              value={selectedRequest.report.score}
                            />
                          </div>

                          <div className="space-y-3">
                            {selectedRequest.report.findings.map(
                              (finding, index) => (
                                <div
                                  key={index}
                                  className="p-3 bg-default-50 rounded-lg flex items-start gap-3"
                                >
                                  {finding.status === "pass" ? (
                                    <CheckCircle
                                      className="text-success flex-shrink-0 mt-0.5"
                                      size={20}
                                    />
                                  ) : finding.status === "fail" ? (
                                    <XCircle
                                      className="text-danger flex-shrink-0 mt-0.5"
                                      size={20}
                                    />
                                  ) : (
                                    <AlertCircle
                                      className="text-warning flex-shrink-0 mt-0.5"
                                      size={20}
                                    />
                                  )}
                                  <div className="flex-1">
                                    <p className="font-semibold text-sm">
                                      {finding.category}
                                    </p>
                                    <p className="text-sm text-default-600">
                                      {finding.description}
                                    </p>
                                  </div>
                                </div>
                              ),
                            )}
                          </div>

                          {selectedRequest.report.notes && (
                            <div className="mt-4 p-3 bg-info-50 rounded-lg border border-info-200">
                              <p className="text-xs font-semibold text-info-900 mb-1">
                                Notes:
                              </p>
                              <p className="text-sm text-info-700">
                                {selectedRequest.report.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Response */}
                      {selectedRequest.response && (
                        <div>
                          <h3 className="font-semibold mb-3">Your Response</h3>
                          <div className="p-4 bg-info-50 rounded-lg border border-info-200">
                            <p className="text-sm text-info-700">
                              {selectedRequest.response}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button variant="light" onPress={onClose}>
                    Close
                  </Button>
                  {selectedRequest &&
                    (selectedRequest.status === "pending" ||
                      selectedRequest.status === "in-progress") && (
                      <Button
                        color="primary"
                        startContent={<FileText size={16} />}
                        onPress={() => {
                          setIsDetailOpen(false);
                          handleRespond(selectedRequest);
                        }}
                      >
                        Respond
                      </Button>
                    )}
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        {/* Response Modal */}
        <Modal
          isOpen={isResponseOpen}
          size="2xl"
          onOpenChange={setIsResponseOpen}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>Submit Response</ModalHeader>
                <ModalBody>
                  <div className="space-y-4">
                    <p className="text-sm text-default-600">
                      Provide your response to the verification request from{" "}
                      <strong>{selectedRequest?.verifierName}</strong>.
                    </p>
                    <div>
                      <label
                        className="text-sm font-medium text-default-700 mb-2 block"
                        htmlFor="response-textarea"
                      >
                        Response
                      </label>
                      <textarea
                        className="w-full min-h-[150px] px-3 py-2 rounded-lg border border-default-200 focus:border-primary focus:outline-none resize-none"
                        id="response-textarea"
                        placeholder="Enter your response..."
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                      />
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    isDisabled={!responseText.trim()}
                    onPress={handleSubmitResponse}
                  >
                    Submit Response
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
