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
  private cd = inject(ChangeDetectorRef);
  
  allUsers: UserProfile[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.allUsers = data;
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando usuarios:', err);
        alert('No se pudieron cargar los usuarios. Revisa el token o el backend.');
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  aprobar(user: UserProfile) {
    if (!user.id) {
      alert('Error: El usuario no tiene un ID válido.');
      return;
    }

    if (confirm(`¿Seguro que quieres ascender a ${user.name || user.email} a Programador?`)) {
      this.cambiarRol(user, 'PROGRAMMER');
    }
  }

  cambiarRol(user: UserProfile, nuevoRol: string) {
    if (user.role === 'ADMIN' && nuevoRol !== 'ADMIN') {
      if (!confirm('CUIDADO: Estás a punto de quitarle el rol de Admin. ¿Seguro?')) {
        return;
      }
    }

    this.userService.updateRole(user.id, nuevoRol).subscribe({
      next: () => {
        alert(`Rol actualizado a: ${nuevoRol}`);
        this.loadRequests(); 
      },
      error: (err) => {
        console.error(err);
        alert('Error al actualizar el rol en el servidor.');
      }
    });
  }

  eliminarUsuario(user: UserProfile) {
    const confirmacion = confirm(`¿Estás seguro de ELIMINAR a ${user.email}?\n\nEsta acción es irreversible.`);
    if (!confirmacion) return;

    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        alert('Usuario eliminado correctamente.');
        this.loadRequests();
      },
      error: (err) => {
        console.error(err);
        alert('Error al intentar eliminar el usuario.');
      }
    });
  }
}