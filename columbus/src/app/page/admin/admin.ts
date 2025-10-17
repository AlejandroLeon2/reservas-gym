import { Component } from '@angular/core';
import { Modal } from "../../components/modal/modal";
import { RouterModule } from "@angular/router";



@Component({
  selector: 'app-admin',
  imports: [Modal, RouterModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin {
modalAbierto = false;

}
