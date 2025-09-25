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
  currentUser = signal<User | null >(null);
  private baseUrl = environment.apiUrl;

  register(creds : RegisterCreds){
    return this.http.post<User>(this.baseUrl + 'account/register', creds).pipe(
      tap(user => {
        if(user){
          this.setCurrentUser(user);
        }
      }
    )
  ) 
  }
  login(creds : LoginCreds ){
    return this.http.post<User>(this.baseUrl + 'account/login', creds).pipe(
      tap(user => {
        if(user){
          this.setCurrentUser(user);
        }
      }
    )
    );
  }
  logout(){
    localStorage.removeItem('user');
    localStorage.removeItem('filters')
    this.currentUser.set(null);
    this.likesService.ClearLikesIds();
  }
  setCurrentUser(user : User){
    user.roles=this.getRolesFromToken(user)
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user);
    this.likesService.getLikesIds(); 
   }

   private getRolesFromToken(user:User): string[]{
    if (!user?.token) return [];
    const payload = user.token.split('.')[1];
    const decoded = atob(payload);
    const jsonPayload = JSON.parse(decoded);
    const role = jsonPayload.role;
    return Array.isArray(jsonPayload) ? role : [jsonPayload.role]
   }
}
