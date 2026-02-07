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
    const userRole = role.toUpperCase(); 
    
    if (userRole === 'ADMIN') {
      console.log('Admin detectado. Yendo al panel.');
      this.router.navigate(['/admin']); 
    } 
    else if (userRole === 'PROGRAMMER'){
      console.log('Programador detectado. Yendo al panel.')
      this.router.navigate(['/programmer/projects'])
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

  onGoogleLogin() {
  console.log('Login con Google deshabilitado temporalmente para priorizar JWT según la rúbrica');
  alert('Esta funcionalidad se activará después. Por ahora usa el correo y contraseña.');
}
}