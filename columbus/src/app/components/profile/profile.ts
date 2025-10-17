import { Component } from '@angular/core';
import { AuthService } from '../../service/auth/auth-service';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Usuario {
  nombre: string;
  email: string;
  rol: string;
  image: string;
  telefono: string;
  fechaRegistro: Date;
}
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [DatePipe, RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  cargando = true;
  usuario: Usuario = {
    nombre: '',
    email: '',
    rol: '',
    image: '',
    telefono: '',
    fechaRegistro: new Date(),
  };

  constructor(private authService: AuthService) {}

  async ngOnInit(): Promise<void> {
    try {
      const user = this.authService.getCurrentUser();

      if (!user) {
        console.warn('No hay usuario autenticado');
        this.cargando = false;
        return;
      }

      this.usuario.image = user.photoURL ?? '/images/gato.jpg';
      this.usuario.email = user.email ?? '';
      this.usuario.nombre = user.displayName ?? 'Sin nombre';

      const rol = await this.authService.getUserRoleFromBackend();
      this.usuario.rol = rol ?? 'Sin rol';

      if (user.metadata?.creationTime) {
        this.usuario.fechaRegistro = new Date(user.metadata.creationTime);
      }
    } catch (error) {
      console.error('Error al cargar el perfil:', error);
    } finally {
      this.cargando = false;
    }
  }

  obtenerInicialesUsuario(): string {
    const nombres = this.usuario.nombre.split(' ');
    return nombres
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }
}
