import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Project, ProjectService } from '../../../core/models/project'; 
import { ValidationService } from '../../../shared/services/validation.service';
import { AuthService } from '../../../core/services/auth/auth.service';

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
  showMessage = false;
  messageText = '';

  newProject: Project = {
    title: '',
    description: '',
    projectType: 'Académico',
    participation: '', 
    technologies: '',
    repositoryUrl: '', 
    demoUrl: '',
    imageUrl: 'https://via.placeholder.com/300'
  };

  currentUser = this.authService.currentUser(); 

  ngOnInit() {
  if (this.currentUser) {
    this.newProject.programmerName = this.currentUser.email;
    this.loadProjects();
  }
}

  loadProjects() {
    this.projectService.getMyProjects().subscribe({
      next: (res: any) => {
        this.projects = res.content || res; 
        this.cd.detectChanges();
      },
      error: (err) => console.error('Error cargando proyectos', err)
    });
  }

  showCenteredMessage(text: string) {
    this.messageText = text;
    this.showMessage = true;
    setTimeout(() => this.showMessage = false, 2500);
  }

  validateForm(): string | null {
    if (!this.newProject.title.trim())
      return 'El nombre del proyecto es obligatorio.';

    if (!this.newProject.description.trim())
      return 'La descripción es obligatoria.';

    if (!this.newProject.participation.trim())
      return 'La participación/rol es obligatorio.';

    if (!this.newProject.technologies.trim())
      return 'Las tecnologías son obligatorias.';

    if (this.newProject.repositoryUrl && !ValidationService.urlValidatorValue(this.newProject.repositoryUrl))
      return 'El enlace del repositorio no es válido.';

    if (this.newProject.demoUrl && !ValidationService.urlValidatorValue(this.newProject.demoUrl))
      return 'El enlace de la demo no es válido.';

    return null;
  }

  add() {
    const error = this.validateForm();
    if (error) {
      this.showCenteredMessage(error);
      return;
    }

    this.projectService.addProject(this.newProject).subscribe({
      next: () => {
        this.showCenteredMessage('Proyecto añadido exitosamente 🎉');
        this.resetForm();
        this.loadProjects();
      },
      error: (err) => {
        console.error(err);
        this.showCenteredMessage('Error al publicar el proyecto.');
      }
    });
  }

  resetForm() {
    this.newProject = {
      title: '',
      description: '',
      projectType: 'Académico',
      participation: '',
      technologies: '',
      repositoryUrl: '',
      demoUrl: '',
      imageUrl: 'https://via.placeholder.com/300'
    };
  }

  delete(id: string | undefined) {
    if (id && confirm('¿Borrar este proyecto?')) {
      this.projectService.deleteProject(id).subscribe({
        next: () => this.loadProjects(),
        error: (err) => console.error('Error al eliminar', err)
      });
    }
  }
}