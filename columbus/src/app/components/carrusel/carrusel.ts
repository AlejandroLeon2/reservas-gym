import { Component,ViewChild, ElementRef } from '@angular/core';
import columbus from '../../../data/columbusData.json';
import { IconFlecha } from '../../icons/icon-flecha';


@Component({
  selector: 'app-carrusel',
  imports: [IconFlecha],
  templateUrl: './carrusel.html',
  styleUrl: './carrusel.css',
})
export class Carrusel {
  
    @ViewChild('sliderTrack') trackRef!: ElementRef<HTMLDivElement>;

  data = columbus;
  index = 0;
  total = 0;
    ngAfterViewInit() {
    this.total = this.trackRef.nativeElement.children.length;
  }
    update() {
    this.trackRef.nativeElement.style.transform = `translateX(-${this.index * 100}%)`;
  }

  izquierda() {
    if (this.index < this.total - 1) 
      this.index++;
      this.update();
    console.log('hola');
  }
  derecha() {
    if (this.index > 0) {
      this.index--;
      this.update();
    }
    console.log('adios');
  }
}
