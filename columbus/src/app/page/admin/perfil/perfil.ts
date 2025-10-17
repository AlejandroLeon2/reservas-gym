import { Component } from '@angular/core';
import { Profile } from "../../../components/profile/profile";
import { Registro } from "../../../sections/registro/registro";



@Component({
  selector: 'app-perfil',
  imports: [Profile, Registro],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class Perfil {

}
