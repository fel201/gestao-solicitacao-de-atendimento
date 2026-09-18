type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-xl border border-[#536170] bg-[#20252b] p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title" aria-describedby="confirm-dialog-description">
        <h2 id="confirm-dialog-title" className="text-lg font-semibold text-slate-100">{title}</h2>
        <p id="confirm-dialog-description" className="mt-2 text-sm text-slate-300">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" className="rounded-md border border-[#536170] px-4 py-2 text-sm text-slate-200 hover:bg-[#2b323a]" onClick={onCancel}>Voltar</button>
          <button type="button" className={destructive ? 'rounded-md border border-red-400/70 px-4 py-2 text-sm text-red-300 hover:bg-red-400/10' : 'rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700'} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}