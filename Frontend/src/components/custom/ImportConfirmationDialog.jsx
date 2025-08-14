// C:\Users\NxtWave\Downloads\code\Frontend\src\components\custom\ImportConfirmationDialog.jsx (New File)

import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

const ImportConfirmationDialog = ({ open, onOpenChange, onConfirm, loading }) => (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you sure you want to import from your profile?</AlertDialogTitle>
        <AlertDialogDescription>
          This will overwrite any existing content in this resume with the data from your master profile. This action cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction asChild>
            <Button onClick={onConfirm} disabled={loading}>
              {loading ? "Importing..." : "Yes, Import"}
            </Button>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default ImportConfirmationDialog;
