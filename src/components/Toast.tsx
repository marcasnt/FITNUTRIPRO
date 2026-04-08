import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType, duration?: number) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info', duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    
    setTimeout(() => {
      hideToast(id);
    }, duration);
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <ToastContainer toasts={toasts} onHide={hideToast} />
    </ToastContext.Provider>
  );
};

const toastIcons = {
  success: <CheckCircle size={20} style={{ color: '#b5f727' }} />,
  error: <AlertCircle size={20} style={{ color: '#ef4444' }} />,
  warning: <AlertTriangle size={20} style={{ color: '#f59e0b' }} />,
  info: <Info size={20} style={{ color: '#60a5fa' }} />,
};

const toastStyles = {
  success: { borderLeft: '4px solid #b5f727', background: 'rgba(181,247,39,0.1)' },
  error: { borderLeft: '4px solid #ef4444', background: 'rgba(239,68,68,0.1)' },
  warning: { borderLeft: '4px solid #f59e0b', background: 'rgba(245,158,11,0.1)' },
  info: { borderLeft: '4px solid #60a5fa', background: 'rgba(96,165,250,0.1)' },
};

const ToastContainer: React.FC<{ toasts: Toast[]; onHide: (id: string) => void }> = ({ toasts, onHide }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        maxWidth: 400,
      }}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{
              padding: '16px 20px',
              borderRadius: 14,
              background: toastStyles[toast.type].background,
              border: '1px solid var(--dark-500)',
              borderLeft: toastStyles[toast.type].borderLeft,
              boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            {toastIcons[toast.type]}
            <span style={{ fontSize: 14, fontWeight: 600, color: '#fff', flex: 1 }}>
              {toast.message}
            </span>
            <button
              onClick={() => onHide(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 4,
                color: 'var(--dark-200)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 6,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--dark-700)';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'none';
                e.currentTarget.style.color = 'var(--dark-200)';
              }}
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastProvider;
