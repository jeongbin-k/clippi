interface ToastProps {
  message: string;
  subMessage?: string;
  actionLabel?: string;
  onAction?: () => void;
  onClose: () => void;
}

function Toast({
  message,
  subMessage,
  actionLabel,
  onAction,
  onClose,
}: ToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-gray-900 text-white px-4 py-3 rounded-2xl shadow-xl animate-fade-in">
      <span className="text-base">✅</span>
      <div className="flex flex-col">
        <span className="text-sm font-medium">{message}</span>
        {subMessage && (
          <span className="text-xs text-gray-400">{subMessage}</span>
        )}
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="text-xs text-purple-400 font-medium hover:text-purple-300 whitespace-nowrap ml-1"
        >
          {actionLabel} →
        </button>
      )}
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-300 ml-1 text-xs"
      >
        ✕
      </button>
    </div>
  );
}

export default Toast;
