import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/firebase/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './register.html',
})
export class Register {

  private authService = inject(AuthService);
  private router = inject(Router);

  registerData = {
    user: '', 
    email: '',
    password: ''
  };

  errorMessage = '';

  onRegister() {
    this.authService.register(this.registerData.email, this.registerData.password)
      .subscribe({
        next: () => {
          console.log('Usuario registrado con éxito');
          this.router.navigate(['/home']); 
        },
        error: (err) => {
          console.error('Error:', err);
          if (err.code === 'auth/email-already-in-use') {
            this.errorMessage = 'Este correo ya está registrado.';
          } else {
            this.errorMessage = 'Error al registrarse. Intenta de nuevo.';
          }
        }
      });
  }
  
  onGoogleRegister() {
    this.authService.loginWithGoogle().subscribe({
        next: () => this.router.navigate(['/home']),
        error: (err) => console.error(err)
    });
  }
}