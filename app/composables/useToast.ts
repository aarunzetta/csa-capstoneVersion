import { ref } from "vue";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

const toasts = ref<Toast[]>([]);

export const useToast = () => {
  const addToast = (
    message: string,
    type: ToastType = "info",
    duration: number = 3000,
  ) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const toast: Toast = { id, message, type, duration };

    toasts.value.push(toast);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  };

  const removeToast = (id: string) => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
  };

  const success = (message: string, duration?: number) => {
    return addToast(message, "success", duration);
  };

  const error = (message: string, duration?: number) => {
    return addToast(message, "error", duration);
  };

  const info = (message: string, duration?: number) => {
    return addToast(message, "info", duration);
  };

  const warning = (message: string, duration?: number) => {
    return addToast(message, "warning", duration);
  };

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning,
  };
};
