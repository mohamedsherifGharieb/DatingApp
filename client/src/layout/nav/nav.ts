import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { Router,RouterLink, RouterLinkActive } from '@angular/router';
import { ToastService } from '../../core/services/toast-service';
import { themes } from '../themes';
import { BusyService } from '../../core/services/busy-service';
@Component({
  selector: 'app-nav',
  imports: [FormsModule,RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav implements OnInit{
  protected accountService = inject(AccountService);
  private router = inject(Router);
  protected busyService = inject(BusyService);
  private toastService = inject(ToastService);
  protected creds: any = {}
  protected selcetedTheme = signal<string>(localStorage.getItem('theme') || 'light');
  protected themes = themes; 
 
   ngOnInit(): void {
        document.documentElement.setAttribute('data-theme',this.selcetedTheme());

  }
 

  handleSelectedTheme(theme :string){
    this.selcetedTheme.set(theme);
    localStorage.setItem('theme',theme);
    document.documentElement.setAttribute('data-theme',theme);
    const elem = document.activeElement as HTMLDivElement;
    if(elem) elem.blur();
  }


  login() {
    this.accountService.login(this.creds).subscribe({
      next: () => {
        this.router.navigateByUrl('/members');
        this.toastService.success("Logged in successfully");
        this.creds = {};
      },
      error: error => {
      this.toastService.error(error.error);
      }
    }
    )
  }
  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}
