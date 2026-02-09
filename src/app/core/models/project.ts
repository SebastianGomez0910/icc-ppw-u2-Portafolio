import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

export type ProjectResponse = Project;       
export type CreateProjectDto = Omit<Project, 'id'>; 

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private http = inject(HttpClient);
  
  private apiUrl = 'http://localhost:8080/api/projects';

  private getHeaders() {
    const token = localStorage.getItem('token'); 
    return {
      headers: new HttpHeaders({ 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }

  createProject(project: CreateProjectDto): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, project, this.getHeaders());
  }

  getMyProjects(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/my-projects`, this.getHeaders());
  }

  deleteProject(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.getHeaders());
  }

  getPublicProjects(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/public/${userId}`);
  }

  getAllProjects(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/all`); 
  }
}