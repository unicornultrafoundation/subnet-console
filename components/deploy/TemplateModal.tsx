"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Chip } from "@heroui/chip";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Search, X, Heart } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  provider: string;
  icon: string;
  services: number;
  estimatedCost: string;
  features: string[];
}

interface TemplateModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  templates: Template[];
  templateFilter: {
    provider: string;
    name: string;
    category: string;
    showFavourites: boolean;
  };
  favouriteProviders: string[];
  onTemplateSelect: (template: Template) => void;
  onFilterChange: (filter: any) => void;
  onToggleFavourite: (templateId: string) => void;
}

export default function TemplateModal({
  isOpen,
  onOpenChange,
  templates,
  templateFilter,
  favouriteProviders,
  onTemplateSelect,
  onFilterChange,
  onToggleFavourite,
}: TemplateModalProps) {
  // Filter templates based on filter criteria
  const filteredTemplates = templates.filter((template) => {
    const matchesProvider =
      !templateFilter.provider ||
      template.provider
        .toLowerCase()
        .includes(templateFilter.provider.toLowerCase());
    const matchesName =
      !templateFilter.name ||
      template.name.toLowerCase().includes(templateFilter.name.toLowerCase());
    const matchesCategory =
      !templateFilter.category ||
      template.category
        .toLowerCase()
        .includes(templateFilter.category.toLowerCase());
    const matchesFavourites =
      !templateFilter.showFavourites ||
      favouriteProviders.includes(template.provider);

    return (
      matchesProvider && matchesName && matchesCategory && matchesFavourites
    );
  });

  // Get unique categories and providers for filter dropdowns
  const categories = Array.from(new Set(templates.map((t) => t.category)));
  const providers = Array.from(new Set(templates.map((t) => t.provider)));

  return (
    <Modal
      isOpen={isOpen}
      scrollBehavior="inside"
      size="5xl"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold">Choose Template</h2>
              <p className="text-default-600 text-sm">
                Select a pre-configured template to get started quickly
              </p>
            </ModalHeader>
            <ModalBody>
              {/* Filter Section */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-semibold">Filter Templates</h3>
                  <Chip color="primary" size="sm" variant="flat">
                    {filteredTemplates.length} templates
                  </Chip>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {/* Provider Filter */}
                  <Select
                    className="w-full"
                    label="Provider"
                    placeholder="All Providers"
                    selectedKeys={
                      templateFilter.provider
                        ? new Set([templateFilter.provider])
                        : new Set()
                    }
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0] as string;

                      onFilterChange({
                        ...templateFilter,
                        provider: selectedKey || "",
                      });
                    }}
                  >
                    <SelectItem key="" textValue="All Providers">
                      All Providers
                    </SelectItem>
                    <>
                      {providers?.map((provider) => (
                        <SelectItem key={provider} textValue={provider}>
                          {provider}
                        </SelectItem>
                      ))}
                    </>
                  </Select>

                  {/* Category Filter */}
                  <Select
                    className="w-full"
                    label="Category"
                    placeholder="All Categories"
                    selectedKeys={
                      templateFilter.category
                        ? new Set([templateFilter.category])
                        : new Set()
                    }
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0] as string;

                      onFilterChange({
                        ...templateFilter,
                        category: selectedKey || "",
                      });
                    }}
                  >
                    <SelectItem key="" textValue="All Categories">
                      All Categories
                    </SelectItem>
                    <>
                      {categories?.map((category) => (
                        <SelectItem key={category} textValue={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </>
                  </Select>

                  {/* Name Search */}
                  <Input
                    className="w-full"
                    label="Search by Name"
                    placeholder="Search templates..."
                    startContent={
                      <Search className="text-default-400" size={16} />
                    }
                    value={templateFilter.name}
                    onChange={(e) =>
                      onFilterChange({
                        ...templateFilter,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Favourites Toggle */}
                <div className="flex items-center justify-between">
                  <Button
                    color={templateFilter.showFavourites ? "danger" : "default"}
                    size="sm"
                    startContent={
                      <Heart
                        className={
                          templateFilter.showFavourites ? "fill-current" : ""
                        }
                        size={16}
                      />
                    }
                    variant={
                      templateFilter.showFavourites ? "solid" : "bordered"
                    }
                    onClick={() =>
                      onFilterChange({
                        ...templateFilter,
                        showFavourites: !templateFilter.showFavourites,
                      })
                    }
                  >
                    {templateFilter.showFavourites
                      ? "Show Favourites Only"
                      : "Show All"}
                  </Button>

                  {favouriteProviders.length > 0 && (
                    <Chip color="danger" size="sm" variant="flat">
                      {favouriteProviders.length} favourites
                    </Chip>
                  )}
                </div>

                {/* Clear Filters */}
                {(templateFilter.provider ||
                  templateFilter.category ||
                  templateFilter.name ||
                  templateFilter.showFavourites) && (
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      startContent={<X size={16} />}
                      variant="light"
                      onClick={() =>
                        onFilterChange({
                          provider: "",
                          name: "",
                          category: "",
                          showFavourites: false,
                        })
                      }
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="cursor-pointer hover:border-primary/50 transition-all rounded-lg border border-default-200 p-4"
                    role="button"
                    style={{ pointerEvents: "auto", zIndex: 1 }}
                    tabIndex={0}
                    onClick={() => {
                      console.log("Template card clicked:", template);
                      onTemplateSelect(template);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onTemplateSelect(template);
                      }
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-2xl">{template.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{template.name}</h3>
                        <p className="text-xs text-default-500">
                          {template.category}
                        </p>
                        <p className="text-xs text-primary font-medium">
                          {template.provider}
                        </p>
                      </div>
                      <Button
                        isIconOnly
                        className="text-default-400 hover:text-danger"
                        size="sm"
                        variant="light"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavourite(template.id);
                        }}
                      >
                        <Heart
                          className={
                            favouriteProviders.includes(template.provider)
                              ? "text-danger fill-danger"
                              : ""
                          }
                          size={16}
                        />
                      </Button>
                    </div>
                    <p className="text-sm text-default-600 mb-3">
                      {template.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-default-500">Services:</span>
                        <span>{template.services}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-default-500">Cost:</span>
                        <span className="text-primary font-medium">
                          {template.estimatedCost}
                        </span>
                      </div>
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-1">
                          {template.features
                            .slice(0, 2)
                            .map((feature, index) => (
                              <Chip
                                key={index}
                                color="primary"
                                size="sm"
                                variant="flat"
                              >
                                {feature}
                              </Chip>
                            ))}
                          {template.features.length > 2 && (
                            <Chip color="default" size="sm" variant="flat">
                              +{template.features.length - 2}
                            </Chip>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
