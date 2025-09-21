using System.Runtime.CompilerServices;
using System.Security.Cryptography;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController(AppDbContext context,ITokenService tokenService) : BaseApiController
    {
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await UserExists(registerDto.Email)) return BadRequest("Email is taken");

            var hmac = new HMACSHA512(); // generates random key

            var user = new AppUser
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                PasswordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(registerDto.Password)),// hash password with key
                PasswordSalt = hmac.Key ,// store key
                Member = new Member
                {
                    DisplayName = registerDto.DisplayName,
                    City = registerDto.City,
                    Gender = registerDto.Gender,
                    Country = registerDto.Country,
                    DateOfBirth = registerDto.DateOfBirth

                }
            };

            context.Users.Add(user); // add the user  
            await context.SaveChangesAsync();   // save the changes

        return user.ToDo(tokenService);            
        }

        private async Task<bool> UserExists(string email)
        {
            return await context.Users.AnyAsync(x => x.Email.ToLower() == email.ToLower());
        }
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login([FromBody] LoginDto loginDto)
        {
            var user = await context.Users.SingleOrDefaultAsync(x => x.Email.ToLower() == loginDto.Email.ToLower());
            if (user == null) return Unauthorized("Invalid email");



            using var hmac = new HMACSHA512(user.PasswordSalt); // use the stored key

            var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(loginDto.Password));

            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid password");
            }

        return user.ToDo(tokenService);            
        }

    }
}
