import { Component, inject, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClaseService, ClaseCrear, Clase } from '../../service/clases/clase-service';
import { AuthService } from '../../service/auth/auth-service';

@Component({
  selector: 'app-form-registro-clase',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-registro-clase.html',
  styleUrls: ['./form-registro-clase.css'],
})
export class FormRegistroClase implements OnInit {
  private fb = inject(FormBuilder);
  private claseService = inject(ClaseService);
  private authService = inject(AuthService);

  @Input() claseEditar?: Clase;

  isEditing = false;
  loading = false;
  errorMessage = '';
  successMessage = '';

  // Array de imágenes disponibles
  imagenesDisponibles = [
    '/images/box1.jpg',
    '/images/box2.jpg',
    '/images/box3.jpg',
    '/images/box1.jpg',
  ];

  imagenSeleccionada = '';

  form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    descripcion: ['', [Validators.required, Validators.minLength(10)]],
    fecha: ['', Validators.required],
    horaInicio: ['', Validators.required],
    horaFin: ['', Validators.required],
    imagenClase: ['', Validators.required],
    cuposDisponibles: [0, [Validators.required, Validators.min(1), Validators.max(30)]],
  }, {
    validators: this.validarHorarios.bind(this)
  });

  ngOnInit(): void {
    if (this.claseEditar) {
      this.cargarClaseEditar();
    }
  }
  private validarHorarios(control: AbstractControl): ValidationErrors | null {
    const horaInicio = control.get('horaInicio')?.value;
    const horaFin = control.get('horaFin')?.value;

    if (!horaInicio || !horaFin) return null;

    if (horaInicio >= horaFin) {
      control.get('horaFin')?.setErrors({ 'horaInvalida': true });
      return { 'horasInvalidas': true };
    }

    control.get('horaFin')?.setErrors(null);
    return null;
  }


  private cargarClaseEditar(): void {
    if (!this.claseEditar) return;

    this.isEditing = true;

    let horaInicio = '';
    let horaFin = '';

    if (this.claseEditar.horario?.includes(' - ')) {
      const [inicio, fin] = this.claseEditar.horario.split(' - ');
      horaInicio = inicio.trim();
      horaFin = fin.trim();
    }

    this.imagenSeleccionada = this.claseEditar.imagenClase;

    this.form.patchValue({
      nombre: this.claseEditar.nombre,
      descripcion: this.claseEditar.descripcion,
      horaInicio,
      horaFin,
      imagenClase: this.claseEditar.imagenClase,
      cuposDisponibles: this.claseEditar.cuposDisponibles,
    });
  }

 
  get horarioCompleto(): string {
    const { horaInicio, horaFin,fecha } = this.form.value;
    return horaInicio && horaFin ? `${fecha} ${horaInicio} - ${horaFin}` : '';
  }

  get formTitle(): string {
    return this.isEditing ? 'Editar Clase' : 'Crear Nueva Clase';
  }


  get buttonText(): string {
    return this.isEditing ? 'Actualizar Clase' : 'Crear Clase';
  }

  seleccionarImagen(imagen: string): void {
    this.imagenSeleccionada = imagen;
    this.form.patchValue({ imagenClase: imagen });
  }


  hasError(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }


  getErrorMessage(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (!field?.errors) return '';

    if (field.errors['required']) return 'Este campo es obligatorio';
    if (field.errors['minLength']) {
      const min = field.errors['minLength'].requiredLength;
      return `Mínimo ${min} caracteres`;
    }
    if (field.errors['min']) return `Mínimo ${field.errors['min'].min}`;
    if (field.errors['max']) return `Máximo ${field.errors['max'].max}`;
    if (field.errors['horaInvalida']) return 'La hora de fin debe ser posterior a la de inicio';

    return 'Campo inválido';
  }


  onSubmit(): void {
    if (this.form.invalid) {
      this.errorMessage = 'Por favor completa todos los campos correctamente';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const user = this.authService.getCurrentUser();
    if (!user) {
      this.errorMessage = 'Usuario no autenticado';
      this.loading = false;
      return;
    }

    const formValues = this.form.getRawValue();

    const data: ClaseCrear = {
      nombre: formValues.nombre,
      descripcion: formValues.descripcion,
      horario: this.horarioCompleto,
      imagenClase: formValues.imagenClase,
      cuposDisponibles: formValues.cuposDisponibles,
      entrenadorId: user.uid,
    };

    if (this.isEditing && this.claseEditar?.id) {
      const dataActualizada: Clase = {
        id: this.claseEditar.id,
        ...data,
      };
      this.actualizarClase(dataActualizada);
    } else {
      this.crearClase(data);
    }
  }

  private crearClase(data: ClaseCrear): void {
    this.claseService.crearClase(data).subscribe({
      next: () => {
        this.successMessage = 'Clase creada exitosamente';
        this.form.reset();
        this.imagenSeleccionada = '';
        this.loading = false;
        this.claseService.cargarClases().subscribe();
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Error al crear la clase';
        this.loading = false;
      },
    });
  }


  private actualizarClase(data: Clase): void {
    if (!this.claseEditar?.id) {
      this.errorMessage = 'ID de clase no válido';
      this.loading = false;
      return;
    }

    this.claseService.actualizarClase(this.claseEditar.id, data).subscribe({
      next: () => {
        this.successMessage = 'Clase actualizada exitosamente';
        this.form.reset();
        this.isEditing = false;
        this.loading = false;
        this.claseService.cargarClases().subscribe();
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Error al actualizar la clase';
        this.loading = false;
      },
    });
  }


  limpiarFormulario(): void {
    this.form.reset();
    this.isEditing = false;
    this.errorMessage = '';
    this.successMessage = '';
    this.imagenSeleccionada = '';
  }
}