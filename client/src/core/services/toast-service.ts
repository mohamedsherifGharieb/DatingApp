import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private router = inject(Router);

  constructor() {
    this.createToastContainer();
  }

  private createToastContainer() {
    if (!document.getElementById('toast-container')) {
      const container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast toast-bottom toast-end z-50';
      document.body.appendChild(container);
    }
  }
  private CreateToastelement(message: string, alertClass: string, duration = 5000
    , avatar?: string, route?: string) {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.classList.add('alert', alertClass, "shadow-lg", 'flex'
      , 'items-center', 'gap-3', 'cursor-pointer');
    toast.innerHTML = `
  ${avatar ? `<img src="${avatar || '/user.png'}" class="w-10 h-10 rounded" />` : ''}
  <span>${message}</span>
  <button class="btn btn-sm btn-ghost" id="close-btn">x</button>
`;

    if(route) {
      toast.addEventListener('click',() => this.router.navigateByUrl(route))
    }

    toast.querySelector('button')?.addEventListener('click', () => {
      toastContainer.removeChild(toast);
    });

    toastContainer.appendChild(toast);
    setTimeout(() => {
      if (toastContainer.contains(toast)) {
        toastContainer.removeChild(toast);
      }
    }, duration);
  }
  success(message: string, duration?: number,avatar?: string,route?:string) {
    this.CreateToastelement(message, 'alert-success', duration,avatar,route);
  }
  error(message: string, duration = 5000,avatar?: string,route?:string) {
    this.CreateToastelement(message, 'alert-error', duration,avatar,route);
  }
  warn(message: string, duration = 5000,avatar?: string,route?:string) {
    this.CreateToastelement(message, 'alert-warn', duration,avatar,route);
  }
  info(message: string, duration = 5000,avatar?: string,route?:string) {
    this.CreateToastelement(message, 'alert-info', duration,avatar,route);
  }
}
