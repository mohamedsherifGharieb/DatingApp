using System;
using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface ILikesRepository
{

    Task<MemberLike?> GetMemberLike(string SoruceMemberId, string TargetMemberId);
    Task<PaginatedResult<Member>> GetMembersLikes(LikesParams likesParams);

    Task<IReadOnlyList<string>> GetCurrentLikeIds(string memberId);

    void Delete(MemberLike like);

    void AddLike(MemberLike like);


}
