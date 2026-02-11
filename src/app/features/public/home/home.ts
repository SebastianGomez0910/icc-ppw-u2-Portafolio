import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService, UserProfile } from '../../../core/services/roles/user-service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private userService = inject(UserService);  
  private cd = inject(ChangeDetectorRef);
  
  isLoading = false;

  programmers: any[] = [
    {
      displayName: 'Sebastian Gómez',
      specialty: 'FULL STACK DEVELOPER',
      description: 'Especialista en arquitectura frontend con Angular y diseño de soluciones escalables.',
      photoURL: 'img/fotoS.png',
      githubUrl: 'https://github.com/SebastianGomez0910',
      whatsappUrl: 'https://wa.me/593978759715'
    },
    {
      displayName: 'Jean Pierre Valarezo',
      specialty: 'BACKEND SPECIALIST',
      description: 'Experto en lógica de servidor, Spring Boot y gestión de bases de datos relacionales.',
      photoURL: 'img/fotoJ.png',
      githubUrl: 'https://github.com/jean-pierre-valarezo',
      whatsappUrl: 'https://wa.me/593969382180'
    }
  ];

  images: string[] = ['img/simpsons.png', 'img/heuristicas.png', 'img/formulario.png'];
  
  imgDesplazada = 0;
  mostrarBotonArriba = false;

  siguienteImg() { this.imgDesplazada = (this.imgDesplazada + 1) % this.images.length; }
  imgPrevia() { this.imgDesplazada = (this.imgDesplazada - 1 + this.images.length) % this.images.length; }
  
  @HostListener('window:scroll', [])
  desplazoVentana() {
    this.mostrarBotonArriba = window.scrollY > 100;
  }
  volverArriba() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

  ngOnInit(): void {
    this.isLoading = false;
  }
}