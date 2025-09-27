using System.Security.Claims;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class MembersController(IUnitOfWork unitOfWork
    , IPhotoService photoService) : BaseApiController
    {

        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<Member>>>
        GetMembers([FromQuery]MemberParams memberParams)
        {
            memberParams.CurrentMemberId = User.GetMemberId();
            
            return Ok(await unitOfWork.MemberRepository.GetMembersAsync(memberParams));
        }
        [HttpGet("{id}")] //api/members/
        public async Task<ActionResult<Member>> GetMember(string id)
        {
            var user = await unitOfWork.MemberRepository.GetMemberByIdAsync(id);
            if (user == null) return NotFound();
            return user;
        }
        [HttpGet("{id}/photos")]
        public async Task<ActionResult<IReadOnlyList<Photo>>> GetMemberPhotos(string id)
        {
            return Ok(await unitOfWork.MemberRepository.GetPhotosForMemberAsync(id));
        }
        [HttpPut]
        public async Task<ActionResult> UpdateMember(MemberUpdateDto memberUpdateDto)
        {
            var memberId = User.GetMemberId();

            var member = await unitOfWork.MemberRepository.getMemberForUpdate(memberId);

            if (member == null) return BadRequest("Could not get membe");

            member.DisplayName = memberUpdateDto.DisplayName ?? member.DisplayName;
            member.Description = memberUpdateDto.Description ?? member.Description;
            member.City = memberUpdateDto.City ?? member.City;
            member.Country = memberUpdateDto.Country ?? member.Country;
            member.User.DisplayName = memberUpdateDto.DisplayName ?? member.User.DisplayName;

            // memberRepository.Update(member); // optional line  to ensure no bad request

            if (await unitOfWork.Complete()) return NoContent();

            return BadRequest("Failed to update Member");
        }
        [HttpPost("add-photo")]
        public async Task<ActionResult<Photo>> AddPhoto([FromForm] IFormFile file)
        {
            var member = await unitOfWork.MemberRepository.getMemberForUpdate(User.GetMemberId());
            if (member == null) return BadRequest("Cannot Update Memmber");

            var result = await photoService.UploadPhotoAsync(file);

            if (result.Error != null) return BadRequest(result.Error.Message);

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId,
                MemberId = User.GetMemberId()
            };
            if (member.ImageUrl == null)
            {
                member.ImageUrl = photo.Url;
                member.User.ImageUrl = photo.Url;
            }
            member.Photos.Add(photo);

            if (await unitOfWork.Complete()) return photo;

            return BadRequest("Problem adding Photo");
        }
        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var member = await unitOfWork.MemberRepository.getMemberForUpdate(User.GetMemberId());


            if (member == null) return BadRequest("cannot get member from token");

            var photo = member.Photos.SingleOrDefault(x => x.Id == photoId);

            if (member.ImageUrl == photo?.Url || photo == null)
            {
                return BadRequest("cannot set Main Image");
            }

            member.ImageUrl = photo.Url;
            member.User.ImageUrl = photo.Url;

            if (await unitOfWork.Complete()) return NoContent();

            return BadRequest("Problem set Main Image");

        }
        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var member = await unitOfWork.MemberRepository.getMemberForUpdate(User.GetMemberId());

            if (member == null) return BadRequest("Cannot get member from token");

            var photo = member.Photos.SingleOrDefault(x => x.Id == photoId);

            if (photo == null || photo.Url == member.ImageUrl)
            {
                return BadRequest("this is a main Photo Cannot be Deleted");
            }
            if (photo.PublicId != null)
            {
                var result = await photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Error != null) return BadRequest(result.Error.Message);
            }
            member.Photos.Remove(photo);

            if (await unitOfWork.Complete()) return Ok();
            return BadRequest("Problem Deleting the Photo");
        }

    }
}