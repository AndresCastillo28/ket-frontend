import { HttpClient } from '@angular/common/http';
import { Injectable, Inject, inject } from '@angular/core'; // 'Inject' debe tener 'I' mayúscula
import { SignUpInterface } from '../interfaces/signup-request.interface';
import { Observable, catchError, map, of } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response.interface';
import { UserInterface } from '../interfaces/user.interface';
import { AuthResponseInterface } from '../interfaces/auth.response.interface';
import { LoginRequestInterface } from '../interfaces/login-request.interface';
import { LoginResponseInterface } from '../interfaces/login-response.interface';
import { Router } from '@angular/router';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = '/auth';
  private route = inject(Router);
  private snackbarService = inject(SnackbarService);

  signIn(
    data: LoginRequestInterface
  ): Observable<ApiResponse<LoginResponseInterface>> {
    return this.http.post<ApiResponse<LoginResponseInterface>>(
      `${this.baseUrl}/signin`,
      data
    );
  }

  signup(data: SignUpInterface): Observable<ApiResponse<UserInterface>> {
    return this.http.post<ApiResponse<UserInterface>>(
      `${this.baseUrl}/signup`,
      data
    );
  }

  logout(): void {
    localStorage.clear();
    this.route.navigate(["/"]);
    this.snackbarService.openSnackBar(
      'Session closed succesfully.'
    );
  }

  checkAuthentication(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      return of(false);
    }
    console.log('here')
    return this.http
      .get<ApiResponse<AuthResponseInterface>>(`${this.baseUrl}/renew`)
      .pipe(
        map((response: ApiResponse<AuthResponseInterface>) => {
          if (response.data) {
            localStorage.setItem('token', response.data.token);
            return true;
          }
          console.log('here')
          return false;
        }),
        catchError((error) => {
          if (error.status === 401) {
            return of(false);
          }

          return of(false);
        })
      );
  }
}
