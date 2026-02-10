import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/environment';

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
  private apiUrl = `${environment.apiUrl}`;

  private getHeaders() {
    const token = localStorage.getItem('token'); 
    return {
      headers: new HttpHeaders({ 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' 
      })
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

  getIncomingAppointments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/appointments/incoming`, this.getHeaders());
  }

  updateStatus(appointmentId: string, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/appointments/${appointmentId}/status`, { status }, this.getHeaders());
  }
  getAppointmentSummary() {
  return this.http.get<any>(
    `${environment.apiUrl}/appointments/summary`
  );
}

}