import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  
  constructor() {
    this.createToastContainer();
   }

  private createToastContainer()
  {
    if(!document.getElementById('toast-container'))
    {
      const container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast toast-bottom toast-end z-50';
      document.body.appendChild(container);
    }
  }
  private CreateToastelement(message: string, alertClass: string , duration = 5000){
    const toastContainer = document.getElementById('toast-container');
    if(!toastContainer) return;
    const toast = document.createElement('div');
    toast.classList.add('alert', alertClass, "shadow-lg");
    toast.innerHTML = 
    `<span>${message}</span>
    <button class="btn btn-sm btn-ghost" id="close-btn">x</button>
    `;
    toast.querySelector('button')?.addEventListener('click', () => {
      toastContainer.removeChild(toast);
    });

    toastContainer.appendChild(toast);
    setTimeout(() => {
      if(toastContainer.contains(toast))
      {
        toastContainer.removeChild(toast);
      } 
    }, duration);
  }
  success(message: string, duration?: number){
    this.CreateToastelement(message, 'alert-success', duration);
  } 
  error(message: string, duration = 5000){
    this.CreateToastelement(message, 'alert-error',duration);
  }
  warn(message: string, duration = 5000){
    this.CreateToastelement(message, 'alert-warn',duration);
  }
  info(message: string, duration = 5000){
    this.CreateToastelement(message, 'alert-info',duration);
  }
}
