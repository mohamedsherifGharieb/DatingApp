import { Component, HostListener, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EditableMember, Member } from '../../../Types/member';
import { DatePipe } from '@angular/common';
import { MemberService } from '../../../core/services/member-service';
import { FormsModule, NgForm } from '@angular/forms';
import { AccountService } from '../../../core/services/account-service';
import { ToastService } from '../../../core/services/toast-service';

@Component({
  selector: 'app-member-profile',
  imports: [DatePipe, FormsModule],
  templateUrl: './member-profile.html',
  styleUrl: './member-profile.css'
})
export class MemberProfile implements OnInit, OnDestroy {
  @ViewChild('editForm') editForm?: NgForm;
  @HostListener('window:beforeunload',['$event']) notify($event:BeforeUnloadEvent){
    if(this.editForm?.dirty){
      $event.preventDefault(); //to prevent from losing data change before closing the tab
    }
  }
  protected toast = inject(ToastService);
  private accountService = inject(AccountService);
  protected memberService = inject(MemberService)
  protected editableMember: EditableMember = {
    displayName: '',
    description: '',
    city: '',
    country: '',
  }


  ngOnInit(): void {
    this.editableMember = {
      displayName: this.memberService.member()?.displayName || '',
      city: this.memberService.member()?.city || '',
      country: this.memberService.member()?.country || '',
      description: this.memberService.member()?.description || '',
    }

  }
  updateProfile() {
    if (!this.memberService.member()) return;
    const updatedMember = { ...this.memberService.member(), ...this.editableMember };

    this.memberService.updateMember(this.editableMember).subscribe({
      next:() => {
       const currentUser = this.accountService.currentUser();
       if(currentUser && (updatedMember.displayName !== currentUser?.displayName)){
        currentUser.displayName = updatedMember.displayName;
        this.accountService.setCurrentUser(currentUser);
       }
       this.toast.success("User Updated Succesfully");
       this.memberService.editMode.set(false);
       this.memberService.member.set(updatedMember as Member);
       this.editForm?.reset(updatedMember);
      }
    })
  }
  ngOnDestroy(): void {
    if (this.memberService.editMode()) {
      this.memberService.editMode.set(false);
    }
  }
}
