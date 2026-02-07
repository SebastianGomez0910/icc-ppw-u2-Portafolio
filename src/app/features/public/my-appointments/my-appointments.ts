import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/firebase/auth';
import { AppointmentService, AppointmentSlot } from '../../../core/models/appointment';

@Component({
  selector: 'app-my-appointments',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-appointments.html',
  styleUrl: './my-appointments.css',
})
export class MyAppointments implements OnInit{
  private authService = inject(AuthService);
  private appointmentService = inject(AppointmentService);

  myAppointments: AppointmentSlot[] = [];
  isLoading = true;

  async ngOnInit(){
    const user = this.authService.currentUser();
    if(user){
      this.myAppointments=await this.appointmentService.getClientAppointments(user.uid);
    }
    this.isLoading = false;
  }

  getStatusClass(status: string | undefined): string {
    switch (status) {
      case 'confirmed': return 'badge-success text-white';
      case 'rejected': return 'badge-error text-white';    
      default: return 'badge-warning';                     
    }
  }

  translateStatus(status: string | undefined): string {
    switch (status) {
      case 'confirmed': return 'Aceptada';
      case 'rejected': return 'Rechazada';
      default: return 'Pendiente';
    }
  }
}
