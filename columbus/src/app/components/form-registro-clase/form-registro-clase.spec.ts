import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRegistroClase } from './form-registro-clase';

describe('FormRegistroClase', () => {
  let component: FormRegistroClase;
  let fixture: ComponentFixture<FormRegistroClase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormRegistroClase]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormRegistroClase);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
