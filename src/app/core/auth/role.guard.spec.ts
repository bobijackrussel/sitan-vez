import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService, UserRole } from './auth.service';
import { RoleGuard } from './role.guard';

describe('RoleGuard', () => {
  let guard: RoleGuard;
  let authService: AuthService;
  let router: Router;
  let currentRole: UserRole | null;
  let route: ActivatedRouteSnapshot;
  const state = { url: '/tailor/orders' } as RouterStateSnapshot;

  beforeEach(() => {
    currentRole = null;
    route = { data: {} } as ActivatedRouteSnapshot;
    const authStub: Partial<AuthService> = {
      routeForRole: jasmine.createSpy('routeForRole').and.callFake((role: UserRole | null) => {
        if (!role) { return '/public'; }
        return `/${role.toLowerCase()}`;
      })
    };

    Object.defineProperty(authStub, 'role', {
      get: () => currentRole,
      configurable: true
    });

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        RoleGuard,
        { provide: AuthService, useValue: authStub }
      ]
    });

    guard = TestBed.inject(RoleGuard);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('allows navigation when no roles are specified', () => {
    route.data = {};

    expect(guard.canActivate(route, state)).toBeTrue();
  });

  it('allows navigation when user has required role', () => {
    route.data = { roles: ['TAILOR'] };
    currentRole = 'TAILOR';

    expect(guard.canActivate(route, state)).toBeTrue();
  });

  it('redirects anonymous user to login with redirect parameter', () => {
    route.data = { roles: ['CLIENT'] };
    currentRole = null;

    const result = guard.canActivate(route, state) as UrlTree;
    expect(result instanceof UrlTree).toBeTrue();
    expect(router.serializeUrl(result)).toBe('/public/login?redirect=%2Ftailor%2Forders');
  });

  it('redirects signed-in user without required role to their area', () => {
    route.data = { roles: ['ADMIN'] };
    currentRole = 'TAILOR';

    const result = guard.canActivate(route, state) as UrlTree;
    expect(router.serializeUrl(result)).toBe('/tailor');
    expect((authService.routeForRole as jasmine.Spy).calls.mostRecent().args[0]).toBe('TAILOR');
  });
});
