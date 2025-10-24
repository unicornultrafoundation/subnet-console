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
  validationErrors
}: DeployStepsProps) {
  const renderStep = () => {
    switch (currentTab) {
      case 0:
        return (
          <BasicInfoStep
            deploymentName={deploymentName}
            description={description}
            maxPrice={maxPrice}
            onDeploymentNameChange={onDeploymentNameChange}
            onDescriptionChange={onDescriptionChange}
            onMaxPriceChange={onMaxPriceChange}
            validationErrors={validationErrors}
          />
        );
      case 1:
        return (
          <ConfigurationStep
            applications={applications}
            deploymentMode={deploymentMode}
            favouriteApps={favouriteApps}
            selectedApplication={selectedApplication}
            onApplicationSelect={onApplicationSelect}
            onMaxPriceChange={onMaxPriceChange}
            validationErrors={validationErrors}
          />
        );
      case 2:
        return (
          <ReviewStep
            deploymentName={deploymentName}
            description={description}
            maxPrice={maxPrice}
            services={services}
            totalCpu={totalCpu}
            totalMemory={totalMemory}
            totalStorage={totalStorage}
            estimatedPrice={estimatedPrice}
          />
        );
      case 3:
        return (
          <BiddingStep
            isBidAccepted={isBidAccepted}
            bids={bids}
            selectedBid={selectedBid}
            isSubmitting={isSubmitting}
            totalCpu={totalCpu}
            totalMemory={totalMemory}
            totalStorage={totalStorage}
            maxPrice={maxPrice}
            estimatedPrice={estimatedPrice}
            services={services}
            selectedRegion={selectedRegion}
            isEditingBidPrice={isEditingBidPrice}
            editedBidPrice={editedBidPrice}
            favouriteProviders={favouriteProviders}
            validationErrors={validationErrors}
            onRequestBids={onRequestBids}
            onAcceptBid={onAcceptBid}
            onSelectBid={onSelectBid}
            onToggleFavouriteProvider={onToggleFavouriteProvider}
            onEditBidPrice={onEditBidPrice}
            onSaveBidPrice={onSaveBidPrice}
            onCancelBidPriceEdit={onCancelBidPriceEdit}
            onEstimatedPriceClick={onEstimatedPriceClick}
            onEditedBidPriceChange={onEditedBidPriceChange}
          />
        );
      case 4:
        return (
          <DeployStep
            isSubmitting={isSubmitting}
            onDeploy={onDeploy}
          />
        );
      default:
        return null;
    }
  };

  return <>{renderStep()}</>;
}
