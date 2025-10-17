import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth/auth-service';
import { ClaseService, Clase } from '../../service/clases/clase-service';
import { signal } from '@angular/core';

@Component({
  selector: 'app-mostrar-clases',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mostrar-clases.html',
  styleUrl: './mostrar-clases.css',
})
export class MostrarClases implements OnInit {
  private authService = inject(AuthService);
  private claseService = inject(ClaseService);

  // Señales para el estado
  loadingClases = signal<Record<string, boolean>>({});
  usuarioRegistrado = signal<Record<string, boolean>>({});
  errorMessages = signal<Record<string, string>>({});

  /**
   * Getter para obtener las clases del servicio
   */
  get data(): Clase[] {
    return this.claseService.clases();
  }


  ngOnInit() {
  this.claseService.cargarClases().subscribe({
    error: err => console.error('Error cargando clases', err)
  });
}


  /**
   * Actualiza el estado de registro del usuario en cada clase
   */
  private actualizarEstadoRegistros(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    const clases = this.data;
    const estado: Record<string, boolean> = {};

    clases.forEach((clase) => {
      if (clase.id) {
        estado[clase.id] = (clase.participantesId || []).includes(user.uid);
      }
    });

    this.usuarioRegistrado.set(estado);
  }

  /**
   * Obtiene el usuario actual
   */
  getCurrentUser() {
    return this.authService.getCurrentUser();
  }

  /**
   * Registra al usuario en una clase
   */
  registrarseEnClase(claseId: string): void {
    const user = this.getCurrentUser();
    if (!user) {
      this.setError(claseId, 'Debes iniciar sesión para registrarte');
      return;
    }

    this.setLoading(claseId, true);
    this.clearError(claseId);

    this.claseService.registrarEnClase(claseId, user.uid).subscribe({
      next: () => {
        this.usuarioRegistrado.update((state) => ({
          ...state,
          [claseId]: true,
        }));
        this.claseService.cargarClases();
        this.setLoading(claseId, false);
      },
      error: (error) => {
        this.setError(
          claseId,
          error?.error?.message || 'Error al registrarse'
        );
        this.setLoading(claseId, false);
      },
    });
  }

  /**
   * Elimina al usuario de una clase
   */
  eliminarseDeClase(claseId: string): void {
    const user = this.getCurrentUser();
    if (!user) {
      this.setError(claseId, 'Debes iniciar sesión');
      return;
    }

    this.setLoading(claseId, true);
    this.clearError(claseId);

    this.claseService.eliminarDeClase(claseId, user.uid).subscribe({
      next: () => {
        this.usuarioRegistrado.update((state) => ({
          ...state,
          [claseId]: false,
        }));
        this.claseService.cargarClases();
        this.setLoading(claseId, false);
      },
      error: (error) => {
        this.setError(
          claseId,
          error?.error?.message || 'Error al cancelar registro'
        );
        this.setLoading(claseId, false);
      },
    });
  }

  /**
   * Establece el estado de carga para una clase
   */
  private setLoading(claseId: string, value: boolean): void {
    this.loadingClases.update((state) => ({
      ...state,
      [claseId]: value,
    }));
  }

  /**
   * Establece un mensaje de error para una clase
   */
  private setError(claseId: string, message: string): void {
    this.errorMessages.update((state) => ({
      ...state,
      [claseId]: message,
    }));
  }

  /**
   * Limpia el mensaje de error de una clase
   */
  private clearError(claseId: string): void {
    this.errorMessages.update((state) => ({
      ...state,
      [claseId]: '',
    }));
  }

  /**
   * Obtiene el error de una clase
   */
  getError(claseId: string): string {
    return this.errorMessages()[claseId] || '';
  }

  /**
   * Verifica si está cargando para una clase
   */
  isLoading(claseId: string): boolean {
    return this.loadingClases()[claseId] || false;
  }

  /**
   * Verifica si el usuario está registrado en una clase
   */
  isRegistered(claseId: string): boolean {
    return this.usuarioRegistrado()[claseId] || false;
  }
}