import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project, ProjectService } from '../../../../core/models/project';
import { UserService } from '../../../../core/services/roles/user-service';

import { forkJoin } from 'rxjs'; 

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

  loadData() {
    forkJoin({
      projects: this.projectService.getAllProjects(), 
      users: this.userService.getProgrammers() 
    }).subscribe({
      next: (res) => {
        this.projects = res.projects;

        res.users.forEach(user => {
          this.authorNames[user.id] = user.name || 'Programador';
        });

        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando datos públicos:', err);
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }
}