using System;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class MessagesController(IUnitOfWork unitOfWork) : BaseApiController
{
    [HttpPost]
    public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMessageDto)
    {
        var sender = await unitOfWork.MemberRepository.GetMemberByIdAsync(User.GetMemberId());
        var recipient = await unitOfWork.MemberRepository.GetMemberByIdAsync(createMessageDto.RecipientId);

        if (recipient == null || sender == null || sender.Id == createMessageDto.RecipientId)
        {
            return BadRequest("Cannot send this Message");
        }
        var message = new Message
        {
            SenderId = sender.Id,
            RecipientId = recipient.Id,
            Content = createMessageDto.Content
        };

        unitOfWork.MessageRepository.AddMEssage(message);

        if (await unitOfWork.Complete()) return message.ToDto();

        return BadRequest("Failed to send Message");

    }
    [HttpGet]
    public async Task<ActionResult<PaginatedResult<MessageDto>>>
    GetMessageBycontainer([FromQuery] MessageParams messageParams)
    {
        messageParams.MemberId = User.GetMemberId();

        return await unitOfWork.MessageRepository.GetMessageForMember(messageParams);

    }
    [HttpGet("thread/{recipientId}")]
    public async Task<ActionResult<IReadOnlyList<MessageDto>>> GetMessageThread(string recipientId)
    {
        return Ok(await unitOfWork.MessageRepository.GetMessageThread(User.GetMemberId(), recipientId));
    }
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteMessage(string id)
    {
        var memberId = User.GetMemberId();
        var message = await unitOfWork.MessageRepository.GetMessage(id);

        if (message == null) return BadRequest("Cannot Delete this message");

        if (message.SenderId != memberId && message.RecipientId != memberId)
            return BadRequest("Cannot Delete this message");
        if (message.SenderId == memberId) message.SenderDeleted = true;
        if (message.RecipientId == memberId) message.RecipientDeleted = true;

        if (message is { SenderDeleted: true, RecipientDeleted: true })
        {
            unitOfWork.MessageRepository.DeleteMessage(message);
        }
        if (await unitOfWork.Complete()) return Ok();

        return BadRequest("Problem Delete this message"); 
   }
}
