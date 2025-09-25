using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class AccountController(UserManager<AppUser> userManager, ITokenService tokenService) : BaseApiController
    {
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            var user = new AppUser
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.Email,
                Member = new Member
                {
                    DisplayName = registerDto.DisplayName,
                    City = registerDto.City,
                    Gender = registerDto.Gender,
                    Country = registerDto.Country,
                    DateOfBirth = registerDto.DateOfBirth

                }
            };

            var result = await userManager.CreateAsync(
                user, registerDto.Password
            );
            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError("identity", error.Description);
                }
                return ValidationProblem();
            }
            var roleResult = await userManager.AddToRoleAsync(user, "Member");

            return await user.ToUserDto(tokenService);
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login([FromBody] LoginDto loginDto)
        {
            var user = await userManager.FindByEmailAsync(loginDto.Email);

            if (user == null) return Unauthorized("Invalid email");
             var result = await userManager.CheckPasswordAsync(
                user, loginDto.Password
            );
            if (!result) return Unauthorized("Invalid password");

            return await user.ToUserDto(tokenService);
        }
    
    }
}
