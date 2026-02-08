import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService, AppointmentSlot } from '../../../core/models/appointment';

@Component({
  selector: 'app-programmer-appointments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointments.html', 
  styleUrl: './appointments.css'
})
export class ProgrammerAppointmentsComponent implements OnInit {

  private appointmentService = inject(AppointmentService);
  private cd = inject(ChangeDetectorRef);
  
  appointments: AppointmentSlot[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.isLoading = true;
    this.appointmentService.getProgrammerAppointments().subscribe({
      next: (data) => {
        this.appointments = data;
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando citas:', err);
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  enviarWhatsApp(cita: AppointmentSlot) {
    alert(`SIMULACIÓN: WhatsApp enviado a ${cita.clientName || 'el cliente'}.`);
  }

  enviarCorreo(cita: AppointmentSlot) {
    alert(`SIMULACIÓN: Correo enviado a ${cita.clientName || 'el cliente'}.`);
  }

  aceptarCita(slot: AppointmentSlot) {
    const mensajeInput = prompt('Mensaje de confirmación para el cliente (Opcional):');
    if (mensajeInput === null) return;

    const mensajeFinal = mensajeInput.trim() || '¡Nos vemos pronto!';

    this.appointmentService.confirmAppointment(slot.id, mensajeFinal).subscribe({
      next: () => {
        alert('Cita confirmada en el sistema.');
        
        if(confirm('¿Deseas simular el envío de WhatsApp?')) this.enviarWhatsApp(slot);
        if(confirm('¿Deseas simular el envío de Correo?')) this.enviarCorreo(slot);
        
        this.loadAppointments(); 
      },
      error: (err) => {
        console.error(err);
        alert('Error al confirmar la cita en el servidor.');
      }
    });
  }

  rechazarCita(slot: AppointmentSlot) {
    const motivo = prompt('Motivo del rechazo (obligatorio):');
    if (motivo === null || motivo.trim() === '') {
        alert('Debes escribir un motivo para rechazar.');
        return;
    }
    
    this.appointmentService.rejectAppointment(slot.id, motivo).subscribe({
      next: () => {
        alert('Cita rechazada correctamente.');

        if(confirm('¿Simular aviso por WhatsApp al cliente?')) this.enviarWhatsApp(slot);
        
        this.loadAppointments(); 
      },
      error: (err) => {
        console.error(err);
        alert('Error al rechazar la cita.');
      }
    });
  }
}