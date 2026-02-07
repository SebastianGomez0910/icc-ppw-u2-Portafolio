import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project, ProjectService } from '../../../../core/models/project';
import { UserService } from '../../../../core/services/roles/user-service';

@Component({
  selector: 'app-public-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-public.html',
  
})
export class PublicProjectsComponent implements OnInit {

  private projectService = inject(ProjectService);
  private userService = inject(UserService);
  private cd = inject(ChangeDetectorRef);

  projects: Project[] = [];
  
  authorNames: { [key: string]: string } = {}; 
  
  isLoading = true;

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    try {
      const [allProjects, allUsers] = await Promise.all([
        this.projectService.getAllProjects(),
        this.userService.getAllUsers()
      ]);

      this.projects = allProjects;

      allUsers.forEach(user => {
        this.authorNames[user.uid] = user.displayName || 'Programador';
      });

    } catch (error) {
      console.error('Error cargando proyectos:', error);
    } finally {
      this.isLoading = false;
      this.cd.detectChanges();
    }
  }
}