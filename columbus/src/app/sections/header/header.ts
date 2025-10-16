import { Component, signal,effect } from '@angular/core';
import columbus from '../../../data/columbusData.json';
import {  RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink,NgClass],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
data=columbus;
scrolled = signal(false);

  constructor() {
    if (typeof window !== 'undefined') {
    effect(() => {
      window.addEventListener('scroll', () => {
        this.scrolled.set(window.scrollY > 50);
      });
    });
  };
  }

  menuAbierto = false;

toggleMenu() {
  this.menuAbierto = !this.menuAbierto;
}
}
