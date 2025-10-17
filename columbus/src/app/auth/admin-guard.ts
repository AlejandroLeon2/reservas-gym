import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../service/auth/auth-service';
import { Router } from '@angular/router';

export const adminGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.getCurrentUser();

  if (!user) {
    router.navigate(['/login']);

    return false;
  }

  const role = await authService.getUserRoleFromBackend();
  if (role === 'entrenador' ||role === 'cliente') {
    console.log("aceptado",role);

    return true;
  }

  router.navigate(['/']);
  return false;
};
