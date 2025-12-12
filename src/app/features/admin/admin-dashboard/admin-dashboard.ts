import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, doc, writeBatch } from '@angular/fire/firestore';
import { UserProfile, UserService } from '../../../core/services/roles/user-service';

@Component({
  selector: 'app-admin-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html', 
  styleUrl: './admin-dashboard.css'
})
export class AdminScheduleComponent implements OnInit {

  private firestore = inject(Firestore); 
  private userService = inject(UserService);
  private cd = inject(ChangeDetectorRef);

  programmers: UserProfile[] = []; 
  
  selectedProgrammerId: string = '';
  date: string = '';      
  endDate: string = '';   
  time: string = '';

  isLoading = true;

  ngOnInit() {
    this.loadProgrammers();
  }

  async loadProgrammers() {
    try {
      const allUsers = await this.userService.getAllUsers();
      this.programmers = allUsers.filter(u => u.role === 'programmer');
    } catch (error) {
      console.error('Error cargando usuarios', error);
    } finally {
      this.isLoading = false;
      this.cd.detectChanges();
    }
  }

  async createSchedule() {
    if (!this.selectedProgrammerId || !this.date || !this.time) {
      alert(' Por favor selecciona: Programador, Fecha de inicio y Hora.');
      return;
    }

    this.isLoading = true;

    try {
      const prog = this.programmers.find(p => p.uid === this.selectedProgrammerId);
      const programmerName = prog?.displayName || prog?.email || 'Programador';

      const batch = writeBatch(this.firestore);
      const slotsCollection = collection(this.firestore, 'appointments');

      let currentDate = new Date(this.date + 'T00:00:00');
      
      let finalDate = this.endDate 
        ? new Date(this.endDate + 'T00:00:00') 
        : new Date(this.date + 'T00:00:00');

      if (finalDate < currentDate) {
        alert(' Error: La fecha "Hasta" no puede ser anterior a la fecha "Desde".');
        this.isLoading = false;
        return;
      }

      let count = 0; 

      while (currentDate <= finalDate) {
        
        const dateString = currentDate.toISOString().split('T')[0];
        
        const newDocRef = doc(slotsCollection);

        const data = {
        id: newDocRef.id,
        programmerId: this.selectedProgrammerId,
        programmerName: programmerName,
        date: dateString,
        time: this.time,
        isBooked: false,        
        status: 'available',    
        clientName: null,       
        topic: null,            
        createdAt: new Date()
        };

        batch.set(newDocRef, data);

        currentDate.setDate(currentDate.getDate() + 1);
        count++;
      }

      await batch.commit();

      alert(`✅ ¡Listo! Se crearon ${count} horarios correctamente.`);
      
      this.date = '';
      this.endDate = '';
      this.time = ''; 
      
    } catch (error) {
      console.error(error);
      alert(' Ocurrió un error al crear los horarios.');
    } finally {
      this.isLoading = false;
      this.cd.detectChanges();
    }
  }
}