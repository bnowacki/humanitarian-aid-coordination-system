import React from 'react';
import {
  DialogBackdrop,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type DeleteDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
};

export default function DeleteDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Delete',
  cancelText = 'Cancel',
}: DeleteDialogProps) {
  return (
    <DialogRoot open={open} onOpenChange={onClose}>
      <DialogBackdrop />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {description && <p>{description}</p>}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {cancelText}
          </Button>
          <Button variant="solid" colorScheme="red" onClick={onConfirm}>
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}
