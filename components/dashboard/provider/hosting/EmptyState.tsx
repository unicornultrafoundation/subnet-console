import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Server, Plus } from "lucide-react";

interface EmptyStateProps {
  searchQuery: string;
  statusFilter: string;
  onDeploy: () => void;
}

export default function EmptyState({
  searchQuery,
  statusFilter,
  onDeploy,
}: EmptyStateProps) {
  return (
    <Card className="subnet-card">
      <CardBody className="p-12 text-center">
        <Server className="mx-auto mb-4 text-default-300" size={48} />
        <h3 className="text-lg font-semibold mb-2">No deployments found</h3>
        <p className="text-default-600 mb-4">
          {searchQuery || statusFilter !== "all"
            ? "Try adjusting your filters"
            : "Deploy your first application to get started"}
        </p>
        {!searchQuery && statusFilter === "all" && (
          <Button
            color="primary"
            startContent={<Plus size={18} />}
            onPress={onDeploy}
          >
            Deploy Application
          </Button>
        )}
      </CardBody>
    </Card>
  );
}

