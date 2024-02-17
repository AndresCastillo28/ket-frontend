import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { RoleInterface } from 'src/app/interfaces/role.interface';
import { AuthService } from 'src/app/services/auth.service';
import { RolesService } from 'src/app/services/roles.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent {
  signUpForm: FormGroup;

  private authService = inject(AuthService);
  private snackbarService = inject(SnackbarService);
  private roleService = inject(RolesService);
  public roles: RoleInterface[] = [];

  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  public hidePassword = true;

  constructor() {
    this.signUpForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      role: new FormControl('', [Validators.required]),
    });
    this.loadRoles();
  }

  loadRoles() {
    this.roleService.getAllRoles().subscribe({
      next: (res) => {
        if (res.data) this.roles = res.data;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  isValidField(field: string): boolean | null {
    return (
      this.signUpForm.controls[field].errors &&
      this.signUpForm.controls[field].touched
    );
  }

  getFieldError(field: string): string | null {
    if (!this.signUpForm.controls[field]) return null;

    const errors = this.signUpForm.controls[field].errors || {};
    for (const key of Object.keys(errors)) {
      if (key === 'required') {
        return 'Field is required';
      }
      if (key === 'email') {
        return 'Must be valid email';
      }
      if (key === 'minlength') {
        const requiredLength = errors['minlength'].requiredLength;
        return `Must be at least ${requiredLength} characters`;
      }
    }
    return null;
  }

  onNoClick(): void {
    // Cerrar diálogo o lógica adicional
  }

  onSubmit(): void {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      this.snackbarService.openSnackBar(
        'Por favor, corrija los errores en el formulario antes de enviarlo.'
      );
      return;
    }

    this.authService.signup(this.signUpForm.value).subscribe({
      next: (res) => {
        this.snackbarService.openSnackBar('Registrado exitosamente.');
        console.log(res);
        // Limpia el formulario después de una suscripción exitosa
        this.signUpForm.reset();
        // Opcional: Restablece cualquier estado adicional relacionado con el formulario aquí
        this.hidePassword = true; // Si quieres restablecer el estado de la visualización de la contraseña
      },
      error: (err) => {
        this.snackbarService.openSnackBar('Something went wrong..');
        console.error(err);
      },
    });
  }
}
