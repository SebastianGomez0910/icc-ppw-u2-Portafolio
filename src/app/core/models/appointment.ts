import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AppointmentSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  programmerName?: string;
  clientName?: string;
  topic?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api'; 

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    };
  }

  getAvailableSlots(programmerId: string): Observable<AppointmentSlot[]> {
    return this.http.get<AppointmentSlot[]>(`${this.apiUrl}/schedules/programmer/${programmerId}/available`, this.getHeaders());
  }

  bookSlot(scheduleId: string, topic: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/appointments/book/${scheduleId}`, { topic }, this.getHeaders());
  }

  getMyAppointments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/appointments/my-appointments`, this.getHeaders());
  }

  getProgrammerAppointments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/appointments/programmer`, this.getHeaders());
  }

  confirmAppointment(appointmentId: string, message: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/appointments/${appointmentId}/confirm`, { message }, this.getHeaders());
  }

  rejectAppointment(appointmentId: string, reason: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/appointments/${appointmentId}/reject`, { reason }, this.getHeaders());
  }
}