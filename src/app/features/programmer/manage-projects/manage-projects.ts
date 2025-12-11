import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Project, ProjectService } from '../../../core/services/project';
import { AuthService } from '../../../core/services/firebase/auth';
import { ValidationService } from '../../../shared/services/validation.service';

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
    programmerId: '',
    authorName: '',
    name: '',
    description: '',
    projectType: 'Académico',
    role: '',
    technologies: '',
    repoUrl: '',
    demoUrl: ''
  };

  currentUser = this.authService.currentUser();

  ngOnInit() {
    if (this.currentUser) {
      this.newProject.programmerId = this.currentUser.uid;
      this.newProject.authorName = (this.currentUser.displayName || this.currentUser.email || '').trim();
      this.loadProjects();
    }
  }

  async loadProjects() {
    if (this.currentUser) {
      this.projects = await this.projectService.getMyProjects(this.currentUser.uid);
      this.cd.detectChanges();
    }
  }

  // Mostrar mensaje modal
  showCenteredMessage(text: string) {
    this.messageText = text;
    this.showMessage = true;
    setTimeout(() => {
      this.showMessage = false;
    }, 2500);
  }

  // VALIDACIONES
  validateForm(): string | null {

    const author = this.newProject.authorName?.trim();

    if (!author)
      return 'El nombre del autor es obligatorio.';

    // No permitir correos
    if (author.includes('@'))
      return 'El nombre del autor no puede ser un correo.';

    if (!ValidationService.onlyLettersValue(author))
      return 'El nombre del autor solo debe contener letras.';

    if (!this.newProject.name.trim())
      return 'El nombre del proyecto es obligatorio.';

    if (!ValidationService.minLengthValue(this.newProject.name, 3))
      return 'El nombre del proyecto debe tener al menos 3 caracteres.';

    if (!this.newProject.description.trim())
      return 'La descripción es obligatoria.';

    if (!this.newProject.role.trim())
      return 'El rol es obligatorio.';

    if (!ValidationService.onlyLettersValue(this.newProject.role))
      return 'El rol debe contener solo letras.';

    if (!this.newProject.technologies.trim())
      return 'Las tecnologías utilizadas son obligatorias.';

    if (this.newProject.repoUrl &&
        !ValidationService.urlValidatorValue(this.newProject.repoUrl))
      return 'El enlace del repositorio debe comenzar con http:// o https://';

    if (this.newProject.demoUrl &&
        !ValidationService.urlValidatorValue(this.newProject.demoUrl))
      return 'El enlace de la demo debe comenzar con http:// o https://';

    return null;
  }

  async add() {
    const error = this.validateForm();

    if (error) {
      this.showCenteredMessage(error);
      return;
    }

    try {
      await this.projectService.addProject(this.newProject);

      this.showCenteredMessage('🚀 Proyecto añadido exitosamente');

      this.newProject = {
        programmerId: this.currentUser?.uid || '',
        authorName: this.currentUser?.displayName?.trim() || '',
        name: '',
        description: '',
        projectType: 'Académico',
        role: '',
        technologies: '',
        repoUrl: '',
        demoUrl: ''
      };

      await this.loadProjects();

    } catch (err) {
      console.error(err);
      this.showCenteredMessage('❌ Error al publicar el proyecto.');
    }
  }

  async delete(id: string) {
    if (confirm('¿Borrar este proyecto?')) {
      await this.projectService.deleteProject(id);
      await this.loadProjects();
    }
  }
}
