import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { ClientsService } from '../../../../core/api/clients.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { KlijentRegisterDTO, ClientSummary } from '../../../../core/api/api.models';

@Component({
  selector: 'app-clients',
  standalone: false,
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent implements OnInit, OnDestroy {
  searchForm: FormGroup;
  createForm: FormGroup;
  clients: ClientSummary[] = [];

  loading = false;
  creating = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly clientsService: ClientsService,
    private readonly toast: ToastService
  ) {
    this.searchForm = this.fb.group({
      search: ['']
    });

    this.createForm = this.fb.group({
      ime: ['', Validators.required],
      prezime: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      korisnickoIme: ['', Validators.required],
      lozinka: ['', [Validators.required, Validators.minLength(6)]],
      adresa: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadClients();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  search(): void {
    this.loadClients();
  }

  resetSearch(): void {
    this.searchForm.reset({ search: '' });
    this.loadClients();
  }

  save(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    const payload = this.createForm.value as KlijentRegisterDTO;
    this.creating = true;
    this.clientsService.create(payload)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => { this.creating = false; })
      )
      .subscribe({
        next: () => {
          this.toast.success('Client created.');
          this.createForm.reset();
          this.loadClients();
        },
        error: err => {
          const message = typeof err === 'string' ? err : 'Unable to create client.';
          this.toast.error(message);
        }
      });
  }

  remove(client: ClientSummary): void {
    const id = client.id ?? client.korisnickoIme;
    this.clientsService.delete(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toast.success('Client removed.');
          this.loadClients();
        },
        error: err => {
          const message = typeof err === 'string' ? err : 'Unable to remove client.';
          this.toast.error(message);
        }
      });
  }

  private loadClients(): void {
    this.loading = true;
    const term = this.searchForm.value.search || '';
    this.clientsService.list(term ? { search: term } : undefined)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => { this.loading = false; })
      )
      .subscribe({
        next: list => this.clients = list
          .slice()
          .sort((a, b) => (a.korisnickoIme || '').localeCompare(b.korisnickoIme || '')),
        error: err => {
          const message = typeof err === 'string' ? err : 'Unable to load clients.';
          this.toast.error(message);
        }
      });
  }
}


