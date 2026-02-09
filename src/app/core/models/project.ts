import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Project {
  id?: string;
  title: string;         
  projectType: string;   
  description: string;
  participation: string; 
  technologies: string;
  repositoryUrl?: string; 
  demoUrl?: string;
  imageUrl?: string;     
  programmerName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private http = inject(HttpClient);
  
  private apiUrl = 'http://localhost:8080/api/projects';

  addProject(project: Project): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, project);
  }

  getMyProjects(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/my-projects`);
  }

  deleteProject(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getPublicProjects(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/public/${userId}`);
  }

  getAllProjects(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/all`); 
  }
}