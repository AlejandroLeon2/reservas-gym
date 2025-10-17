import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth/auth-service';
import {  NgClass } from '@angular/common';
import { Router } from '@angular/router';
import data from '../../../data/columbusData.json';
interface NavLink {
  route: string;
  label: string;
}

interface NavData {
  rutasAdmin: NavLink[];
}
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [RouterModule,NgClass],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {
 isOpen = false;

  readonly links: NavData = data;
  constructor(private authService: AuthService, private router: Router) {}

toggle(): void {
  this.isOpen = !this.isOpen;
}

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
    console.log('Sesión cerrada');
  }
}
