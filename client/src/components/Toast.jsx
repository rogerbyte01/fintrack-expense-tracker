import { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColors = {
    success: 'bg-emerald-500/90 border-emerald-500',
    error: 'bg-rose-500/90 border-rose-500',
    warning: 'bg-amber-500/90 border-amber-500',
  };

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
  };

  return (
    <div className="fixed top-6 right-6 z-[200] animate-slide-in-right">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl backdrop-blur-md border ${bgColors[type]} text-white`}>
        <span>{icons[type]}</span>
        <p className="font-medium">{message}</p>
        <button onClick={onClose} className="ml-2 text-white/70 hover:text-white transition-colors">
          ✕
        </button>
      </div>
    </div>
  );
};

export default Toast;
