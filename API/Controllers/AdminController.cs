using System;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AdminController(UserManager<AppUser> userManager) : BaseApiController
{
    [Authorize(Policy = "RequireAdminRole")]
    [HttpGet("users-with-roles")]
    public async Task<ActionResult> GetUserWithRoles()
    {
        var users = await userManager.Users.ToListAsync();
        var userList = new List<Object>();

        foreach (var user in users)
        {
            var roles = await userManager.GetRolesAsync(user);
            userList.Add(new
            {
                user.Id,
                user.Email,
                Roles = roles.ToList()
            });
        }

        return Ok(userList);
    }
    [Authorize(Policy = "ModeratePhotoRole")]
    [HttpGet("Photos-to-moderate")]
    public ActionResult GetPhotoForModeration()
    {
        return Ok("only Admin or moderators can ssee this ");
    }
    [Authorize(Policy = "RequireAdminRole")]
    [HttpPost("edit-roles/{userId}")]
    public async Task<ActionResult<IList<string>>> EditRoles(string userId, [FromQuery] string roles)
    {
        if (string.IsNullOrEmpty(roles))
            return BadRequest("you must select at least one role");

        var selectedRoles = roles.Split(",").ToArray();

        var user = await userManager.FindByIdAsync(userId);

        if (user == null)
            return BadRequest("Could not retrieve the User");

        var userRoles = await userManager.GetRolesAsync(user);

        var result = await userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));

        if (!result.Succeeded)
            return BadRequest("failed to add roles");

        result = await userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));

        if(!result.Succeeded)
        return BadRequest("failed to remove roles");

        return Ok(await userManager.GetRolesAsync(user));

    }
    
}
