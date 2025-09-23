import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Member } from '../../Types/member';
import { PaginatedResult } from '../../Types/pagination';

@Injectable({
  providedIn: 'root'
})
export class LikesServices {
  private baseUrl = environment.apiUrl;
  private http =inject(HttpClient);
  likeIds = signal<string[]>([]);

  toggleLike(targetMemberId:string){
    return this.http.post(`${this.baseUrl}likes/${targetMemberId}`,{});
  }
  getLikes(predicate:string,pageNumber: number,pageSize: number){
   let params = new HttpParams();

    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);
    params = params.append('predicate', predicate);

    return this.http.get<PaginatedResult<Member>>(this.baseUrl + 'likes',{params});
  }
  getLikesIds(){
    return this.http.get<string[]>(this.baseUrl + 'likes/lists')
    .subscribe({
      next: ids => this.likeIds.set(ids)
      });
  }
  ClearLikesIds(){
   this.likeIds.set([]);   
  }
}
