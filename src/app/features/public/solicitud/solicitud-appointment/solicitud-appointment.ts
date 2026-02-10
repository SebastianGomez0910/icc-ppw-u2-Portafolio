import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { UserProfile, UserService } from '../../../../core/services/roles/user-service';
import { AppointmentService, AppointmentSlot } from '../../../../core/models/appointment';

@Component({
  selector: 'app-request-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './solicitud-appointment.html',
})
export class RequestAppointmentComponent implements OnInit {

  private userService = inject(UserService);
  private appointmentService = inject(AppointmentService);
  private cd = inject(ChangeDetectorRef);

  programmers: UserProfile[] = [];

  allSlots: AppointmentSlot[] = [];
  filteredSlots: AppointmentSlot[] = [];

  selectedProgrammerId: string = '';
  bookingTopic: string = '';
  filterDate: string = '';
  filterTime: string = '';

  isLoading = true;
  isLoadingSlots = false;
  isLoggedIn = false;

  ngOnInit() {
    this.isLoggedIn = !!localStorage.getItem('token');
    this.loadProgrammers();
  }

  loadProgrammers() {
    this.userService.getProgrammers().subscribe({
      next: (users) => {
        this.programmers = users;
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err: any) => {
        console.error('Error cargando programadores', err);
        this.isLoading = false;
      }
    });
  }

  onProgrammerChange() {
    if (!this.selectedProgrammerId) return;

    this.isLoadingSlots = true;
    this.allSlots = [];
    this.filteredSlots = [];

    this.appointmentService.getAvailableSlots(this.selectedProgrammerId).subscribe({
      next: (slots) => {
        this.allSlots = slots;
        this.applyFilters();
        this.isLoadingSlots = false;
        this.cd.detectChanges();
      },
      error: (err: any) => {
        console.error('Error cargando horarios', err);
        this.isLoadingSlots = false;
      }
    });
  }

  applyFilters() {
    let result = [...this.allSlots];

    if (this.filterDate) {
      result = result.filter(slot => slot.date === this.filterDate);
    }

    if (this.filterTime) {
      result = result.filter(slot => slot.startTime.includes(this.filterTime));
    }

    this.filteredSlots = result;
    this.cd.detectChanges();
  }

  book(slot: AppointmentSlot) {
    if (!this.bookingTopic || this.bookingTopic.trim() === '') {
      alert('Por favor escribe el motivo de la asesoría antes de reservar.');
      return;
    }

    if (confirm(`¿Confirmar cita?\n\nFecha: ${slot.date}\nHora: ${slot.startTime}`)) {
      this.appointmentService
        .bookSlot(slot.id, this.bookingTopic)
        .subscribe({
          next: () => {
            alert('¡Reservado! Tu cita ha sido agendada con éxito.');
            this.bookingTopic = '';
            this.onProgrammerChange();
          },
          error: (err: any) => {
            console.error(err);
            alert('Error: No se pudo reservar.');
          }
        });
    }
  }
}
