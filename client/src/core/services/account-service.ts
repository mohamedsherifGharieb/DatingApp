import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { LoginCreds, RegisterCreds, User } from '../../Types/user';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LikesServices } from './likes-services';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private likesService = inject(LikesServices);
  private http = inject(HttpClient);
  currentUser = signal<User | null>(null);
  private baseUrl = environment.apiUrl;

  register(creds: RegisterCreds) {
    return this.http.post<User>(this.baseUrl + 'account/register', creds, { withCredentials: true }).pipe(
      tap(user => {
        if (user) {
          this.setCurrentUser(user);
          this.startRefreshIntervel();
        }
      }
      )
    )
  }
  login(creds: LoginCreds) {
    return this.http.post<User>(this.baseUrl + 'account/login', creds, { withCredentials: true }).pipe(
      tap(user => {
        if (user) {
          this.setCurrentUser(user);
          this.startRefreshIntervel();

        }
      }
      )
    );
  }

  refreshToken() {
    return this.http.post<User>
      (this.baseUrl + 'account/refresh-token', {}, { withCredentials: true })
  }

  startRefreshIntervel() {
    setInterval(() => {
      this.http.post<User>
        (this.baseUrl + 'account/refresh-token', {}, { withCredentials: true })
        .subscribe({
          next: user => {
            this.setCurrentUser(user)
          },
          error: () => {
            this.logout()
          }
        })
    }, 5 * 60 * 1000); //refreshing the token every 5 minutes
  }

  logout() {
    localStorage.removeItem('filters')
    this.currentUser.set(null);
    this.likesService.ClearLikesIds();
  }
  setCurrentUser(user: User) {
    user.roles = this.getRolesFromToken(user)
    this.currentUser.set(user);
    this.likesService.getLikesIds();
  }

  private getRolesFromToken(user: User): string[] {
    if (!user?.token) return [];
    const payload = user.token.split('.')[1];
    const decoded = atob(payload);
    const jsonPayload = JSON.parse(decoded);
    const role = jsonPayload.role;
    return Array.isArray(jsonPayload) ? role : [jsonPayload.role]
  }
}
