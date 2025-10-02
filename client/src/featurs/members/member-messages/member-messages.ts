import { Component, effect, ElementRef, inject, model, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { MessageServices } from '../../../core/services/message-services';
import { MemberService } from '../../../core/services/member-service';
import { Message } from '../../../Types/Message';
import { DatePipe } from '@angular/common';
import { TimeAgoPipe } from '../../../core/pipes/time-ago-pipe';
import { FormsModule } from '@angular/forms';
import { PresenceService } from '../../../core/services/presence-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-messages',
  imports: [DatePipe,TimeAgoPipe,FormsModule],
  templateUrl: './member-messages.html',
  styleUrl: './member-messages.css'
})
export class MemberMessages implements OnInit,OnDestroy{
  @ViewChild('messageEndRef') messageEndRef!: ElementRef
  protected messageService = inject(MessageServices);
  protected presenceService = inject(PresenceService);
  private memberService = inject(MemberService);
  protected messageContent=model('');
  private router = inject(ActivatedRoute);


  constructor(){
    effect(() => {
      const currentMessages = this.messageService.messageThread();
      if(currentMessages.length > 0){
        this.scrollToBottom();
      }
    })
  }
  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

  ngOnInit(): void {
    this.router.parent?.paramMap.subscribe({
      next: params =>{
        const otherUserId = params.get('id');;
        if(!otherUserId) throw new Error('Cannot connect to Hub');

        this.messageService.createHubConnection(otherUserId);
      }
    })
    }
  sendMessage(){
    const recipientId = this.memberService.member()?.id;
    if(!recipientId || !this.messageContent()) return;
    this.messageService.sendMessage
    (recipientId,this.messageContent())?.then(()=>{
      this.messageContent.set('');
    })
  }
scrollToBottom(){
    setTimeout(() => {
        if(this.messageEndRef){
            this.messageEndRef.nativeElement.scrollIntoView({ 
                behavior: 'smooth' 
            });
        }
    }, 0);
}
}
