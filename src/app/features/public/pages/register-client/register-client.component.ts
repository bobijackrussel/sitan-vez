import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/auth/auth.service';
import { ApiErrorService } from '../../../../core/http/api-error.service';
import { KlijentRegisterDTO } from '../../../../core/api/api.models';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-register-client',
  standalone: false,
  templateUrl: './register-client.component.html',
  styleUrls: ['./register-client.component.css']
})
export class RegisterClientComponent {
  form: FormGroup;
  loading = false;
  success = false;
  error?: string;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private errors: ApiErrorService,
    private router: Router,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      ime: ['', Validators.required],
      prezime: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      korisnickoIme: ['', [Validators.required, Validators.minLength(4)]],
      lozinka: ['', [Validators.required, Validators.minLength(6)]],
      adresa: ['', Validators.required]
    });
  }

  submit(): void {
    this.error = undefined;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    const payload = this.form.value as KlijentRegisterDTO;
    this.auth.registerClient(payload)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          this.success = true;
          this.form.disable();
          this.toast.success('Client account created. You can sign in now.');
          this.router.navigate(['/public/login'], {
            queryParams: { username: payload.korisnickoIme }
          });
        },
        error: err => {
          this.error = this.errors.extractMessage(err);
          this.toast.error(this.error);
        }
      });
  }

  control(name: string) {
    return this.form.get(name);
  }
}
