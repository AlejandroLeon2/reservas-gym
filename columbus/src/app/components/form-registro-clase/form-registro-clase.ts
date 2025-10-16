import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClaseService } from '../../service/clases/clase-service';

@Component({
  selector: 'app-form-registro-clase',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-registro-clase.html',
  styleUrls: ['./form-registro-clase.css'],
})
export class FormRegistroClase {
  private fb = inject(FormBuilder);
  private claseService = inject(ClaseService);

  horas = [
    '06:00', '07:00', '08:00', '09:00', '10:00',
    '11:00', '12:00', '13:00', '14:00', '15:00',
    '16:00', '17:00', '18:00', '19:00', '20:00',
    '21:00'
  ];

  form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    entrenadorId: 'addsa',
    horarioInicio: ['', Validators.required],
    horarioFin: [{ value: '', disabled: true }, Validators.required],
    cuposDisponibles: [0, Validators.required],
  });

  ngOnInit() {
    this.form.get('horarioInicio')?.valueChanges.subscribe((val) => {
      const finControl = this.form.get('horarioFin');
      val ? finControl?.enable() : finControl?.disable();
    });
  }

  get horarioCompleto(): string {
    const { horarioInicio, horarioFin } = this.form.value;
    return `${horarioInicio} - ${horarioFin}`;
  }

  onSubmit() {
    if (!this.form.valid) return;

    const data = {
      ...this.form.getRawValue(),
      horario: this.horarioCompleto
    };

    this.claseService.crearClase(data).subscribe(() => {
      this.claseService.cargarClases();
      this.form.reset();
    });
  }
}
