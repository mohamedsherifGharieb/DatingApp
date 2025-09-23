using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace API.Entities;

public class Member
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public DateOnly DateOfBirth { get; set; }

    public string? ImageUrl { get; set; }

    public required string DisplayName { get; set; }
    public DateTime Created { get; set; } = DateTime.UtcNow;
    public DateTime LastActive { get; set; } = DateTime.UtcNow;

    public required string Gender { get; set; }

    public string? Description { get; set; }

    public required string City { get; set; }

    public required string Country { get; set; }

    //Navigation Property
    [ForeignKey(nameof(Id))]
    [JsonIgnore]
    public AppUser User { get; set; } = null!;

    //nav property
    [JsonIgnore]// to ingore it while receving the response
    public List<Photo> Photos { get; set; } = [];

    [JsonIgnore]
    public List<MemberLike> LikeByMembers { get; set; } = [];
    
    [JsonIgnore]

    public List<MemberLike> LikedMembers { get; set; } = [];

}
