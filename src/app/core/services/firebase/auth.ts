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
  
  // Inyectamos la dependencia de Auth de Firebase
  private auth: Auth = inject(Auth);
  private UserService=inject(UserService);
  
  // Signal para guardar el usuario actual 
  currentUser = signal<User | null>(null);
  
  // Observable que escucha el estado de la sesión
  user$ = user(this.auth);

  constructor() {
    this.user$.subscribe(async (user) => {
      this.currentUser.set(user);
      // SI HAY USUARIO, LO GUARDAMOS EN FIRESTORE
      if (user) {
        await this.UserService.saveUserProfile(user);
      }
    });
  }

  /**
   * Registrar nuevo usuario con email y password
   */
  register(email: string, password: string): Observable<any> {
    const promise = createUserWithEmailAndPassword(this.auth, email, password);
    return from(promise); 
  }

  /**
   * Login con email y password
   */
  login(email: string, password: string): Observable<any> {
    const promise = signInWithEmailAndPassword(this.auth, email, password);
    return from(promise);
  }

  /**
   * Login con Google 
   */
  loginWithGoogle(): Observable<any> {
    const provider = new GoogleAuthProvider();
    // signInWithPopup abre la ventana modal de Google
    const promise = signInWithPopup(this.auth, provider);
    return from(promise);
  }

  /**
   * Cerrar sesión
   */
  logout(): Observable<void> {
    const promise = signOut(this.auth);
    return from(promise);
  }

  /**
   * Verificar si hay un usuario autenticado (Helper)
   */
  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }
}