using System;

namespace API.Entities;

public class Message
{
    public string Id { get; set; } = Guid.NewGuid().ToString();

    public required string Content { get; set; }

    public DateTime? DateRead { get; set; }

    public DateTime MessageSend { get; set; } = DateTime.UtcNow;

    public bool SenderDeleted { get; set; }

    public bool RecipientDeleted { get; set; }

    //nav property


    public required string SenderId { get; set; }

    public Member Sender { get; set; } = null!;

    public required string RecipientId { get; set; }

    public Member Recipient { get; set; } = null!;



}
