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

  aceptarCita(cita: any) {
    this.appointmentService.updateStatus(cita.id, 'ACCEPTED').subscribe({
      next: () => {
        console.log('Cita aceptada y correo real enviado vía Backend');
        this.loadAppointments(); 
      },
      error: (err) => {
        console.error(err);
        alert('Error al aceptar la cita.');
      }
    });
  }

  rechazarCita(cita: any) {
    if (!confirm('¿Estás seguro de que deseas rechazar esta cita?')) return;

    this.appointmentService.updateStatus(cita.id, 'REJECTED').subscribe({
      next: () => {
        console.log('Cita rechazada, horario liberado y correo enviado');
        this.loadAppointments(); 
      },
      error: (err) => {
        console.error(err);
        alert('Error al rechazar la cita.');
      }
    });
  }
}