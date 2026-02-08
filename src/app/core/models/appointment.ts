import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface AppointmentSlot {
  id: string;
  programmerId?: string; 
  programmerName?: string;
  date: string;          
  time: string;          
  isBooked: boolean;
  
  clientName?: string;
  topic?: string;
  status?: 'PENDING' | 'CONFIRMED' | 'REJECTED'; 
  rejectionReason?: string;
  confirmationMessage?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private apiUrl = 'http://localhost:8080/api/schedules';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    };
  }

  getAvailableSlots(programmerId: string): Observable<AppointmentSlot[]> {
    return this.http.get<AppointmentSlot[]>(
      `${this.apiUrl}/available/${programmerId}`, 
      this.getHeaders()
    );
  }

  bookSlot(slotId: string, topic: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/${slotId}/book`, 
      { topic: topic }, 
      this.getHeaders()
    );
  }

  getClientAppointments(): Observable<AppointmentSlot[]> {
    return this.http.get<AppointmentSlot[]>(`${this.apiUrl}/client`, this.getHeaders());
  }

  getProgrammerAppointments(): Observable<AppointmentSlot[]> {
    return this.http.get<AppointmentSlot[]>(`${this.apiUrl}/programmer`, this.getHeaders());
  }

  confirmAppointment(slotId: string, message: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/${slotId}/confirm`, 
      { message: message }, 
      this.getHeaders()
    );
  }

  rejectAppointment(slotId: string, reason: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/${slotId}/reject`, 
      { reason: reason }, 
      this.getHeaders()
    );
  }
}