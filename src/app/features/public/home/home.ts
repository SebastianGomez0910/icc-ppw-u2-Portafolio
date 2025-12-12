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
  
  programmers: UserProfile[] = [];
  isLoading = true;

  private datosManuales: any = {
    
    'sebgomez395@gmail.com': {
      displayName: 'Sebastian Gómez',
      specialty: 'FULL STACK DEVELOPER',
      description: 'Especialista en arquitectura frontend con Angular y soluciones escalables. Apasionado por el código limpio.',
      photoURL: 'img/fotoS.png', 
      githubUrl: 'https://github.com/SebastianGomez0910',
      whatsappUrl: 'https://wa.me/593978759715'
    },

    'jeanpierre28.jpvv100@gmail.com': {
      displayName: 'Jean Pierre Valarezo ',
      specialty: 'BACKEND SPECIALIST',
      description: 'Experto en lógica de servidor, bases de datos y seguridad. Amante de los sistemas robustos.',
      photoURL: 'img/fotoJ.png',
      githubUrl: 'https://github.com/jean-pierre-valarezo',
      whatsappUrl: 'https://wa.me/593969382180'
    }
  };

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
    this.loadProgrammers();
  }

  async loadProgrammers() {
    try {
      const allUsers = await this.userService.getAllUsers();
      
      this.programmers = allUsers
        .filter(u => u.role === 'programmer')
        .map(user => {
          
          console.log('Intentando fusionar usuario:', user.email); 

          const datosExtra = this.datosManuales[user.email] || {};
          
          return { ...user, ...datosExtra };
        });
      
    } catch (error) {
      console.error(error);
    } finally {
      this.isLoading = false;
      this.cd.detectChanges();
    }
  }
}