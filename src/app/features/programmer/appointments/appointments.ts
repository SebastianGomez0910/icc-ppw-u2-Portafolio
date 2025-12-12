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
  enviarWhatsApp(cita: AppointmentSlot) {
    alert(`📱 SIMULACIÓN: Notificación por WhatsApp enviada correctamente a ${cita.clientName}.`);
  }

  enviarCorreo(cita: AppointmentSlot) {
    alert(`📧 SIMULACIÓN: Correo electrónico enviado a ${cita.clientEmail || 'el cliente'}.`);
  }


  async aceptarCita(slot: AppointmentSlot) {
    let mensajeInput = prompt('Mensaje de confirmación (Opcional):');
    if (mensajeInput === null) return;

    const mensajeFinal = mensajeInput.trim() || '¡Nos vemos pronto!';

    try {
      await this.appointmentService.confirmAppointment(slot.id!, mensajeFinal);
      
      if(confirm(' Cita confirmada en el sistema. ¿Simular envío de notificación por WhatsApp?')) {
          this.enviarWhatsApp(slot);
      } 
      
      if (confirm('¿Simular también envío por Correo?')) {
          this.enviarCorreo(slot);
      }
      
      this.loadAppointments();

    } catch (error) {
      console.error(error);
      alert('Error al confirmar la cita.');
    }
  }

  async rechazarCita(slot: AppointmentSlot) {
    const motivo = prompt('Motivo del rechazo:');
    if (motivo === null) return;
    if (motivo.trim() === '') {
        alert('Debes escribir un motivo.');
        return;
    }
    
    try {
      await this.appointmentService.rejectAppointment(slot.id!, motivo);

      if(confirm(' Cita rechazada. ¿Simular aviso por WhatsApp?')) {
          this.enviarWhatsApp(slot);
      } 
      
      if (confirm('¿Simular aviso por Correo?')) {
          this.enviarCorreo(slot);
      }
      
      this.loadAppointments();

    } catch (error) {
      console.error(error);
      alert('Error al rechazar la cita.');
    }
  }
}