import { useEffect } from 'react';
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

type ToastType = 'error' | 'success';

interface SideToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
}

const SideToast = ({ message, type = 'error', onClose }: SideToastProps) => {
  useEffect(() => {
    if (!message) return;

    const timeout = window.setTimeout(onClose, 4200);
    return () => window.clearTimeout(timeout);
  }, [message, onClose]);

  if (!message) return null;

  const isError = type === 'error';

  return (
    <aside
      className={[
        'fixed right-7 top-24 z-50 flex w-[min(520px,calc(100vw-40px))] items-start gap-5 rounded-[24px] border px-7 py-6 shadow-[0_24px_64px_rgba(0,0,0,0.15)]',
        'animate-[toast-in_220ms_ease-out] backdrop-blur-sm',
        isError ? 'border-red-100 bg-[#fff0f0] text-[#7a1717]' : 'border-green-100 bg-[#effaf3] text-[#135c2b]',
      ].join(' ')}
      role="status"
    >
      <span
        className={[
          'mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-full',
          isError ? 'bg-[#ffd9d9] text-[#ef3b3b]' : 'bg-[#d7f5df] text-[#1f9d4d]',
        ].join(' ')}
      >
        {isError ? <ErrorOutlinedIcon sx={{ fontSize: 30 }} /> : <CheckCircleOutlinedIcon sx={{ fontSize: 30 }} />}
      </span>

      <div className="min-w-0 flex-1">
        <p className="m-0 text-lg font-extrabold">{isError ? 'Something went wrong' : 'Success'}</p>
        <p className="m-0 mt-1.5 text-lg font-semibold leading-snug">{message}</p>
      </div>

      <button
        className="rounded-full px-2 text-2xl font-bold leading-none text-current opacity-60 transition hover:bg-black/5 hover:opacity-100"
        type="button"
        aria-label="Close notification"
        onClick={onClose}
      >
        x
      </button>
    </aside>
  );
};

export default SideToast;
