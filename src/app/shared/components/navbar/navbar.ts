import { CommonModule } from '@angular/common';
import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { RouterLink, Router, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true, 
  imports: [RouterLink, CommonModule, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private authService = inject(AuthService);
  private router = inject(Router);
  private cd = inject(ChangeDetectorRef);

  user() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  get isAdmin(): boolean {
    return this.authService.getRole() === 'ROLE_ADMIN';
  }

  get isProgramer(): boolean {
    return this.authService.getRole() === 'ROLE_PROGRAMMER';
  }

  irInicio() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  logout() {
    this.authService.logout(); 
    this.router.navigate(['/login']);
  }

  solicitarRol() {
    alert('Esta funcionalidad se conectará con el Backend de Java pronto.');
  }
}