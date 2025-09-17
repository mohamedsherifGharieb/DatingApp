import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiError } from '../../../Types/error';

@Component({
  selector: 'app-server-error',
  imports: [],
  templateUrl: './server-error.html',
  styleUrl: './server-error.css'
})
export class ServerError {
protected error : ApiError;
protected showDetailed = false;
private router = inject(Router);
  constructor()
{
const navigation = this.router.currentNavigation();
this.error = navigation?.extras.state?.['error'];
}
detailsToggle(){
  this.showDetailed = !this.showDetailed;
}
}
