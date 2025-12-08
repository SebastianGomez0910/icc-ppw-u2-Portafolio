import { inject, Injectable } from '@angular/core';
import { User } from '@angular/fire/auth'; // <--- OJO: Quité UserProfile de aquí
import { collection, doc, Firestore, getDoc, getDocs, query, setDoc, updateDoc, where } from '@angular/fire/firestore';

// 1. DEFINIMOS TU INTERFAZ CORRECTA (Y la exportamos)
export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string; // Corregido: displayNmae -> displayName
  photoURL?: string;
  role: 'admin' | 'programmer' | 'user'; // Unificado a inglés: 'programmer'
  requestingProgrammerRole?: boolean;    // Unificado a inglés y opcional
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private firestore = inject(Firestore);

  async saveUserProfile(user: User) {
    const userRef = doc(this.firestore, `users/${user.uid}`);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // SI ES NUEVO
      const newUser: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Usuario',
        photoURL: user.photoURL || '',
        role: 'user', 
        requestingProgrammerRole: false
      };
      return setDoc(userRef, newUser);
    } else {
      // SI YA EXISTE (Actualizamos datos básicos)
      return updateDoc(userRef, {
        displayName: user.displayName,
        photoURL: user.photoURL,
        email: user.email
      });
    }
  }

  requestProgrammerRole(uid: string) {
    const userRef = doc(this.firestore, `users/${uid}`);
    return updateDoc(userRef, {
      requestingProgrammerRole: true 
    });
  }

  // Ahora esta función usa TU interfaz UserProfile, no la de Firebase
  async getPendingRequests(): Promise<UserProfile[]> {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('requestingProgrammerRole', '==', true));
    
    const querySnapshot = await getDocs(q);
    const users: UserProfile[] = [];
    
    querySnapshot.forEach((doc) => {
      // Forzamos el tipo a UserProfile
      users.push(doc.data() as UserProfile);
    });
    
    return users;
  }

  approveProgrammer(uid: string) {
    const userRef = doc(this.firestore, `users/${uid}`);
    return updateDoc(userRef, {
      role: 'programmer',              
      requestingProgrammerRole: false  
    });
  }
 
  rejectRequest(uid: string) {
    const userRef = doc(this.firestore, `users/${uid}`);
    return updateDoc(userRef, {
      requestingProgrammerRole: false 
    });
  }

  async getUserById(uid:string):Promise<UserProfile | null >{
    const userRef= doc(this.firestore, `users/{uid}`);
    const snap=await getDoc(userRef);

    if(snap.exists()){
      return snap.data() as UserProfile
    }
    else {
      return null;
    }
  }
}