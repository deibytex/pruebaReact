export interface ConfirmDialogModel {
    titulo: string;
    backdrop?: string;
    keyboard?: boolean;
    body?: React.Component | null;
    handleConfirm : (() => void) ;
  };