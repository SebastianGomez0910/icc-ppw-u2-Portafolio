import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/firebase/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  // 1. Inyectamos los servicios necesarios
  private authService = inject(AuthService);
  private router = inject(Router);

  loginData = {
    email: '',
    password: ''
  };

  errorMessage = ''; // Para mostrar errores si fallan las credenciales

  // Lógica para Email y Contraseña
  onLogin() {
    this.authService.login(this.loginData.email, this.loginData.password)
      .subscribe({
        next: () => {
          console.log('Login exitoso');
          this.router.navigate(['/home']); // <--- Redirige al Home
        },
        error: (err) => {
          console.error('Error:', err);
          this.errorMessage = 'Correo o contraseña incorrectos';
        }
      });
  }

  // Lógica para GOOGLE (¡La nueva función!)
  onGoogleLogin() {
    this.authService.loginWithGoogle()
      .subscribe({
        next: (res) => {
          console.log('Google Login exitoso:', res);
          this.router.navigate(['/home']); // <--- Redirige al Home
        },
        error: (err) => {
          console.error('Error con Google:', err);
          this.errorMessage = 'Hubo un problema al ingresar con Google';
        }
      });
  }
}