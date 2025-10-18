import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { AuthService } from './core/auth/auth.service';
import { SharedModule } from './shared/shared.module';

describe('AppComponent', () => {
  beforeEach(async () => {
    const authStub = {
      authState$: of({
        token: '',
        role: null,
        username: null,
        isAuthenticated: false
      }),
      logout: jasmine.createSpy('logout'),
      routeForRole: jasmine.createSpy('routeForRole').and.returnValue('/public')
    };

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), SharedModule],
      declarations: [AppComponent],
      providers: [{ provide: AuthService, useValue: authStub }]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('renders the brand link', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.brand a')?.textContent?.trim()).toBe('SewIt');
  });
});
