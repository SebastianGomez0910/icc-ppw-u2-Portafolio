import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserProfile, UserService } from '../../../../core/services/roles/user-service';
import { AppointmentService, AppointmentSlot } from '../../../../core/services/appointment';
import { AuthService } from '../../../../core/services/firebase/auth';

@Component({
  selector: 'app-request-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './solicitud-appointment.html',
})
export class RequestAppointmentComponent implements OnInit {

  private userService = inject(UserService);
  private appointmentService = inject(AppointmentService);
  public authService = inject(AuthService);
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

  ngOnInit() {
    this.loadProgrammers();
  }

  async loadProgrammers() {
    const allUsers = await this.userService.getAllUsers();
    this.programmers = allUsers.filter(u => u.role === 'programmer');
    this.isLoading = false;
    this.cd.detectChanges();
  }

  async onProgrammerChange() {
    if (!this.selectedProgrammerId) return;
    
    this.isLoadingSlots = true;
    this.allSlots = [];      
    this.filteredSlots = []; 

    try {
      this.allSlots = await this.appointmentService.getAvailableSlots(this.selectedProgrammerId);
      
      this.applyFilters();

    } catch (error) {
      console.error(error);
    } finally {
      this.isLoadingSlots = false;
      this.cd.detectChanges();
    }
  }

  applyFilters() {
    let result = [...this.allSlots];

    if (this.filterDate) {
      result = result.filter(slot => slot.date === this.filterDate);
    }

    if (this.filterTime) {
      result = result.filter(slot => slot.time.includes(this.filterTime));
    }

    this.filteredSlots = result;
    this.cd.detectChanges(); 
  }

  async book(slot: AppointmentSlot) {
    const currentUser = this.authService.currentUser();

    if (confirm(`¿Reservar cita para el ${slot.date} a las ${slot.time}?`)) {
      try {
         const clientName = currentUser?.displayName || currentUser?.email || 'Cliente';
         await this.appointmentService.bookSlot(slot.id!, clientName, this.bookingTopic);
         
         alert('✅ ¡Cita agendada!');
         this.bookingTopic = '';
         await this.onProgrammerChange(); 
         
      } catch (error) {
        console.error(error);
      }
    }
  }
}