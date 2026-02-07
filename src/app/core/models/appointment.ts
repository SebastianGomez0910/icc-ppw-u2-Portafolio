import { inject, Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, where, getDocs, updateDoc, doc, deleteDoc, orderBy } from '@angular/fire/firestore';

export interface AppointmentSlot {
  id?: string;
  programmerId: string;
  programmerName: string;
  date: string;
  time: string;
  isBooked: boolean;
  clientName?: string;
  topic?: string;
  status?: 'pending' | 'confirmed' | 'rejected'; 
  rejectionReason?: string;                      
  confirmationMessage?: string;
  clientId?: string;    
  clientEmail?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private firestore = inject(Firestore);

  async addAvailability(slot: AppointmentSlot) {
    const slotsRef = collection(this.firestore, 'appointments');
    return addDoc(slotsRef, { ...slot, status: 'pending' }); 
  }

  async getAllSlots() {
    const slotsRef = collection(this.firestore, 'appointments');
    const q = query(slotsRef, orderBy('date'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({id: doc.id, ...doc.data() as any}));
  }
  
  deleteSlot(id: string) {
    const docRef = doc(this.firestore, `appointments/${id}`);
    return deleteDoc(docRef);
  }

  async getAvailableSlots(programmerId: string) {
    const slotsRef = collection(this.firestore, 'appointments');
    const q = query(
      slotsRef, 
      where('programmerId', '==', programmerId),
      where('isBooked', '==', false)
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({id: doc.id, ...doc.data() as any}));
  }

  bookSlot(slotId: string, clientName: string, clientEmail: string, clientId: string, topic: string) {
    const docRef = doc(this.firestore, `appointments/${slotId}`);
    return updateDoc(docRef, {
      isBooked: true,
      clientName: clientName,
      clientEmail: clientEmail, 
      clientId: clientId,
      topic: topic,
      status: 'pending' 
    });
  }

  async getMyAppointments(programmerId: string) {
    const slotsRef = collection(this.firestore, 'appointments');
    const q = query(
      slotsRef, 
      where('programmerId', '==', programmerId),
      where('isBooked', '==', true)
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({id: doc.id, ...doc.data() as any}));
  }

  confirmAppointment(slotId: string, message: string) {
    const docRef = doc(this.firestore, `appointments/${slotId}`);
    return updateDoc(docRef, {
      status: 'confirmed',
      confirmationMessage: message 
    });
  }

  rejectAppointment(slotId: string, reason: string) {
    const docRef = doc(this.firestore, `appointments/${slotId}`);
    return updateDoc(docRef, {
      status: 'rejected',
      rejectionReason: reason
    });
  }

  async getClientAppointments(clientId: string) {
    const slotsRef = collection(this.firestore, 'appointments');
    const q = query(slotsRef, where('clientId', '==', clientId));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({id: doc.id, ...doc.data() as any}));
  }
}