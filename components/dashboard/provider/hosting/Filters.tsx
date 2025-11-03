import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Search } from "lucide-react";

interface FiltersProps {
  searchQuery: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
}

export default function Filters({
  searchQuery,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
}: FiltersProps) {
  return (
    <Card className="subnet-card mb-6">
      <CardBody className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            className="flex-1"
            placeholder="Search by deployment name, application or user..."
            size="lg"
            startContent={<Search className="text-default-400" size={18} />}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <Select
            className="w-[160px]"
            placeholder="All Status"
            selectedKeys={statusFilter ? [statusFilter] : []}
            size="md"
            onSelectionChange={(keys) =>
              onStatusFilterChange(Array.from(keys)[0] as string)
            }
          >
            <SelectItem key="all">All Status</SelectItem>
            <SelectItem key="running">Running</SelectItem>
            <SelectItem key="stopped">Stopped</SelectItem>
            <SelectItem key="starting">Starting</SelectItem>
            <SelectItem key="stopping">Stopping</SelectItem>
            <SelectItem key="error">Error</SelectItem>
          </Select>
        </div>
      </CardBody>
    </Card>
  );
}

