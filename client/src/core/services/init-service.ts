import { inject, Injectable } from '@angular/core';
import { AccountService } from './account-service';
import { Observable, of, tap } from 'rxjs';
import { LikesServices } from './likes-services';

@Injectable({
  providedIn: 'root'
})
export class InitService {
  private accountService = inject(AccountService);
  private likeService = inject(LikesServices);

  init() {
    return this.accountService.refreshToken().pipe(
      tap(user => {
        if (user)
          this.accountService.currentUser.set(user);
        this.likeService.getLikesIds();
        this.accountService.startRefreshIntervel();
      })
    )
  }
}
