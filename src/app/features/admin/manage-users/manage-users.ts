import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, UserProfile } from '../../../core/services/roles/user-service';


@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-users.html',
  styleUrl: './manage-users.css',
})
export class ManageUsers implements OnInit {

  private userService = inject(UserService);
  private cd=inject(ChangeDetectorRef)
  
  allUsers: UserProfile[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadRequests();
  }

  async loadRequests() {
    console.log('--- INICIANDO CARGA DE SOLICITUDES ---');
    this.isLoading = true;

    try {
      // 1. Llamamos al servicio
      console.log('Consultando a Firebase...');
      this.allUsers = await this.userService.getAllUsers();
      
      // 2. Vemos qué llegó
      console.log('Respuesta recibida. Usuarios encontrados:', this.allUsers.length);
      console.log('Datos:', this.allUsers);

    } catch (error) {
      // 3. Si falla, nos dirá por qué
      console.error('ERROR GRAVE cargando usuarios:', error);
      alert('Error al leer datos. Revisa la consola.');
    } finally {
      // 4. Terminamos
      this.isLoading = false;
      console.log('--- FIN DEL PROCESO (isLoading = false) ---');
      this.cd.detectChanges(); //
    }
  }

  async aprobar(user: UserProfile) {
    console.log('--- INTENTO DE APROBAR ---');
    console.log('Usuario seleccionado:', user);
    console.log('UID del usuario:', user.uid);

    if (!user.uid) {
      console.error('ERROR CRÍTICO: El usuario no tiene UID (Identificador). No se puede actualizar.');
      alert('Error: Este usuario no tiene ID válido.');
      return;
    }

    if(confirm(`¿Seguro que quieres aprobar a ${user.email}?`)) {
      try {
        console.log('Enviando actualización a Firebase...');
        await this.userService.approveProgrammer(user.uid);
        
        console.log('¡Éxito en Firebase! Recargando lista...');
        this.loadRequests();
        alert('¡Usuario ascendido a Programador exitosamente!');
        this.loadRequests();
        
      } catch (error) {
        console.error('ERROR AL ACTUALIZAR EN FIREBASE:', error);
        alert('Hubo un error al guardar. Revisa la consola (F12).');

      }
    } else {
      console.log('Cancelado por el administrador.');
    }
  }

  async cambiarRol(user: UserProfile, nuevoRol: 'admin' | 'programmer' | 'user') {
    // Protección para no quitarte el admin a ti mismo por error
    if (user.role === 'admin' && nuevoRol !== 'admin') {
      if (!confirm('⚠️ CUIDADO: Estás a punto de quitarle el rol de Admin a este usuario. ¿Seguro?')) {
        return;
      }
    }

    try {
      await this.userService.updateRole(user.uid, nuevoRol);
      alert(`Rol actualizado a: ${nuevoRol.toUpperCase()}`);
      this.loadRequests(); // Recargamos la lista para ver el cambio
    } catch (error) {
      console.error(error);
      alert('Error al actualizar rol');
    }
  }

  async eliminarUsuario(user: UserProfile) {
    const confirmacion = confirm(`⚠️ ¿Estás seguro de ELIMINAR a ${user.email}?\n\nEsta acción no se puede deshacer.`);
    
    if (!confirmacion) return;

    try {
      await this.userService.deleteUser(user.uid);
      
      alert('🗑️ Usuario eliminado correctamente.');
      
      this.loadRequests();
      
    } catch (error) {
      console.error(error);
      alert('Error al eliminar el usuario.');
    }
  }
}
