import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiErrorService {
  extractMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (typeof error.error === 'string') { return error.error; }
      if (error.error?.message) { return error.error.message; }
      if (error.message) { return error.message; }
      return `HTTP ${error.status}`;
    }

    if (error && typeof error === 'object' && 'message' in error) {
      return String((error as any).message);
    }

    return 'An unexpected error occurred.';
  }
}
