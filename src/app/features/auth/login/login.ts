import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  private authService = inject(AuthService);
  private router = inject(Router);

  loginData = {
    email: '',
    password: ''
  };

  errorMessage = '';

  redirigirSegunRol(role: string) {
    const userRole = role.toUpperCase().trim(); 
    
    if (userRole.includes('ADMIN')) {
      console.log('Admin detectado. Yendo al panel.');
      this.router.navigate(['/admin']); 
    } 
    else if (userRole.includes('PROGRAMMER')){
      console.log('Programador detectado. Yendo al panel.')
      this.router.navigate(['/programmer/appointments'])
    }
    else {
      console.log('Usuario detectado. Yendo al inicio...');
      this.router.navigate(['/home']);
    }
  }

  onLogin() {
    this.authService.login(this.loginData)
      .subscribe({
        next: (res) => {
          this.redirigirSegunRol(res.role);
        },
        error: (err) => {
          console.error('Error:', err);
          this.errorMessage = 'Correo o contraseña incorrectos';
        }
      });
  }
}