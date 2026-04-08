import { Toaster } from 'react-hot-toast'

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          borderRadius: '10px',
          fontSize: '14px',
          padding: '12px 16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
        success: {
          style: { background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' },
          iconTheme: { primary: '#16a34a', secondary: '#f0fdf4' },
        },
        error: {
          style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' },
          iconTheme: { primary: '#dc2626', secondary: '#fef2f2' },
        },
      }}
    />
  )
}
