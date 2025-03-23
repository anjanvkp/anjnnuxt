import { ref } from 'vue';

interface Toast {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

export function useToast() {
  const toast = ref<Toast | null>(null);

  function showToast(newToast: Toast) {
    toast.value = {
      message: newToast.message,
      type: newToast.type,
      duration: newToast.duration || 3000
    };

    setTimeout(() => {
      toast.value = null;
    }, toast.value.duration);
  }

  function success(message: string, duration?: number) {
    showToast({ message, type: 'success', duration });
  }

  function error(message: string, duration?: number) {
    showToast({ message, type: 'error', duration });
  }

  function info(message: string, duration?: number) {
    showToast({ message, type: 'info', duration });
  }

  function warning(message: string, duration?: number) {
    showToast({ message, type: 'warning', duration });
  }

  return {
    toast,
    success,
    error,
    info,
    warning
  };
}