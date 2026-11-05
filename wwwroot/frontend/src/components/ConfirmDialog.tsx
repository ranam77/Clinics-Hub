import "../styles/ConfirmDialog.css";

interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  loading?: boolean;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmDialog({
  isOpen,
  title = "Confirm",
  message, 
  loading = false,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div
        className="confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="dialog-title" >
        <h3 id="dialog-title">{title}</h3>
        <p>{message}</p>
        <div className="dialog-buttons">
          <button type="button" onClick={onCancel} disabled={loading} > {cancelText} </button>
          <button type="button" onClick={onConfirm} disabled={loading} > {loading ? "Booking..." : confirmText} </button> 
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
