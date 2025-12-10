import { inject, Injectable, signal } from '@angular/core';
import { 
  Auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  user, 
  User, 
  GoogleAuthProvider, 
  signInWithPopup 
} from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { UserService } from '../roles/user-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  private auth: Auth = inject(Auth);
  private UserService=inject(UserService);
  
  currentUser = signal<User | null>(null);
  
  user$ = user(this.auth);

  constructor() {
    this.user$.subscribe(async (user) => {
      this.currentUser.set(user);
      if (user) {
        await this.UserService.saveUserProfile(user);
      }
    });
  }

  register(email: string, password: string): Observable<any> {
    const promise = createUserWithEmailAndPassword(this.auth, email, password);
    return from(promise); 
  }

  login(email: string, password: string): Observable<any> {
    const promise = signInWithEmailAndPassword(this.auth, email, password);
    return from(promise);
  }

  loginWithGoogle(): Observable<any> {
    const provider = new GoogleAuthProvider();
    const promise = signInWithPopup(this.auth, provider);
    return from(promise);
  }

  logout(): Observable<void> {
    const promise = signOut(this.auth);
    return from(promise);
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }
}