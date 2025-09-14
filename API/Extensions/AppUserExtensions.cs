using API.DTOs;
using API.Interfaces;
using API.Entities;

namespace API.Extensions;

public static class AppUserExtensions // to extend the AppUser class functionality
{
    public static UserDto ToDo(this AppUser user, ITokenService tokenService)
    {
        return new UserDto
        {
            Id = user.Id,
            DisplayName = user.DisplayName,
            Email = user.Email,
            Token = tokenService.CreateToken(user)
        };
    }
}
