import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast-service';
import { NavigationExtras, Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const toast = inject(ToastService);
  const router = inject(Router);

  return next(req).pipe(
    catchError(error => {
      if (error) {
        switch (error.status) {
          case 400:
            if (error.error && error.error.errors) {
              const modelStateError = [];
              for (const key in error.error.errors) {
                if (error.error.errors[key]) {
                  modelStateError.push(error.error.errors[key]);
                }
              }
              throw modelStateError.flat();
            } else {
              // Show a readable error message
              const errorMessage = typeof error.error === 'string'
                ? error.error
                : JSON.stringify(error.error);
              toast.error(errorMessage);
            }
            break;
          case 401:
            toast.error("Unauthorized")
            break;
          case 404:
            router.navigateByUrl('/not-found')
            break;
          case 500:
            const navigationExtra: NavigationExtras = {state: {error:error.error}}
            router.navigateByUrl('/server-error',navigationExtra);
            break;
          default:

            toast.error('smth went wrong')
            break;

        }

      } 
      throw error;
    }
    )
  )

};
