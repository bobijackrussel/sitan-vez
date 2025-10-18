import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/auth/auth.service';
import { DictionariesService } from '../../../../core/api/dictionaries.service';
import { ApiErrorService } from '../../../../core/http/api-error.service';
import { KrojacRegisterDTO } from '../../../../core/api/api.models';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-register-tailor',
  standalone: false,
  templateUrl: './register-tailor.component.html',
  styleUrls: ['./register-tailor.component.css']
})
export class RegisterTailorComponent implements OnInit {
  form: FormGroup;
  loading = false;
  success = false;
  error?: string;
  countries: string[] = [];

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private dictionaries: DictionariesService,
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
      adresa: ['', Validators.required],
      drzavaNaziv: ['', Validators.required],
      opis: ['', [Validators.required, Validators.minLength(20)]],
      usloviPoslovanja: ['', [Validators.required, Validators.minLength(20)]]
    });
  }

  ngOnInit(): void {
    this.dictionaries.countries().subscribe({
      next: countries => {
        this.countries = countries
          .map(c => c.naziv || '')
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b));
      },
      error: err => {
        this.error = this.errors.extractMessage(err);
        this.toast.error(this.error);
      }
    });
  }

  submit(): void {
    this.error = undefined;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    const payload = this.form.value as KrojacRegisterDTO;
    this.auth.registerTailor(payload)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          this.success = true;
          this.form.disable();
          this.toast.success('Tailor application submitted. We will notify you once it is approved.');
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
