"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Node } from "@/types";

interface DeleteNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  node: Node | null;
  onConfirm: () => void;
}

export function DeleteNodeModal({
  isOpen,
  onClose,
  node,
  onConfirm,
}: DeleteNodeModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Delete Node</ModalHeader>
            <ModalBody>
              <p className="text-default-600">
                Are you sure you want to delete{" "}
                <span className="font-semibold">{node?.name}</span>?
                This action cannot be undone.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="danger" onPress={onConfirm}>
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

