import React from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ToastProps {
  message: string;
  path: string;
  closeToast: () => void;
}

const ToastContent: React.FC<ToastProps> = ({ message, path, closeToast }) => {
  const router = useRouter();

  return (
    <div style={{ color: 'white' }}>
      <p>{message}</p> {/* Wrap the message in a paragraph tag for better spacing */}
    </div>
  );
};

export const showToast = (type: 'success' | 'error', message: string, path?: string) => {
  const options = {
    position: "top-center",
    autoClose: 2000,
    style: { backgroundColor: '#FF414C' },
  };

  if (type === 'success') {
    toast.success(({ closeToast }) => <ToastContent message={message} path={path || ''} closeToast={closeToast} />, options);
  } else if (type === 'error') {
    toast.error(({ closeToast }) => <ToastContent message={message} path={path || ''} closeToast={closeToast} />, options);
  } else {
    console.error('Unsupported toast type:', type);
  }
};
