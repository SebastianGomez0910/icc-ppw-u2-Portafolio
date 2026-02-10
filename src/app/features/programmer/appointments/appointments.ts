import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../../core/models/appointment';


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
  
  appointments: any[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.isLoading = true;
    
    this.appointmentService.getIncomingAppointments().subscribe({
      next: (data) => {
        this.appointments = data;
        console.log('Citas cargadas:', data); 
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

  enviarWhatsApp(cita: any) {
    const nombreCliente = cita.client ? cita.client.name : 'el cliente';
    alert(`SIMULACIÓN: WhatsApp enviado a ${nombreCliente}.`);
  }

  enviarCorreo(cita: any) {
    const nombreCliente = cita.client ? cita.client.name : 'el cliente';
    alert(`SIMULACIÓN: Correo enviado a ${nombreCliente}.`);
  }

  aceptarCita(cita: any) {
    const mensajeInput = prompt('Mensaje de confirmación para el cliente (Opcional):');
    if (mensajeInput === null) return; 

    this.appointmentService.updateStatus(cita.id, 'ACCEPTED').subscribe({
      next: () => {
        alert(' Cita aceptada en el sistema.');
        
        if(confirm('¿Deseas simular el envío de WhatsApp?')) this.enviarWhatsApp(cita);
        if(confirm('¿Deseas simular el envío de Correo?')) this.enviarCorreo(cita);
        
        this.loadAppointments();
      },
      error: (err) => {
        console.error(err);
        alert('rror al aceptar la cita.');
      }
    });
  }

  rechazarCita(cita: any) {
    const motivo = prompt('Motivo del rechazo (para simulación de WhatsApp):');
    if (motivo === null || motivo.trim() === '') {
        alert('Debes escribir un motivo para rechazar.');
        return;
    }
    
    this.appointmentService.updateStatus(cita.id, 'REJECTED').subscribe({
      next: () => {
        alert('Cita rechazada y horario liberado.');

        if(confirm('¿Simular aviso por WhatsApp al cliente con el motivo?')) this.enviarWhatsApp(cita);
        
        this.loadAppointments(); 
      },
      error: (err) => {
        console.error(err);
        alert('Error al rechazar la cita.');
      }
    });
  }
}