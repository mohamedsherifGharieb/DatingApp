import { Component, computed, inject, input } from '@angular/core';
import { Member } from '../../../Types/member';
import { RouterLink } from '@angular/router';
import { AgePipe } from '../../../core/pipes/age-pipe';
import { LikesServices } from '../../../core/services/likes-services';
import { PresenceService } from '../../../core/services/presence-service';

@Component({
  selector: 'app-member-card',
  imports: [RouterLink,AgePipe],
  templateUrl: './member-card.html',
  styleUrl: './member-card.css'
})
export class MemberCard{
  private likeService = inject(LikesServices);
  member = input.required<Member>();
  private presenceService = inject(PresenceService);
protected isOnline = computed(
    () => this.presenceService
    .onlineUser().includes(this.member().id)
  )
  protected hasLiked = computed(
    () => this.likeService
    .likeIds().includes(this.member().id)
  )
  toggleLike(event: Event){
    event.stopPropagation();//to stop redirecting to user profile
    this.likeService.toggleLike(this.member().id)
   }
}
