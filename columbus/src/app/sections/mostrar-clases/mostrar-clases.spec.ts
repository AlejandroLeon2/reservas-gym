import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarClases } from './mostrar-clases';

describe('MostrarClases', () => {
  let component: MostrarClases;
  let fixture: ComponentFixture<MostrarClases>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MostrarClases]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostrarClases);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
