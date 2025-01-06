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

const showToast = (message: string, path: string) => {
  toast.success(
    ({ closeToast }) => <ToastContent message={message} path={path} closeToast={closeToast} />,
    { 
        position: "top-center", 
        autoClose: 2000,
        style: { backgroundColor: '#FF414C' } // Set the custom background color and white border
      }
  );
};

export { showToast, ToastContainer };
