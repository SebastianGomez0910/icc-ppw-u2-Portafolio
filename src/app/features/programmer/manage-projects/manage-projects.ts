import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
    if (!this.newProject.authorName || !this.newProject.name || !this.newProject.description || !this.newProject.role || !this.newProject.technologies) {
      alert('Por favor, completa los campos obligatorios marcados con *');
      return;
    }

    try {
      await this.projectService.addProject(this.newProject);
      alert('🚀 Proyecto añadido exitosamente');
      
      this.newProject = {
        programmerId: this.currentUser?.uid || '',
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