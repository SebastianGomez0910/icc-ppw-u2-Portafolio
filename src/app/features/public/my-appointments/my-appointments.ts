import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppointmentService, AppointmentSlot } from '../../../core/models/appointment';

@Component({
  selector: 'app-my-appointments',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-appointments.html',
  styleUrl: './my-appointments.css',
})
export class MyAppointments implements OnInit {
  
  private appointmentService = inject(AppointmentService);
  private cd = inject(ChangeDetectorRef);

  myAppointments: AppointmentSlot[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadMyAppointments();
  }

  loadMyAppointments() {
    this.appointmentService.getClientAppointments().subscribe({
      next: (appointments) => {
        this.myAppointments = appointments;
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error al obtener tus citas:', err);
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  getStatusClass(status: string | undefined): string {
    const s = status?.toUpperCase();
    switch (s) {
      case 'CONFIRMED': return 'badge-success text-white';
      case 'REJECTED':  return 'badge-error text-white';    
      default:          return 'badge-warning';                      
    }
  }

  translateStatus(status: string | undefined): string {
    const s = status?.toUpperCase();
    switch (s) {
      case 'CONFIRMED': return 'Aceptada';
      case 'REJECTED':  return 'Rechazada';
      default:          return 'Pendiente';
    }
  }
}