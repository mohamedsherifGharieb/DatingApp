import { Component, inject, Input, signal } from '@angular/core';
import { Register } from "../account/register/register";
import { User } from '../../Types/user';
import { AccountService } from '../../core/services/account-service';

@Component({
  selector: 'app-home',
  imports: [Register],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  protected registerMode = signal(false);
  protected accountService = inject(AccountService);

  showRegisterMode(value: boolean){
    this.registerMode.set(value);
  }
}
