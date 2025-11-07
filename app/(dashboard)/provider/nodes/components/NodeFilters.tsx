"use client";

import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Search } from "lucide-react";

interface NodeFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

export function NodeFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: NodeFiltersProps) {
  return (
    <Card className="subnet-card mb-6">
      <CardBody className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            className="flex-1"
            placeholder="Search nodes by name, description, or location..."
            size="lg"
            startContent={<Search size={20} />}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <Select
            className="w-[160px]"
            placeholder="Filter by status"
            selectedKeys={[statusFilter]}
            size="md"
            onSelectionChange={(keys) =>
              onStatusFilterChange(Array.from(keys)[0] as string)
            }
          >
            <SelectItem key="all">All Status</SelectItem>
            <SelectItem key="active">Active</SelectItem>
            <SelectItem key="inactive">Inactive</SelectItem>
            <SelectItem key="maintenance">Maintenance</SelectItem>
            <SelectItem key="offline">Offline</SelectItem>
          </Select>
        </div>
      </CardBody>
    </Card>
  );
}

