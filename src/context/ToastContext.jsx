import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const ToastContext = createContext();

const toastTypes = {
  success: { icon: CheckCircle, class: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' },
  error: { icon: AlertCircle, class: 'bg-rose-500/20 border-rose-500/50 text-rose-400' },
  warning: { icon: AlertTriangle, class: 'bg-amber-500/20 border-amber-500/50 text-amber-400' },
  info: { icon: Info, class: 'bg-blue-500/20 border-blue-500/50 text-blue-400' }
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
    
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = {
    success: (msg, dur) => addToast(msg, 'success', dur),
    error: (msg, dur) => addToast(msg, 'error', dur),
    warning: (msg, dur) => addToast(msg, 'warning', dur),
    info: (msg, dur) => addToast(msg, 'info', dur)
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3">
        {toasts.map(t => {
          const { icon: Icon, class: bgClass } = toastTypes[t.type];
          return (
            <div
              key={t.id}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl animate-[slide-in_0.3s_ease-out] ${bgClass}`}
            >
              <Icon size={18} />
              <p className="text-sm font-medium">{t.message}</p>
              <button onClick={() => removeToast(t.id)} className="ml-2 hover:opacity-70">
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
