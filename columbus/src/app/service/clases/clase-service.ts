import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Clase {
  id?: string;
  nombre: string;
  descripcion: string;
  entrenadorId: string;
  horario: string;
  cuposDisponibles: number;
}

@Injectable({ providedIn: 'root' })
export class ClaseService {
  private apiUrl = `${environment.url}/clase`;
  clases = signal<Clase[]>([]);

  constructor(private http: HttpClient) {}

  crearClase(data: Clase): Observable<Clase> {
    return this.http.post<Clase>(this.apiUrl, data);
  }

  cargarClases() {
    this.http.get<Clase[]>(this.apiUrl).subscribe(res => this.clases.set(res));
  }
}
