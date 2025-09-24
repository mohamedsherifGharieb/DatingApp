import { Component, inject, OnInit, signal } from '@angular/core';
import { MessageServices } from '../../core/services/message-services';
import { PaginatedResult } from '../../Types/pagination';
import { Message } from '../../Types/Message';
import { Paginator } from '../../shared/paginator/paginator';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-messages',
  imports: [Paginator, RouterLink, DatePipe],
  templateUrl: './messages.html',
  styleUrl: './messages.css'
})
export class Messages implements OnInit {
  private messageService = inject(MessageServices);
  protected container = 'Inbox';
  protected pageNumber = 1;
  protected fetchedContainer = 'Inbox';
  protected pageSize = 10;
  protected paginatedMessages = signal<PaginatedResult<Message> | null>(null);

  tabs = [
    { label: 'Inbox', value: 'Inbox' },
    { label: 'Outbox', value: 'Outbox' },
  ]

  get isInbox() {
    return this.fetchedContainer === 'Inbox';
  }

  setContainer(container: string) {
    this.container = container;
    this.pageNumber = 1;
    this.loadMessages();
  }

  onPageChange(event: { pageNumber: number, pageSize: number }) {
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageNumber;
    this.loadMessages();
  }

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages() {
    this.messageService.getMessages(this.container, this.pageNumber, this.pageSize)
      .subscribe({
        next: res => {
          this.paginatedMessages.set(res);
          this.fetchedContainer = this.container;
        }
      })
  }

  deleteMessage(event:Event , id: string){
    event.stopPropagation();
    this.messageService.deleteMessage(id).subscribe({
      next:() => {
        const current = this.paginatedMessages();
        if(current?.items){
          this.paginatedMessages.update(prev =>
          {
            if(!prev) return null;
            const newItems = prev.items.filter(x=>x.id != id) || []
            return {
            items:newItems,
            metadata:prev.metadata
          }
          }
          )
        }
      }
    })

  }
  
}
