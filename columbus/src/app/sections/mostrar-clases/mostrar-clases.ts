import { Component, input } from '@angular/core';

export interface Clase {
  nombre: string;
  descripcion: string;
  entrenadorId: string;
  horario: string;
  imagenClase: string;
  cuposDisponibles: number;
}

@Component({
  selector: 'app-mostrar-clases',
  imports: [],
  templateUrl: './mostrar-clases.html',
  styleUrl: './mostrar-clases.css',
})
export class MostrarClases {
  data = input<Clase[]>();
}
