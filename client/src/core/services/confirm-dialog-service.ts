import { Injectable } from '@angular/core';
import { ConfirmDialog } from '../../shared/confirm-dialog/confirm-dialog';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {
  private dialogComp?: ConfirmDialog

  register(component: ConfirmDialog){
    this.dialogComp = component;
  }
  confirm(message = 'Are you Sure?'):Promise<boolean>{
    if(!this.dialogComp){
      throw new Error('Confirm dialog component is not registered');
    }
    return this.dialogComp.open(message);
  }
}
