import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth/auth.service';

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
    name: '', 
    email: '',
    password: '',
    role: 'USER' 
  };

  errorMessage = '';

  onRegister() {
    this.authService.register(this.registerData).subscribe({
      next: () => {
        console.log('Usuario registrado con éxito en la base de datos SQL');
        this.router.navigate(['/auth/login']); 
      },
      error: (err) => {
        console.error('Error:', err);
        if (err.status === 409) {
          this.errorMessage = 'Este correo ya está registrado en el sistema.';
        } else {
          this.errorMessage = 'Hubo un problema con el servidor. Intenta más tarde.';
        }
      }
    });
  }

  onGoogleRegister() {
    console.log('Registro con Google pausado para priorizar autenticación propia (JWT).');
    alert('Por favor, usa el formulario de registro para esta entrega.');
  }
}