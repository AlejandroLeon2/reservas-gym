import { Component, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClaseService, ClaseCalendario } from '../../service/clases/clase-service';
import { AuthService } from '../../service/auth/auth-service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
})
export class Calendar implements OnInit {
  private claseService = inject(ClaseService);
  private authService = inject(AuthService);

  @Output() selectedDayChange = new EventEmitter<number[]>();
  @Output() dayClicked = new EventEmitter<{ day: number; month: number; year: number }>();

  days: (number | null)[] = [];
  currentDate = new Date();
  currentMonth = this.currentDate.getMonth();
  currentYear = this.currentDate.getFullYear();
  selectedDays: number[] = [];
  
  clasesPorDia: Map<number, ClaseCalendario[]> = new Map();
  clases: ClaseCalendario[] = [];
  cargando = false;
  esEntrenador = false;

  monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];

  weekdays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  ngOnInit(): void {
    this.detectarYCargarClases();
    this.loadCalendar(this.currentMonth, this.currentYear);
  }

  /**
   * Intenta cargar clases como entrenador, si no hay, intenta como cliente
   * Esto auto-detecta el tipo de usuario basándose en los datos disponibles
   */
  private detectarYCargarClases(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.cargando = true;

    // Primero intenta como entrenador
    this.claseService.obtenerClasesEntrenador(user.uid).subscribe({
      next: (clases) => {
        if (clases && clases.length > 0) {
          // Tiene clases como entrenador
          this.esEntrenador = true;
          this.clases = clases;
          this.procesarClases();
          this.cargando = false;
        } else {
          // No tiene clases como entrenador, intenta como cliente
          this.claseService.obtenerClasesCliente(user.uid).subscribe({
            next: (clasesCliente) => {
              // Aunque esté vacío, es cliente
              this.esEntrenador = false;
              this.clases = clasesCliente;
              this.procesarClases();
              this.cargando = false;
            },
            error: (error) => {
              console.error('Error cargando clases del cliente:', error);
              this.esEntrenador = false;
              this.cargando = false;
            }
          });
        }
      },
      error: (error) => {
        console.error('Error cargando clases del entrenador:', error);
        // Si falla entrenador, intenta cliente
        this.claseService.obtenerClasesCliente(user.uid).subscribe({
          next: (clasesCliente) => {
            this.esEntrenador = false;
            this.clases = clasesCliente;
            this.procesarClases();
            this.cargando = false;
          },
          error: (clientError) => {
            console.error('Error cargando clases del cliente:', clientError);
            this.cargando = false;
          }
        });
      }
    });
  }

  /**
   * Procesa las clases y las agrupa por día extraído del horario
   */
  private procesarClases(): void {
    this.clasesPorDia.clear();

    this.clases.forEach((clase) => {
      const dia = this.extraerDiaDelHorario(clase.horario);
      if (dia) {
        if (!this.clasesPorDia.has(dia)) {
          this.clasesPorDia.set(dia, []);
        }
        this.clasesPorDia.get(dia)!.push(clase);
      }
    });
  }

  /**
   * Extrae el número de día del horario
   * Si el formato incluye fecha (YYYY-MM-DD HH:MM - HH:MM), la extrae
   * Si solo es hora (HH:MM - HH:MM), retorna null
   */
  private extraerDiaDelHorario(horario: string): number | null {
    // Intenta extraer fecha si el formato es: 2025-10-15 06:00 - 07:00
    const fechaMatch = horario.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (fechaMatch) {
      const dia = parseInt(fechaMatch[3], 10);
      const mes = parseInt(fechaMatch[2], 10) - 1;
      const año = parseInt(fechaMatch[1], 10);

      // Verificar que sea del mes/año actual
      if (mes === this.currentMonth && año === this.currentYear) {
        return dia;
      }
      return null;
    }

    // Si no tiene fecha, retorna null
    return null;
  }

  /**
   * Carga el calendario para un mes y año específico
   */
  loadCalendar(month: number, year: number): void {
    this.days = [];

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const startIndex = firstDay === 0 ? 6 : firstDay - 1;

    for (let i = 0; i < startIndex; i++) {
      this.days.push(null);
    }

    for (let d = 1; d <= totalDays; d++) {
      this.days.push(d);
    }

    this.currentMonth = month;
    this.currentYear = year;
  }

  /**
   * Cambia al mes anterior o siguiente
   */
  changeMonth(offset: number): void {
    let newMonth = this.currentMonth + offset;
    let newYear = this.currentYear;

    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }

    this.loadCalendar(newMonth, newYear);
  }

  /**
   * Selecciona o deselecciona un día
   */
  selectDay(day: number | null): void {
    if (day === null) return;

    if (this.selectedDays.indexOf(day) !== -1) {
      this.selectedDays = this.selectedDays.filter((d) => d !== day);
    } else {
      this.selectedDays.push(day);
    }

    this.selectedDayChange.emit(this.selectedDays);
    this.dayClicked.emit({
      day,
      month: this.currentMonth,
      year: this.currentYear,
    });
  }

  /**
   * Limpia todos los días seleccionados
   */
  clearSelectedDays(): void {
    this.selectedDays = [];
    this.selectedDayChange.emit(this.selectedDays);
  }

  /**
   * Verifica si un día es hoy
   */
  isToday(day: number | null): boolean {
    if (day === null) return false;

    const today = new Date();
    return (
      day === today.getDate() &&
      this.currentMonth === today.getMonth() &&
      this.currentYear === today.getFullYear()
    );
  }

  /**
   * Obtiene las clases de un día
   */
  getClasesDelDia(day: number | null): ClaseCalendario[] {
    if (day === null) return [];
    return this.clasesPorDia.get(day) || [];
  }

  /**
   * Verifica si un día tiene clases
   */
  tieneclases(day: number | null): boolean {
    return this.getClasesDelDia(day).length > 0;
  }

  /**
   * Verifica si un día está seleccionado
   */
  isDaySelected(day: number | null): boolean {
    if (day === null) return false;
    return this.selectedDays.indexOf(day) !== -1;
  }

  /**
   * Obtiene el mes y año actual en formato legible
   */
  get monthYearLabel(): string {
    return `${this.monthNames[this.currentMonth]} ${this.currentYear}`;
  }

  /**
   * Obtiene un texto descriptivo del tipo de usuario
   */
  get tipoUsuarioLabel(): string {
    if (this.clases.length === 0) {
      return this.esEntrenador ? 'Sin clases creadas' : 'Sin clases registradas';
    }
    return this.esEntrenador ? 'Mis clases' : 'Mis registros';
  }
}