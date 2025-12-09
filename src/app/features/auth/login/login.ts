import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/firebase/auth';
import { UserService } from '../../../core/services/roles/user-service';
// 1. IMPORTA TU SERVICIO DE USUARIOS

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  private authService = inject(AuthService);
  private userService = inject(UserService); // <--- 2. INYECTAR SERVICIO
  private router = inject(Router);

  loginData = {
    email: '',
    password: ''
  };

  errorMessage = '';

  // --- NUEVA FUNCIÓN INTELIGENTE PARA REDIRIGIR ---
  async redirigirSegunRol(uid: string) {
    try {
      // Consultamos qué rol tiene este usuario
      const profile = await this.userService.getUserById(uid);
      
      if (profile?.role === 'admin') {
        console.log('👑 Admin detectado. Yendo al panel...');
        this.router.navigate(['/admin']); 
      } else {
        // Si es programador o usuario normal, va al Home
        console.log('👤 Usuario detectado. Yendo al inicio...');
        this.router.navigate(['/home']);
      }
    } catch (error) {
      console.error('Error al redirigir:', error);
      this.router.navigate(['/home']); // Por seguridad, si falla, al Home
    }
  }

  onLogin() {
    this.authService.login(this.loginData.email, this.loginData.password)
      .subscribe({
        next: async (res) => {
          // 'res.user.uid' es el ID del usuario que acaba de entrar
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
          // Igual aquí: Usamos el UID para decidir el destino
          await this.redirigirSegunRol(res.user.uid);
        },
        error: (err) => {
          console.error('Error con Google:', err);
          this.errorMessage = 'Hubo un problema al ingresar con Google';
        }
      });
  }
}