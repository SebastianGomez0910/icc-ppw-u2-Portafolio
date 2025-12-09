import { inject, Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, where, getDocs, updateDoc, doc, deleteDoc, orderBy } from '@angular/fire/firestore';

export interface AppointmentSlot {
  id?: string;
  programmerId: string;
  programmerName: string;
  date: string;       // Guardaremos como string simple por facilidad: "2023-12-25"
  time: string;       // "10:00"
  isBooked: boolean;  // Estado del cupo
  clientName?: string;
  topic?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private firestore = inject(Firestore);

  // --- 1. FUNCIONES PARA EL ADMINISTRADOR ---

  // El Admin crea un hueco de tiempo para un programador
  async addAvailability(slot: AppointmentSlot) {
    const slotsRef = collection(this.firestore, 'appointments');
    return addDoc(slotsRef, slot);
  }

  // El Admin puede ver todos los horarios creados
  async getAllSlots() {
    const slotsRef = collection(this.firestore, 'appointments');
    const q = query(slotsRef, orderBy('date')); // Ordenados por fecha
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({id: doc.id, ...doc.data() as any}));
  }
  
  // El Admin borra un horario si se equivocó
  deleteSlot(id: string) {
    const docRef = doc(this.firestore, `appointments/${id}`);
    return deleteDoc(docRef);
  }

  // --- 2. FUNCIONES PARA EL USUARIO (CLIENTE) ---

  // Buscar horarios DISPONIBLES de un programador específico
  async getAvailableSlots(programmerId: string) {
    const slotsRef = collection(this.firestore, 'appointments');
    // Dame los que sean de ESTE programador Y que NO estén ocupados
    const q = query(
      slotsRef, 
      where('programmerId', '==', programmerId),
      where('isBooked', '==', false)
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({id: doc.id, ...doc.data() as any}));
  }

  // Reservar (Actualizar el cupo con los datos del cliente)
  bookSlot(slotId: string, clientName: string, topic: string) {
    const docRef = doc(this.firestore, `appointments/${slotId}`);
    return updateDoc(docRef, {
      isBooked: true,      // ¡Ahora está ocupado!
      clientName: clientName,
      topic: topic
    });
  }

  // --- 3. FUNCIONES PARA EL PROGRAMADOR ---

  // Ver MIS citas (las que ya me reservaron)
  async getMyAppointments(programmerId: string) {
    const slotsRef = collection(this.firestore, 'appointments');
    const q = query(
      slotsRef, 
      where('programmerId', '==', programmerId),
      where('isBooked', '==', true) // Solo las que ya tienen cliente
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({id: doc.id, ...doc.data() as any}));
  }
}