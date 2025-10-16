import { Component, inject } from '@angular/core';
import { FormsModule, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth/auth-service';
import { CommonModule, NgClass } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-form-login',
  standalone: true,
  imports: [FormsModule, CommonModule, NgClass, ReactiveFormsModule],
  templateUrl: './form-login.html',
  styleUrls: ['./form-login.css'],
})
export class FormLogin {
  private apiUrl = `${environment.url}/auth`;
  private fb = inject(FormBuilder);

  formLogin = this.fb.nonNullable.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });
  email = '';
  password = '';
  errorMessage = '';
  loading = false;

  constructor(private authService: AuthService) {}

  async onLogin() {
    this.loading = true;
    this.errorMessage = '';
    try {
      const user = await this.authService.login(this.email, this.password);
      const token = await user.user.getIdToken();

      await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Usuario logueado:', user.user);
    } catch (err) {
      this.errorMessage = 'Credenciales inválidas o error de conexión.';
      console.error('Error en login:', err);
    } finally {
      this.loading = false;
    }
  }

  async onGoogleLogin() {
    this.loading = true;
    this.errorMessage = '';
    try {
      const user = await this.authService.loginWithGoogle();
      const token = await user.user.getIdToken();
console.log('Environment activo:', environment);

      await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Login con Google exitoso:', user.user);
      
    } catch (err) {
      this.errorMessage = 'Error al iniciar sesión con Google.';
      console.error('Google login error:', err);
    } finally {
      this.loading = false;
    }
  }
}
