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

  enviarWhatsApp(cita: AppointmentSlot, tipo: 'confirmar' | 'rechazar', mensajeExtra: string) {
    let texto = '';
    
    if (tipo === 'confirmar') {
      texto = `Hola ${cita.clientName}, tu asesoría para el ${cita.date} a las ${cita.time} ha sido CONFIRMADA. ${mensajeExtra}`;
    } else {
      texto = `Hola ${cita.clientName}, lamentamos informar que tu asesoría para el ${cita.date} ha sido RECHAZADA. Motivo: ${mensajeExtra}`;
    }

    const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
  }

  enviarCorreo(cita: AppointmentSlot, tipo: 'confirmar' | 'rechazar', mensajeExtra: string) {
    console.log('📧 Intentando enviar correo a:', cita.clientEmail); // <--- CHIVATO EN CONSOLA

    const asunto = tipo === 'confirmar' ? '✅ Cita Confirmada' : '❌ Actualización de tu Cita';
    let cuerpo = '';

    if (tipo === 'confirmar') {
      cuerpo = `Hola ${cita.clientName},\n\nTu cita ha sido confirmada para el ${cita.date} a las ${cita.time}.\n\nMensaje del programador:\n${mensajeExtra}`;
    } else {
      cuerpo = `Hola ${cita.clientName},\n\nTu cita ha sido rechazada.\n\nMotivo:\n${mensajeExtra}`;
    }

    const emailDestino = cita.clientEmail;
    if (!emailDestino) {
        alert('⚠️ Error: Esta cita no tiene un correo guardado. No se puede abrir Gmail.');
        return;
    }
    
    const url = `https://mail.google.com/mail/u/0/?view=cm&fs=1&to=${emailDestino}&su=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
    
    console.log('🔗 Link generado:', url);

    const ventana = window.open(url, '_blank');

    if (!ventana || ventana.closed || typeof ventana.closed == 'undefined') { 
        alert('🚫 El navegador bloqueó la ventana de Gmail. Por favor revisa el icono de "Ventana emergente bloqueada" en la barra de direcciones (arriba a la derecha) y dale permiso.');
    }
  }
  async aceptarCita(slot: AppointmentSlot) {
    let mensajeInput = prompt('Mensaje de confirmación (Opcional):');
    if (mensajeInput === null) return;

    const mensajeFinal = mensajeInput.trim() || '¡Nos vemos pronto!';

    try {
      await this.appointmentService.confirmAppointment(slot.id!, mensajeFinal);
      
      if(confirm('✅ Cita confirmada. ¿Quieres enviar la notificación por WhatsApp ahora?')) {
          this.enviarWhatsApp(slot, 'confirmar', mensajeFinal);
      } 
      
 
      if (confirm('¿Quieres enviar también un Correo de respaldo?')) {
          this.enviarCorreo(slot, 'confirmar', mensajeFinal);
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

      if(confirm('❌ Cita rechazada. ¿Notificar por WhatsApp?')) {
          this.enviarWhatsApp(slot, 'rechazar', motivo);
      } 
      
      if (confirm('¿Enviar notificación por Correo también?')) {
          this.enviarCorreo(slot, 'rechazar', motivo);
      }
      
      this.loadAppointments();

    } catch (error) {
      console.error(error);
      alert('Error al rechazar la cita.');
    }
  }
}