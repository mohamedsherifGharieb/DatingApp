import { HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BusyService } from '../services/busy-service';
import { delay, finalize, of, tap } from 'rxjs';

const cache = new Map<string,HttpEvent<unknown>>();

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
 const busyService = inject(BusyService);

 if(req.method === 'GET'){
  const cacheResponse = cache.get(req.url);
  if(cacheResponse){
    return of(cacheResponse);
  }
 }

 busyService.busy();

 
  return next(req).pipe(
  delay(500),
  tap(respone =>{
    cache.set(req.url,respone)
  }),
  finalize(()=>{
      busyService.idle()
    })
)
};
