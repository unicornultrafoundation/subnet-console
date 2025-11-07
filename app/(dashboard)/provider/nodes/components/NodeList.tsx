"use client";

import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Server } from "lucide-react";
import { Node } from "@/types";
import { NodeCard } from "./NodeCard";

interface NodeListProps {
  nodes: Node[];
  searchQuery: string;
  statusFilter: string;
  onViewDetails: (node: Node) => void;
  onEdit: (node: Node) => void;
  onDelete: (node: Node) => void;
  onStatusChange: (nodeId: string, newStatus: Node["status"]) => void;
  onAddNode: () => void;
}

export function NodeList({
  nodes,
  searchQuery,
  statusFilter,
  onViewDetails,
  onEdit,
  onDelete,
  onStatusChange,
  onAddNode,
}: NodeListProps) {
  const filteredNodes = nodes.filter((node) => {
    const matchesSearch =
      node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.location.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || node.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (filteredNodes.length === 0) {
    return (
      <Card className="subnet-card">
        <CardBody className="p-12 text-center">
          <Server className="text-default-300 mx-auto mb-4" size={48} />
          <h3 className="text-xl font-semibold text-default-600 mb-2">
            No nodes found
          </h3>
          <p className="text-default-500 mb-4">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your filters"
              : "Get started by adding your first node"}
          </p>
          {!searchQuery && statusFilter === "all" && (
            <Button color="primary" onPress={onAddNode}>
              Add New Node
            </Button>
          )}
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {filteredNodes.map((node) => (
        <NodeCard
          key={node.id}
          node={node}
          onViewDetails={onViewDetails}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}

