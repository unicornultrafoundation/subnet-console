import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";

interface ScaleModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentReplicas: number;
  scaleValue: number;
  onScaleValueChange: (value: number) => void;
  onConfirm: () => void;
}

export default function ScaleModal({
  isOpen,
  onOpenChange,
  currentReplicas,
  scaleValue,
  onScaleValueChange,
  onConfirm,
}: ScaleModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Scale Service</ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <p className="text-sm text-default-600">
                  Adjust the number of replicas for this service. Current
                  replicas: <strong>{currentReplicas}</strong>
                </p>
                <Input
                  type="number"
                  label="Replicas"
                  min={0}
                  max={100}
                  value={scaleValue.toString()}
                  onValueChange={(value) =>
                    onScaleValueChange(parseInt(value) || 0)
                  }
                />
                <div className="p-3 bg-default-50 rounded">
                  <p className="text-xs text-default-600">
                    New total resources will be calculated based on replicas ×
                    resources per replica
                  </p>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={() => {
                  onConfirm();
                  onClose();
                }}
              >
                Apply
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

