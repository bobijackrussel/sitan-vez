import { Injectable } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { ToastService } from '../../../shared/services/toast.service';

@Injectable({ providedIn: 'root' })
export class TailorContextService {
  constructor(private readonly auth: AuthService, private readonly toast: ToastService) {}

  get username(): string {
    const username = this.auth.username;
    if (!username) {
      this.toast.error('Tailor session is not available. Please sign in again.');
      throw new Error('Tailor username missing');
    }
    return username;
  }

  ensureTailor(required = true): boolean {
    const isTailor = this.auth.role === 'TAILOR';
    if (!isTailor && required) {
      this.toast.warning('Available only to tailor accounts.');
    }
    return isTailor;
  }
}