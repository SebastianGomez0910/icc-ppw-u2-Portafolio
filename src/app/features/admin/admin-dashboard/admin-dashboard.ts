import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserProfile, UserService } from '../../../core/services/roles/user-service';

@Component({
  selector: 'app-admin-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html', 
  styleUrls: ['./admin-dashboard.css']
})
export class AdminScheduleComponent implements OnInit {

  private userService = inject(UserService);
  private cd = inject(ChangeDetectorRef);

  programmers: UserProfile[] = [];
  
  selectedProgrammerId: string = '';
  date: string = '';      
  time: string = '';    
  endDate: string = '';   
  
  durationHours: number = 1; 
  isLoading = true;

  ngOnInit() {
    this.loadProgrammers();
  }

  loadProgrammers() {
    this.userService.getProgrammers().subscribe({
      next: (users) => {
        this.programmers = users;
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando programadores', err);
        this.isLoading = false;
      }
    });
  }

  createSchedule() {
    if (!this.selectedProgrammerId || !this.date || !this.time) {
      alert('Por favor completa todos los campos.');
      return;
    }

    this.isLoading = true;

    const [hours, minutes] = this.time.split(':').map(Number);
    
    const tempDate = new Date();
    tempDate.setHours(hours);
    tempDate.setMinutes(minutes);
    tempDate.setHours(tempDate.getHours() + this.durationHours); 

    const startString = `${this.time}:00`; 
    
    const endHoursStr = tempDate.getHours().toString().padStart(2, '0');
    const endMinutesStr = tempDate.getMinutes().toString().padStart(2, '0');
    const endString = `${endHoursStr}:${endMinutesStr}:00`;

    const scheduleData = {
      date: this.date,       
      startTime: startString, 
      endTime: endString      
    };

    console.log('Enviando al backend:', scheduleData); 

    this.userService.createSchedule(this.selectedProgrammerId, scheduleData).subscribe({
      next: (res) => {
        alert('¡Horario asignado con éxito!');
        this.isLoading = false;
        this.time = ''; 
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error(err);
        alert('Error al crear el horario. Revisa la consola.');
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }
}