import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserProfile {
  id: string;        
  name: string;       
  email: string;
  role: string;       
  password?: string;  
  photoURL?: string;   
  githubUrl?: string;
  specialty?: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private http = inject(HttpClient);
  
  // URLs base
  private apiUrl = 'http://localhost:8080/api/users';
  private scheduleUrl = 'http://localhost:8080/api/schedules';

  getAllUsers(): Observable<UserProfile[]> {
    return this.http.get<UserProfile[]>(this.apiUrl);
  }

  updateRole(userId: string, newRole: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}/role`, { role: newRole });
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}`);
  }

  getProgrammers(): Observable<UserProfile[]> {
    return this.http.get<UserProfile[]>(`${this.apiUrl}/programmers`);
  }

  getUserById(userId: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/${userId}`);
  }

  createSchedule(userId: string, scheduleData: { startTime: string; endTime: string }): Observable<any> {
    return this.http.post(`${this.scheduleUrl}/${userId}`, scheduleData);
  }
}