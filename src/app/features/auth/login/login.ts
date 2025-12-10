import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/firebase/auth';
import { UserService } from '../../../core/services/roles/user-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  private authService = inject(AuthService);
  private userService = inject(UserService); 
  private router = inject(Router);

  loginData = {
    email: '',
    password: ''
  };

  errorMessage = '';

  async redirigirSegunRol(uid: string) {
    try {
      const profile = await this.userService.getUserById(uid);
      
      if (profile?.role === 'admin') {
        console.log('Admin detectado. Yendo al panel.');
        this.router.navigate(['/admin']); 
      } 
      else if (profile?.role == 'programmer'){
        console.log('Programador detectado. Yendo al panel.')
        this.router.navigate(['/programmer/projects'])
      }
      else {
        console.log('👤 Usuario detectado. Yendo al inicio...');
        this.router.navigate(['/home']);
      }
    } catch (error) {
      console.error('Error al redirigir:', error);
      this.router.navigate(['/home']); 
    }
  }

  onLogin() {
    this.authService.login(this.loginData.email, this.loginData.password)
      .subscribe({
        next: async (res) => {
          await this.redirigirSegunRol(res.user.uid);
        },
        error: (err) => {
          console.error('Error:', err);
          this.errorMessage = 'Correo o contraseña incorrectos';
        }
      });
  }

  onGoogleLogin() {
    this.authService.loginWithGoogle()
      .subscribe({
        next: async (res) => {
          await this.redirigirSegunRol(res.user.uid);
        },
        error: (err) => {
          console.error('Error con Google:', err);
          this.errorMessage = 'Hubo un problema al ingresar con Google';
        }
      });
  }
}