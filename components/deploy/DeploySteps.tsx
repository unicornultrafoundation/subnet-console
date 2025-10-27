"use client";

import React from "react";

import BasicInfoStep from "./steps/BasicInfoStep";
import ConfigurationStep from "./steps/ConfigurationStep";
import ReviewStep from "./steps/ReviewStep";
import BiddingStep from "./steps/BiddingStep";
import DeployStep from "./steps/DeployStep";

interface DeployStepsProps {
  currentTab: number;
  // Basic Info props
  deploymentName: string;
  description: string;
  maxPrice: string;
  onDeploymentNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;

  // Configuration props
  applications: any[];
  deploymentMode: "template" | "application";
  favouriteApps: string[];
  selectedApplication: any;
  onApplicationSelect: (application: any) => void;

  // Review props
  services: any[];
  totalCpu: string;
  totalMemory: string;
  totalStorage: string;
  estimatedPrice: string;

  // Bidding props
  isBidAccepted: boolean;
  bids: any[];
  selectedBid: string;
  isSubmitting: boolean;
  selectedRegion: string;
  isEditingBidPrice: boolean;
  editedBidPrice: string;
  favouriteProviders: string[];
  onRequestBids: () => void;
  onAcceptBid: () => void;
  onSelectBid: (bidId: string) => void;
  onToggleFavouriteProvider: (providerId: string) => void;
  onEditBidPrice: () => void;
  onSaveBidPrice: () => void;
  onCancelBidPriceEdit: () => void;
  onEstimatedPriceClick: () => void;
  onEditedBidPriceChange: (value: string) => void;

  // Deploy props
  onDeploy: () => void;

  // Validation
  validationErrors: string[];
}

export default function DeploySteps({
  currentTab,
  deploymentName,
  description,
  maxPrice,
  onDeploymentNameChange,
  onDescriptionChange,
  onMaxPriceChange,
  applications,
  deploymentMode,
  favouriteApps,
  selectedApplication,
  onApplicationSelect,
  services,
  totalCpu,
  totalMemory,
  totalStorage,
  estimatedPrice,
  isBidAccepted,
  bids,
  selectedBid,
  isSubmitting,
  selectedRegion,
  isEditingBidPrice,
  editedBidPrice,
  favouriteProviders,
  onRequestBids,
  onAcceptBid,
  onSelectBid,
  onToggleFavouriteProvider,
  onEditBidPrice,
  onSaveBidPrice,
  onCancelBidPriceEdit,
  onEstimatedPriceClick,
  onEditedBidPriceChange,
  onDeploy,
  validationErrors,
}: DeployStepsProps) {
  const renderStep = () => {
    switch (currentTab) {
      case 0:
        return (
          <BasicInfoStep
            deploymentName={deploymentName}
            description={description}
            maxPrice={maxPrice}
            validationErrors={validationErrors}
            onDeploymentNameChange={onDeploymentNameChange}
            onDescriptionChange={onDescriptionChange}
            onMaxPriceChange={onMaxPriceChange}
          />
        );
      case 1:
        return (
          <ConfigurationStep
            applications={applications}
            deploymentMode={deploymentMode}
            favouriteApps={favouriteApps}
            selectedApplication={selectedApplication}
            validationErrors={validationErrors}
            onApplicationSelect={onApplicationSelect}
            onMaxPriceChange={onMaxPriceChange}
          />
        );
      case 2:
        return (
          <ReviewStep
            deploymentName={deploymentName}
            description={description}
            estimatedPrice={estimatedPrice}
            maxPrice={maxPrice}
            services={services}
            totalCpu={totalCpu}
            totalMemory={totalMemory}
            totalStorage={totalStorage}
          />
        );
      case 3:
        return (
          <BiddingStep
            bids={bids}
            editedBidPrice={editedBidPrice}
            estimatedPrice={estimatedPrice}
            favouriteProviders={favouriteProviders}
            isBidAccepted={isBidAccepted}
            isEditingBidPrice={isEditingBidPrice}
            isSubmitting={isSubmitting}
            maxPrice={maxPrice}
            selectedBid={selectedBid}
            selectedRegion={selectedRegion}
            services={services}
            totalCpu={totalCpu}
            totalMemory={totalMemory}
            totalStorage={totalStorage}
            validationErrors={validationErrors}
            onAcceptBid={onAcceptBid}
            onCancelBidPriceEdit={onCancelBidPriceEdit}
            onEditBidPrice={onEditBidPrice}
            onEditedBidPriceChange={onEditedBidPriceChange}
            onEstimatedPriceClick={onEstimatedPriceClick}
            onRequestBids={onRequestBids}
            onSaveBidPrice={onSaveBidPrice}
            onSelectBid={onSelectBid}
            onToggleFavouriteProvider={onToggleFavouriteProvider}
          />
        );
      case 4:
        return <DeployStep isSubmitting={isSubmitting} onDeploy={onDeploy} />;
      default:
        return null;
    }
  };

  return <>{renderStep()}</>;
}
