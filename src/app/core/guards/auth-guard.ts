import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    alert('Necesitas iniciar sesión primero.');
    return router.parseUrl('/auth/login');
  }

  const expectedRole = route.data['role'];
  const userRole = authService.getRole();

  if (expectedRole && userRole !== expectedRole) {
    console.warn('Acceso denegado: Se esperaba', expectedRole, 'pero tienes', userRole);
    router.navigate(['/home']); 
    return false;
  }
  return true;
};