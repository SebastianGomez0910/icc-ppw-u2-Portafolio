import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, effect, ChangeDetectorRef } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/firebase/auth';
import { UserService } from '../../../core/services/roles/user-service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  public AuthService=inject(AuthService);
  private router=inject(Router);
  private UserService=inject(UserService);
  private cd =inject(ChangeDetectorRef);

  isAdmin=false;
  isProgramer=false;

  irInicio(){
    window.scrollTo({top:0,behavior:'smooth'});
  }

  logout(){
    this.AuthService.logout().subscribe(()=>{
      this.router.navigate(['/login'])
    })
  }

  solicitarRol() {
    const user = this.AuthService.currentUser();
    if (user) {
      this.UserService.requestProgrammerRole(user.uid)
        .then(() => {
          alert('¡Solicitud enviada! Un administrador revisará tu perfil.');
        })
        .catch(err => console.error(err));
    }
  }

  constructor() {
    // Este efecto se ejecuta cada vez que cambia el estado del usuario (Login/Logout)
    effect(() => {
      const user = this.AuthService.currentUser();
      if (user) {
        console.log('Navbar: Usuario detectado, verificando rol...', user.email);
        this.checkUserRole(user.uid);
      } else {
        console.log('Navbar: No hay usuario, reseteando menú.');
        this.isAdmin = false;
        this.isProgramer = false;
        this.cd.detectChanges(); // Actualizamos vista
      }
    });
  }

  async checkUserRole(uid: string) {
    try {
      console.log('--- BUSCANDO EN BASE DE DATOS EL ID:', uid);
      const profile = await this.UserService.getUserById(uid);
      
      console.log('Navbar: Perfil descargado de Firebase:', profile); // <--- MIRA ESTO EN CONSOLA

      if (profile) {
        // Verificamos el rol y actualizamos las variables
        this.isAdmin = profile.role === 'admin';
        this.isProgramer = profile.role === 'programmer'; // Asegúrate que en Firebase diga 'programmer' y no 'programador'

        console.log('¿Es Admin?', this.isAdmin);
        console.log('¿Es Programador?', this.isProgramer);
      }
    } catch (error) {
      console.error('Navbar: Error al obtener el rol', error);
    } finally {
      // 3. ¡DESPIERTA ANGULAR! Obligamos a repintar el Navbar con los nuevos botones
      this.cd.detectChanges();
    }
  }
}
