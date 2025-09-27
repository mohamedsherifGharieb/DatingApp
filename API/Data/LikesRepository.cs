using System;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class LikesRepository(AppDbContext context): ILikesRepository
{
    public void AddLike(MemberLike like)
    {
        context.Likes.Add(like);
    }

    public void Delete(MemberLike like)
    {
        context.Likes.Remove(like);
    }

    public async Task<IReadOnlyList<string>> GetCurrentLikeIds(string memberId)
    {
        return await context.Likes.Where(x => x.SourceMemberId == memberId)
        .Select(x => x.TargetMemberId).ToListAsync();
    }

    public async Task<MemberLike?> GetMemberLike(string SoruceMemberId, string TargetMemberId)
    {
        return await context.Likes.FindAsync(SoruceMemberId,TargetMemberId);
    }

    public async Task<PaginatedResult<Member>> GetMembersLikes(LikesParams likesParams)
    {
        var query = context.Likes.AsQueryable();
        IQueryable<Member> result;

        switch (likesParams.Predicate)
        {
            case "liked":
                result = query
               .Where(x => x.SourceMemberId == likesParams.MemberId)
               .Select(x => x.TargetMember);
                break;
            case "likedBy":
                result = query
               .Where(x => x.TargetMemberId == likesParams.MemberId)
               .Select(x => x.SourceMember);
                break;

            default://Mutual
                var likeIds = await GetCurrentLikeIds(likesParams.MemberId);
                result = query
                .Where(x => x.TargetMemberId == likesParams.MemberId
                && likeIds.Contains(x.SourceMemberId))
                .Select(x => x.SourceMember);
                break;
        }
        return await PaginationHelper.CreateAsync(result, likesParams.PageSize, likesParams.PageNumber);
    }


}
