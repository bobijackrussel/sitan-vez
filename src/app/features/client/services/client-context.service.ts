import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { AuthService } from '../../../core/auth/auth.service';
import { ClientsService } from '../../../core/api/clients.service';
import { ToastService } from '../../../shared/services/toast.service';
import { UsernameRequest, ClientSummary } from '../../../core/api/api.models';

@Injectable({ providedIn: 'root' })
export class ClientContextService {
  private readonly clientIdSubject = new BehaviorSubject<number | null | undefined>(undefined);
  private loadingClientId = false;

  readonly clientId$: Observable<number | null> = this.clientIdSubject.asObservable().pipe(
    map(value => (value === undefined ? null : value))
  );

  constructor(
    private readonly auth: AuthService,
    private readonly clients: ClientsService,
    private readonly toast: ToastService
  ) {}

  get username(): string {
    const username = this.auth.username;
    if (!username) {
      throw new Error('Client username is not available. Ensure the user is authenticated.');
    }
    return username;
  }

  get isClient(): boolean {
    return this.auth.role === 'CLIENT';
  }

  usernameRequest(): UsernameRequest {
    return { korisnickoIme: this.username };
  }

  ensureClientId(): Observable<number | null> {
    if (!this.isClient) {
      this.clientIdSubject.next(null);
      return this.clientId$;
    }

    if (!this.loadingClientId && this.clientIdSubject.value === undefined) {
      this.loadingClientId = true;
      this.clients.list()
        .pipe(
          map(records => this.extractClientId(records)),
          catchError(err => {
            const message = typeof err === 'string' ? err : 'Unable to resolve client id.';
            this.toast.error(message);
            return of<number | null>(null);
          }),
          finalize(() => {
            this.loadingClientId = false;
          })
        )
        .subscribe(id => this.clientIdSubject.next(id));
    }

    return this.clientId$;
  }

  private extractClientId(records: ClientSummary[]): number | null {
    const match = records.find(record => record.korisnickoIme === this.username);
    return match?.id ?? null;
  }
}
