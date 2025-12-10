import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../../../core/services/appointment';
import { UserProfile, UserService } from '../../../core/services/roles/user-service';

@Component({
  selector: 'app-admin-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminScheduleComponent implements OnInit {

  private userService = inject(UserService);
  private appointmentService = inject(AppointmentService);
  private cd = inject(ChangeDetectorRef);

  programmers: UserProfile[] = []; 
  
  selectedProgrammerId: string = '';
  date: string = '';
  time: string = '';

  isLoading = true;

  ngOnInit() {
    this.loadProgrammers();
  }

  async loadProgrammers() {
    const allUsers = await this.userService.getAllUsers();
    
    this.programmers = allUsers.filter(u => u.role === 'programmer');
    
    this.isLoading = false;
    this.cd.detectChanges();
  }

  async createSchedule() {
    if (!this.selectedProgrammerId || !this.date || !this.time) {
      alert('Por favor completa todos los campos');
      return;
    }

    const prog = this.programmers.find(p => p.uid === this.selectedProgrammerId);

    try {
      await this.appointmentService.addAvailability({
        programmerId: this.selectedProgrammerId,
        programmerName: prog?.displayName || 'Programador',
        date: this.date,
        time: this.time,
        isBooked: false 
      });

      alert('✅ Horario creado correctamente');
      
      this.time = ''; 
      
    } catch (error) {
      console.error(error);
      alert('Error al crear el horario');
    }
  }
}