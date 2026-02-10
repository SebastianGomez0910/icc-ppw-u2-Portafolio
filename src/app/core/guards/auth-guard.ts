import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    console.warn('Acceso denegado: Usuario no autenticado');
    return router.parseUrl('/login'); 
  }

  const expectedRole = route.data['role'];
  const userRole = authService.getRole()?.toUpperCase();

  if (expectedRole) {
    const roleToExpect = expectedRole.toUpperCase();
    
    if (userRole !== 'ADMIN' && userRole !== roleToExpect) {
      console.warn(`Acceso denegado: Se esperaba ${roleToExpect} pero el usuario es ${userRole}`);
      return router.parseUrl('/home'); 
    }
  }

  return true;
};