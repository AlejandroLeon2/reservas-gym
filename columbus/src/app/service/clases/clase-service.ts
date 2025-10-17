import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Clase {
  id: string;
  nombre: string;
  descripcion: string;
  entrenadorId: string;
  horario: string;
  imagenClase: string;
  cuposDisponibles: number;
  participantesId?: string[];
}

export interface ClaseCalendario {
  id: string;
  nombre: string;
  horario: string;
  imagenClase?: string;
}

export type ClaseCrear = Omit<Clase, 'id'>;

@Injectable({ providedIn: 'root' })
export class ClaseService {
  private apiUrl = `${environment.url}/clase`;
  clases = signal<Clase[]>([]);
  clasesEntrenador = signal<ClaseCalendario[]>([]);
  clasesCliente = signal<ClaseCalendario[]>([]);

  constructor(private http: HttpClient) {}

  
  crearClase(data: ClaseCrear): Observable<Clase> {
    return this.http.post<Clase>(this.apiUrl, data);
  }

  
  actualizarClase(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  cargarClases(): Observable<Clase[]> {
    return this.http.get<Clase[]>(this.apiUrl).pipe(
      tap((res) => this.clases.set(res))
    );
  }

  obtenerClasesEntrenador(entrenadorId: string): Observable<ClaseCalendario[]> {
    return this.http.get<ClaseCalendario[]>(`${this.apiUrl}/entrenador/${entrenadorId}`).pipe(
      tap((res) => this.clasesEntrenador.set(res))
    );
  }


  obtenerClasesCliente(clienteId: string): Observable<ClaseCalendario[]> {
    return this.http.get<ClaseCalendario[]>(`${this.apiUrl}/cliente/${clienteId}`).pipe(
      tap((res) => this.clasesCliente.set(res))
    );
  }

  registrarEnClase(claseId: string, userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${claseId}/registrar/${userId}`, {});
  }

  eliminarDeClase(claseId: string, userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${claseId}/participante/${userId}`);
  }

 
  obtenerClasePorId(id: string): Observable<Clase> {
    return this.http.get<Clase>(`${this.apiUrl}/${id}`);
  }


  eliminarClase(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}