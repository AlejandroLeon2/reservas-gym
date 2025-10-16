import { Component, input } from '@angular/core';
import { NgClass } from "@angular/common";

@Component({
  selector: 'app-icon-flecha',
  imports: [NgClass],
  template: `
   <svg
  [ngClass]="styleClass()"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  aria-hidden="true"
>
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    d="M19 9l-7 7-7-7"></path>
</svg>
  `,
  styles: ``
})
export class IconFlecha {
 styleClass= input('');
}