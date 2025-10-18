import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../../../core/auth/auth.service';
import { ApiErrorService } from '../../../../core/http/api-error.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  loading = false;
  error?: string;
  private redirectUrl?: string;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private errors: ApiErrorService,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.redirectUrl = this.route.snapshot.queryParamMap.get('redirect') || undefined;
    const usernamePrefill = this.route.snapshot.queryParamMap.get('username');
    if (usernamePrefill) {
      this.form.patchValue({ username: usernamePrefill });
    }
  }

  submit(): void {
    this.error = undefined;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    const credentials = {
      korisnickoIme: this.form.value.username,
      lozinka: this.form.value.password
    };
    this.auth.login(credentials)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: response => {
          const destination = this.redirectUrl || this.resolveRouteForRole();
          const username = response?.korisnickoIme ?? credentials.korisnickoIme;
          this.toast.success(username ? `Welcome back, ${username}!` : 'Welcome back!');
          this.router.navigateByUrl(destination);
        },
        error: err => {
          const message = this.errors.extractMessage(err);
          this.error = message;
          this.toast.error(message);
        }
      });
  }

  private resolveRouteForRole(): string {
    return this.auth.routeForRole(this.auth.role);
  }
}
