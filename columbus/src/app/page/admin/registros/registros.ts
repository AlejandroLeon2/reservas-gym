import { Component } from '@angular/core';
import { Registro } from "../../../sections/registro/registro";
@Component({
  selector: 'app-registro',
  standalone:true,
  imports: [Registro],
  templateUrl: './registros.html',
  styleUrl: './registros.css'
})
export class Registros {

}
