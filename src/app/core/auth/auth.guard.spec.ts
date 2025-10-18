import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  const dummyRoute = {} as ActivatedRouteSnapshot;
  const state = { url: '/client/orders' } as RouterStateSnapshot;

  beforeEach(() => {
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['isLoggedIn']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [{ provide: AuthService, useValue: authService }]
    });

    guard = TestBed.inject(AuthGuard);
    router = TestBed.inject(Router);
  });

  it('allows navigation when the user is logged in', () => {
    authService.isLoggedIn.and.returnValue(true);

    expect(guard.canActivate(dummyRoute, state)).toBeTrue();
    expect(authService.isLoggedIn).toHaveBeenCalled();
  });

  it('redirects to login with redirect param when user is not logged in', () => {
    authService.isLoggedIn.and.returnValue(false);

    const result = guard.canActivate(dummyRoute, state);

    expect(result instanceof UrlTree).toBeTrue();
    const serialized = router.serializeUrl(result as UrlTree);
    expect(serialized).toBe('/public/login?redirect=%2Fclient%2Forders');
  });

  it('redirects to login without redirect param when already on login page', () => {
    authService.isLoggedIn.and.returnValue(false);
    const loginState = { url: '/public/login' } as RouterStateSnapshot;

    const result = guard.canActivate(dummyRoute, loginState);
    const serialized = router.serializeUrl(result as UrlTree);

    expect(serialized).toBe('/public/login');
  });
});
