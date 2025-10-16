import { Component } from '@angular/core';
import clases from '../../../data/clases.json';
import { Carrusel } from "../../components/carrusel/carrusel";
import { MostrarClases } from "../../sections/mostrar-clases/mostrar-clases";

@Component({
  selector: 'app-inicio',
  imports: [Carrusel, MostrarClases,],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class Inicio {
data=clases;
}
