import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";

interface DeleteModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  deploymentName: string;
  onConfirm: () => void;
}

export default function DeleteModal({
  isOpen,
  onOpenChange,
  deploymentName,
  onConfirm,
}: DeleteModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Delete Deployment</ModalHeader>
            <ModalBody>
              <p>
                Are you sure you want to delete <strong>{deploymentName}</strong>
                ? This action cannot be undone.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="danger"
                onPress={() => {
                  onConfirm();
                  onClose();
                }}
              >
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

