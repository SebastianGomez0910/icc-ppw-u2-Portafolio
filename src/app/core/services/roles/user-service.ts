import { inject, Injectable } from '@angular/core';
import { User } from '@angular/fire/auth'; 
import { collection, doc, Firestore, getDoc, getDocs, query, setDoc, updateDoc, where } from '@angular/fire/firestore';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string; 
  photoURL?: string;
  role: 'admin' | 'programmer' | 'user'; 
  requestingProgrammerRole?: boolean;    
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

  async getPendingRequests(): Promise<UserProfile[]> {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('requestingProgrammerRole', '==', true));
    
    const querySnapshot = await getDocs(q);
    const users: UserProfile[] = [];
    
    querySnapshot.forEach((doc) => {
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

  async getUserById(uid: string): Promise<UserProfile | null> {
    const userRef = doc(this.firestore, `users/${uid}`); 
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      return snap.data() as UserProfile;
    } else {
      return null;
    }
  }
}