import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/firebase/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.user$.pipe(
    take(1), 
    map(user => {
      if (user) {
        return true;
      } else {
        alert(' Para agendar una cita, necesitas iniciar sesión o registrarte primero.');
        
        return router.createUrlTree(['/login']);
      }
    })
  );
};