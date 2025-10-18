import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export type UserRole = 'CLIENT' | 'TAILOR' | 'ADMIN';

interface LoginReq { korisnickoIme: string; lozinka: string; }
interface LoginRes { token: string; role: UserRole; korisnickoIme: string; }

export interface AuthSnapshot {
  token: string;
  role: UserRole | null;
  username: string | null;
  isAuthenticated: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'auth_token';
  private readonly roleKey = 'auth_role';
  private readonly usernameKey = 'auth_username';

  private readonly authStateSubject = new BehaviorSubject<AuthSnapshot>(this.readInitialState());
  readonly authState$ = this.authStateSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(body: LoginReq) {
    return this.http.post<LoginRes>(`${environment.api}/auth/login`, body).pipe(
      tap(res => this.persistSession(res))
    );
  }

  registerClient(data: unknown) {
    return this.http.post(`${environment.api}/auth/register/klijent`, data);
  }

  registerTailor(data: unknown) {
    return this.http.post(`${environment.api}/auth/register/krojac`, data);
  }

  logout(): void {
    this.clearStorage();
    this.authStateSubject.next({
      token: '',
      role: null,
      username: null,
      isAuthenticated: false
    });
  }

  get token(): string { return this.authStateSubject.value.token; }
  get role(): UserRole | null { return this.authStateSubject.value.role; }
  get username(): string | null { return this.authStateSubject.value.username; }
  isLoggedIn(): boolean { return this.authStateSubject.value.isAuthenticated; }

  routeForRole(role?: UserRole | null): string {
    switch (role) {
      case 'CLIENT':
        return '/client';
      case 'TAILOR':
        return '/tailor';
      case 'ADMIN':
        return '/admin';
      default:
        return '/public';
    }
  }

  private persistSession(res: LoginRes): void {
    this.writeValue(this.tokenKey, res.token);
    this.writeValue(this.roleKey, res.role);
    this.writeValue(this.usernameKey, res.korisnickoIme);

    this.authStateSubject.next({
      token: res.token,
      role: res.role,
      username: res.korisnickoIme,
      isAuthenticated: true
    });
  }

  private readInitialState(): AuthSnapshot {
    const token = this.readValue(this.tokenKey) ?? '';
    const role = (this.readValue(this.roleKey) as UserRole | null) ?? null;
    const username = this.readValue(this.usernameKey);
    return {
      token,
      role,
      username,
      isAuthenticated: !!token
    };
  }

  private clearStorage(): void {
    this.removeValue(this.tokenKey);
    this.removeValue(this.roleKey);
    this.removeValue(this.usernameKey);
  }

  private writeValue(key: string, value: string): void {
    const storage = this.resolveStorage();
    if (!storage) { return; }
    storage.setItem(key, value);
  }

  private readValue(key: string): string | null {
    const storage = this.resolveStorage();
    return storage ? storage.getItem(key) : null;
  }

  private removeValue(key: string): void {
    const storage = this.resolveStorage();
    if (!storage) { return; }
    storage.removeItem(key);
  }

  private resolveStorage(): Storage | null {
    if (typeof window === 'undefined') { return null; }
    try {
      return window.localStorage;
    } catch {
      return null;
    }
  }
}
