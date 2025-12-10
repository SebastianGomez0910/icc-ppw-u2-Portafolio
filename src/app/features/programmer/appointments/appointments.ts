import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/firebase/auth';
import { AppointmentService, AppointmentSlot } from '../../../core/services/appointment';

@Component({
  selector: 'app-programmer-appointments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointments.html', 
  styleUrl: './appointments.css'
})
export class ProgrammerAppointmentsComponent implements OnInit {

  private appointmentService = inject(AppointmentService);
  public authService = inject(AuthService);
  private cd = inject(ChangeDetectorRef);
  
  appointments: AppointmentSlot[] = [];
  isLoading = true;

  async ngOnInit() {
    this.loadAppointments();
  }

  async loadAppointments() {
    const user = this.authService.currentUser();
    if (user) {
      this.appointments = await this.appointmentService.getMyAppointments(user.uid);
      this.isLoading = false;
      this.cd.detectChanges();
    }
  }

  async aceptarCita(slot: AppointmentSlot) {
    let mensaje = prompt('Escribe un mensaje de confirmación para el cliente (Opcional):');
    
    if (mensaje === null) return;

    if (mensaje.trim() === '') {
      mensaje = '¡Asesoría confirmada! Nos vemos en la fecha acordada.';
    }

    try {
 
      await this.appointmentService.confirmAppointment(slot.id!, mensaje);
      
      alert(' Cita confirmada y mensaje enviado.');
      this.loadAppointments(); 
      
    } catch (error) {
      console.error(error);
      alert('Error al confirmar');
    }
  }

  async rechazarCita(slot: AppointmentSlot) {
    const motivo = prompt('Por favor escribe el motivo del rechazo:');
    
    if (motivo === null) return; 
    
    if (motivo.trim() === '') {
      alert('Debes escribir un motivo para rechazar.');
      return;
    }

    try {
      await this.appointmentService.rejectAppointment(slot.id!, motivo);
      alert(' Cita rechazada.');
      this.loadAppointments();
    } catch (error) {
      console.error(error);
      alert('Error al rechazar');
    }
  }
}