using API.DTOs;
using API.Interfaces;
using API.Entities;

namespace API.Extensions;

public static class AppUserExtensions // to extend the AppUser class functionality
{
    public static async Task<UserDto>  ToUserDto(this AppUser user, ITokenService tokenService)
    {
        return new UserDto
        {
            Id = user.Id,
            DisplayName = user.DisplayName,
            Email = user.Email!,
            ImageUrl = user.ImageUrl,
            Token = await tokenService.CreateToken(user)
        };
    }
}
