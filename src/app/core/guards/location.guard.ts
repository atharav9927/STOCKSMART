import { inject } from '@angular/core';
import { Router, type CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const locationGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const locationId = route.params['locationId'] || route.params['id'];
  if (!locationId || auth.isLocationAllowed(locationId)) {
    return true;
  }

  router.navigate(['/forbidden']);
  return false;
};
