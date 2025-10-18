import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Toast, ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: false,
  templateUrl: './toast-container.component.html',
  styleUrls: ['./toast-container.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastContainerComponent {
  constructor(private toastService: ToastService) {}

  get toasts$() {
    return this.toastService.toasts$;
  }

  dismiss(id: string): void {
    this.toastService.dismiss(id);
  }

  triggerAction(toast: Toast): void {
    toast.action?.();
    if (toast.autoClose !== false) {
      this.toastService.dismiss(toast.id);
    }
  }

  trackById(_: number, toast: Toast): string {
    return toast.id;
  }
}
