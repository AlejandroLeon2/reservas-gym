import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClaseService, ClaseCalendario } from '../../service/clases/clase-service';
import { AuthService } from '../../service/auth/auth-service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro implements OnInit {
  private claseService = inject(ClaseService);
  private authService = inject(AuthService);

  clases: ClaseCalendario[] = [];
  cargando = false;
  esEntrenador = false;
  mensajeVacio = '';
  errorMessage = '';

  ngOnInit(): void {
    this.detectarYCargarClases();
  }

  private detectarYCargarClases(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.cargando = true;
    this.errorMessage = '';


    this.claseService.obtenerClasesEntrenador(user.uid).subscribe({
      next: (clases) => {
        if (clases && clases.length > 0) {

          this.esEntrenador = true;
          this.clases = clases;
          this.mensajeVacio = 'No has creado ninguna clase aún';
          this.cargando = false;
        } else {

          this.claseService.obtenerClasesCliente(user.uid).subscribe({
            next: (clasesCliente) => {
              this.esEntrenador = false;
              this.clases = clasesCliente;
              this.mensajeVacio = 'No estás registrado en ninguna clase aún';
              this.cargando = false;
            },
            error: (error) => {
              console.error('Error cargando clases del cliente:', error);
              this.esEntrenador = false;
              this.errorMessage = 'Error al cargar las clases';
              this.cargando = false;
            }
          });
        }
      },
      error: (error) => {
        console.error('Error cargando clases del entrenador:', error);

        this.claseService.obtenerClasesCliente(user.uid).subscribe({
          next: (clasesCliente) => {
            this.esEntrenador = false;
            this.clases = clasesCliente;
            this.mensajeVacio = 'No estás registrado en ninguna clase aún';
            this.cargando = false;
          },
          error: (clientError) => {
            console.error('Error cargando clases del cliente:', clientError);
            this.errorMessage = 'Error al cargar las clases';
            this.cargando = false;
          }
        });
      }
    });
  }

  extraerFecha(horario: string): string {
    const fechaMatch = horario.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (fechaMatch) {
      const [, año, mes, dia] = fechaMatch;
      const fecha = new Date(`${año}-${mes}-${dia}`);
      return fecha.toLocaleDateString('es-ES', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
    return 'Fecha no disponible';
  }

  extraerHora(horario: string): string {
    const horaMatch = horario.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
    if (horaMatch) {
      return `${horaMatch[1]} - ${horaMatch[2]}`;
    }
    return horario;
  }


  recargar(): void {
    this.detectarYCargarClases();
  }
}