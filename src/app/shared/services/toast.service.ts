import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  autoClose: boolean;
  duration: number;
  actionLabel?: string;
  action?: () => void;
}

export interface ToastOptions {
  type?: ToastType;
  autoClose?: boolean;
  duration?: number;
  actionLabel?: string;
  action?: () => void;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly toastsSubject = new BehaviorSubject<Toast[]>([]);
  readonly toasts$ = this.toastsSubject.asObservable();
  private idCounter = 0;

  show(message: string, options: ToastOptions = {}): string {
    const id = `toast-${++this.idCounter}`;
    const toast: Toast = {
      id,
      message,
      type: options.type ?? 'info',
      autoClose: options.autoClose ?? true,
      duration: options.duration ?? 5000,
      actionLabel: options.actionLabel,
      action: options.action
    };

    this.toastsSubject.next([...this.toastsSubject.value, toast]);

    if (toast.autoClose && toast.duration > 0) {
      setTimeout(() => this.dismiss(id), toast.duration);
    }

    return id;
  }

  success(message: string, options: ToastOptions = {}): string {
    return this.show(message, { ...options, type: 'success' });
  }

  error(message: string, options: ToastOptions = {}): string {
    return this.show(message, { ...options, type: 'error' });
  }

  warning(message: string, options: ToastOptions = {}): string {
    return this.show(message, { ...options, type: 'warning' });
  }

  info(message: string, options: ToastOptions = {}): string {
    return this.show(message, { ...options, type: 'info' });
  }

  dismiss(id: string): void {
    const updated = this.toastsSubject.value.filter(toast => toast.id !== id);
    this.toastsSubject.next(updated);
  }

  clear(): void {
    this.toastsSubject.next([]);
  }
}
