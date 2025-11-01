"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import {
  Network,
  ShoppingCart,
  Plus,
  CheckCircle,
  Send,
  ArrowRight,
} from "lucide-react";

interface VpnIp {
  id: string;
  ip: string;
  peerId: string | null; // p2pId of the VPN node
  purchasedAt: string;
  status: "active" | "inactive";
}

export default function VpnPage() {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [vpnIps, setVpnIps] = useState<VpnIp[]>([]);
  const [newVpnIpAmount, setNewVpnIpAmount] = useState("");
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [transferIpId, setTransferIpId] = useState<string | null>(null);
  const [transferAddress, setTransferAddress] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);
  const [updatingIpIds, setUpdatingIpIds] = useState<Set<string>>(new Set());

  const handlePurchaseVpnIp = async () => {
    if (!newVpnIpAmount || parseInt(newVpnIpAmount) <= 0) {
      alert("Please enter a valid number of IPs to purchase");

      return;
    }

    setIsPurchasing(true);
    // Simulate purchase process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const amount = parseInt(newVpnIpAmount);
    const newIps: VpnIp[] = Array.from({ length: amount }, (_, index) => {
      const ipNumber = Math.floor(Math.random() * 254) + 1;

      return {
        id: `vpn-ip-${Date.now()}-${index}`,
        ip: `10.0.${Math.floor(Math.random() * 255)}.${ipNumber}`,
        peerId: null,
        purchasedAt: new Date().toISOString(),
        status: "active",
      };
    });

    setVpnIps([...vpnIps, ...newIps]);
    setNewVpnIpAmount("");
    setIsPurchasing(false);
    alert(`Successfully purchased ${amount} VPN IP(s)!`);
  };

  const handleUpdatePeerId = (ipId: string, peerId: string) => {
    // Update state only, don't save yet
    setVpnIps(
      vpnIps.map((vpnIp) =>
        vpnIp.id === ipId ? { ...vpnIp, peerId: peerId || null } : vpnIp,
      ),
    );
  };

  const handleSubmitPeerId = async (ipId: string) => {
    const vpnIp = vpnIps.find((ip) => ip.id === ipId);

    if (!vpnIp) return;

    setUpdatingIpIds((prev) => new Set(prev).add(ipId));
    try {
      // Simulate smart contract interaction for this specific IP
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert(`Successfully updated peerId for ${vpnIp.ip} on smart contract!`);
    } catch (error) {
      alert("Failed to update peerId on smart contract. Please try again.");
    } finally {
      setUpdatingIpIds((prev) => {
        const next = new Set(prev);

        next.delete(ipId);

        return next;
      });
    }
  };

  const validateAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const handleOpenTransfer = (ipId: string) => {
    setTransferIpId(ipId);
    setTransferAddress("");
    onOpen();
  };

  const handleCloseTransfer = () => {
    setTransferIpId(null);
    setTransferAddress("");
    onClose();
  };

  const handleTransferIp = async () => {
    if (!transferIpId || !transferAddress) {
      alert("Please enter a recipient address");

      return;
    }

    if (!validateAddress(transferAddress)) {
      alert("Invalid wallet address format");

      return;
    }

    setIsTransferring(true);
    try {
      // Simulate smart contract transfer
      await new Promise((resolve) => setTimeout(resolve, 3000));
      // Remove IP from list after successful transfer
      setVpnIps(vpnIps.filter((ip) => ip.id !== transferIpId));
      alert(`Successfully transferred VPN IP to ${transferAddress}`);
      handleCloseTransfer();
    } catch (error) {
      alert("Failed to transfer VPN IP. Please try again.");
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <Network className="text-primary" size={24} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-dark-on-white">
                VPN Settings
              </h1>
              <p className="text-lg text-dark-on-white-muted">
                Purchase and manage VPN IPs for your nodes
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Purchase VPN IPs */}
            <Card className="subnet-card">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ShoppingCart className="text-secondary" size={20} />
                  <h2 className="text-xl font-bold">Purchase VPN IPs</h2>
                </div>
              </CardHeader>
              <CardBody>
                <div className="bg-secondary/5 p-4 rounded-lg border border-secondary/20">
                  <p className="text-sm text-default-600 mb-4">
                    Purchase VPN IPs from Subnet VPN to link to your VPN nodes.
                    Each IP can be linked to one VPN node by entering its peerId
                    (p2pId).
                  </p>

                  <div className="flex gap-2">
                    <Input
                      className="flex-1"
                      min="1"
                      placeholder="Number of IPs"
                      type="number"
                      value={newVpnIpAmount}
                      onChange={(e) => setNewVpnIpAmount(e.target.value)}
                    />
                    <Button
                      color="secondary"
                      isLoading={isPurchasing}
                      startContent={
                        !isPurchasing ? <Plus size={16} /> : undefined
                      }
                      onPress={handlePurchaseVpnIp}
                    >
                      {isPurchasing ? "Purchasing..." : "Purchase"}
                    </Button>
                  </div>
                  <p className="text-xs text-default-500 mt-2">
                    Price: 10 SCU per IP per month
                  </p>
                </div>
              </CardBody>
            </Card>

            {/* VPN IPs List */}
            <Card className="subnet-card">
              <CardHeader>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Network className="text-primary" size={20} />
                    <h2 className="text-xl font-bold">My VPN IPs</h2>
                  </div>
                  <Chip color="secondary" size="sm" variant="flat">
                    {vpnIps.length} IPs
                  </Chip>
                </div>
              </CardHeader>
              <CardBody>
                {vpnIps.length === 0 ? (
                  <div className="text-center py-8 bg-default-50 rounded-lg">
                    <Network
                      className="mx-auto mb-2 text-default-400"
                      size={32}
                    />
                    <p className="text-sm text-default-500">
                      No VPN IPs purchased yet. Purchase IPs above to get
                      started.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {vpnIps.map((vpnIp) => (
                      <Card key={vpnIp.id} className="subnet-card">
                        <CardBody className="p-4">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-mono font-semibold text-lg">
                                  {vpnIp.ip}
                                </div>
                                <div className="text-xs text-default-500">
                                  Purchased:{" "}
                                  {new Date(
                                    vpnIp.purchasedAt,
                                  ).toLocaleDateString()}
                                </div>
                              </div>

                              <Button
                                color="secondary"
                                size="sm"
                                startContent={<Send size={16} />}
                                variant="flat"
                                onPress={() => handleOpenTransfer(vpnIp.id)}
                              >
                                Transfer
                              </Button>
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Peer ID (p2pId){" "}
                                <span className="text-default-500">
                                  (optional)
                                </span>
                              </label>
                              <div className="flex gap-2">
                                <Input
                                  className="font-mono text-sm flex-1"
                                  placeholder="Enter VPN node peerId/p2pId"
                                  value={vpnIp.peerId || ""}
                                  onChange={(e) =>
                                    handleUpdatePeerId(vpnIp.id, e.target.value)
                                  }
                                />
                                <Button
                                  color="primary"
                                  isLoading={updatingIpIds.has(vpnIp.id)}
                                  size="md"
                                  startContent={
                                    !updatingIpIds.has(vpnIp.id) ? (
                                      <ArrowRight size={16} />
                                    ) : undefined
                                  }
                                  onPress={() => handleSubmitPeerId(vpnIp.id)}
                                >
                                  {updatingIpIds.has(vpnIp.id)
                                    ? "Updating..."
                                    : "Update"}
                                </Button>
                              </div>
                              {vpnIp.peerId && (
                                <div className="flex items-center gap-2 mt-2">
                                  <CheckCircle
                                    className="text-success"
                                    size={16}
                                  />
                                  <span className="text-xs text-success">
                                    Linked to peerId: {vpnIp.peerId}
                                  </span>
                                </div>
                              )}
                              <p className="text-xs text-default-500 mt-1">
                                Enter the p2pId of the VPN node and click Update
                                to submit to smart contract
                              </p>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <Card className="subnet-card">
              <CardHeader>
                <h3 className="text-lg font-bold">Statistics</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <div className="text-3xl font-bold text-primary">
                      {vpnIps.length}
                    </div>
                    <div className="text-sm text-default-600">Total IPs</div>
                  </div>
                  <div className="text-center p-4 bg-success/5 rounded-lg">
                    <div className="text-3xl font-bold text-success">
                      {vpnIps.filter((ip) => ip.peerId).length}
                    </div>
                    <div className="text-sm text-default-600">Linked</div>
                  </div>
                  <div className="text-center p-4 bg-warning/5 rounded-lg">
                    <div className="text-3xl font-bold text-warning">
                      {vpnIps.filter((ip) => !ip.peerId).length}
                    </div>
                    <div className="text-sm text-default-600">Available</div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Info Card */}
            <Card className="subnet-card">
              <CardHeader>
                <h3 className="text-lg font-bold">About VPN IPs</h3>
              </CardHeader>
              <CardBody className="space-y-3 text-sm text-default-600">
                <p>
                  VPN IPs from Subnet VPN allow you to connect your nodes to the
                  network even if you don&apos;t have a public IP address.
                </p>
                <p>
                  <strong>How it works:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Purchase VPN IPs from the Subnet VPN network</li>
                  <li>
                    Link each IP to a VPN node by entering its peerId (p2pId)
                  </li>
                  <li>Your nodes can communicate through the VPN network</li>
                </ul>
                <p className="pt-2 border-t border-default-200">
                  <strong>Pricing:</strong> 10 SCU per IP per month
                </p>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Transfer Modal */}
        <Modal isOpen={isOpen} size="md" onClose={handleCloseTransfer}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Transfer VPN IP
                </ModalHeader>
                <ModalBody>
                  {transferIpId && (
                    <>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-default-600 mb-2">
                            You are about to transfer the following VPN IP:
                          </p>
                          <div className="font-mono font-semibold text-lg p-3 bg-default-100 rounded-lg">
                            {vpnIps.find((ip) => ip.id === transferIpId)?.ip}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Recipient Wallet Address{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <Input
                            className="font-mono text-sm"
                            errorMessage={
                              transferAddress.length > 0 &&
                              !validateAddress(transferAddress)
                                ? "Invalid wallet address format"
                                : undefined
                            }
                            isInvalid={
                              transferAddress.length > 0 &&
                              !validateAddress(transferAddress)
                            }
                            placeholder="0x..."
                            value={transferAddress}
                            onChange={(e) => setTransferAddress(e.target.value)}
                          />
                          <p className="text-xs text-default-500 mt-1">
                            Enter the wallet address that will receive this VPN
                            IP
                          </p>
                        </div>

                        <div className="bg-warning-50 p-3 rounded-lg border border-warning-200">
                          <p className="text-xs text-warning-700">
                            <strong>Warning:</strong> This action is
                            irreversible. Once transferred, you will no longer
                            own this VPN IP.
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button variant="light" onPress={handleCloseTransfer}>
                    Cancel
                  </Button>
                  <Button
                    color="secondary"
                    isDisabled={
                      !transferAddress || !validateAddress(transferAddress)
                    }
                    isLoading={isTransferring}
                    startContent={
                      !isTransferring ? <Send size={16} /> : undefined
                    }
                    onPress={handleTransferIp}
                  >
                    {isTransferring ? "Transferring..." : "Confirm Transfer"}
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
