using System;
using API.Controllers;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API;

public class LikesController(IUnitOfWork unitOfWork) : BaseApiController
{
    [HttpPost("{targetMemberId}")]
    public async Task<ActionResult> ToggleLike(string targetMemberId)
    {
        var sourceMemberId = User.GetMemberId();

        if (sourceMemberId == targetMemberId) return BadRequest("You cannot Like Yourself");

        var existingLike = await unitOfWork.LikesRepository.GetMemberLike(sourceMemberId, targetMemberId);

        if (existingLike == null)
        {
            var like = new MemberLike
            {
                SourceMemberId = sourceMemberId,
                TargetMemberId = targetMemberId
            };

            unitOfWork.LikesRepository.AddLike(like);
        }
        else
        {
            unitOfWork.LikesRepository.Delete(existingLike);
        }
        if (await unitOfWork.Complete()) return Ok();
        return BadRequest("Failed to Update Like");
    }

    [HttpGet("lists")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetCurrentMemberLikeIds()
    {
        return Ok(await unitOfWork.LikesRepository.GetCurrentLikeIds(User.GetMemberId()));
    }
    [HttpGet]
    public async Task<ActionResult<PaginatedResult<Member>>> GetMemberLikes([FromQuery] LikesParams likesParams)
    {
        likesParams.MemberId = User.GetMemberId();
        var members = await unitOfWork.LikesRepository.GetMembersLikes(likesParams);
        return Ok(members);

    }
}
