import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountService } from '../services/account-service';
import { ToastService } from '../services/toast-service';

export const adminGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const toast = inject(ToastService);

  let roles = accountService.currentUser()?.roles ?? [];
  
  // Flatten nested array if needed
  if (Array.isArray(roles[0])) {
    roles = roles[0];
  }

  if (roles.includes('Admin') || roles.includes('Moderator')) {
    return true;
  } else {
    toast.error("You cannot access this area");
    return false;
  }
};