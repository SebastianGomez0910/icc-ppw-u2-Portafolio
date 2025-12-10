import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Verifica que la ruta de importación sea la correcta en tu proyecto
import { Project, ProjectService } from '../../../core/services/project'; 
import { AuthService } from '../../../core/services/firebase/auth';

@Component({
  selector: 'app-programmer-projects',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-projects.html',
  styleUrl: './manage-projects.css'
})
export class ProgrammerProjectsComponent implements OnInit {

  private projectService = inject(ProjectService);
  private authService = inject(AuthService);
  private cd = inject(ChangeDetectorRef); 

  projects: Project[] = [];
  
  newProject: Project = {
    programmerId: '',
    name: '',
    description: '',
    projectType: 'Académico',
    role: '',
    technologies: '',
    repoUrl: '',
    demoUrl: '',
    authorName: '' 
  };

  currentUser = this.authService.currentUser();

  ngOnInit() {
    if (this.currentUser) {
      this.newProject.programmerId = this.currentUser.uid;
      // Pre-llenamos el nombre para ayudar, pero el usuario puede editarlo
      this.newProject.authorName = this.currentUser.displayName || this.currentUser.email || '';
      this.loadProjects();
    }
  }

  async loadProjects() {
    if (this.currentUser) {
      this.projects = await this.projectService.getMyProjects(this.currentUser.uid);
      this.cd.detectChanges(); 
    }
  }

  async add() {
    // 1. VALIDACIÓN: Agregamos 'authorName' para que no lo dejen vacío
    if (!this.newProject.authorName || !this.newProject.name || !this.newProject.description || !this.newProject.role || !this.newProject.technologies) {
      alert('Por favor, completa los campos obligatorios marcados con *');
      return;
    }

    // 🔴 AQUÍ BORRÉ LAS LÍNEAS QUE SOBRESCRIBÍAN EL NOMBRE
    // Ahora confiamos en this.newProject.authorName que viene del HTML

    try {
      await this.projectService.addProject(this.newProject);
      alert('🚀 Proyecto añadido exitosamente');
      
      // 2. LIMPIEZA: Reiniciamos el formulario
      this.newProject = {
        programmerId: this.currentUser?.uid || '',
        // Volvemos a pre-llenar el nombre para el siguiente proyecto por comodidad
        authorName: this.currentUser?.displayName || this.currentUser?.email || '',
        name: '',
        description: '',
        projectType: 'Académico',
        role: '',
        technologies: '',
        repoUrl: '',
        demoUrl: ''
      };

      await this.loadProjects(); 
      
    } catch (error) {
      console.error(error);
      alert('Error al publicar el proyecto.');
    }
  }

  async delete(id: string) {
    if(confirm('¿Borrar este proyecto?')) {
      await this.projectService.deleteProject(id);
      await this.loadProjects(); 
    }
  }
}