using System.Security.Claims;
using API.Dtos;
using API.Extensions;
using Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountController(SignInManager<AppUser> signInManager) : ControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult> Register([FromBody] RegisterDto dto)
    {
        var user = new AppUser
        {
            Email = dto.Email,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            UserName = dto.Email,



        };
        var result = await signInManager.UserManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded) {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code,error.Description);
            }
            return ValidationProblem();
        }

        return Ok();

    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<ActionResult> Logout()
    {
        await signInManager.SignOutAsync();
        return NoContent();

    }

    [HttpGet("me")]
    public async Task<ActionResult> UserInfo()
    {
        if (User.Identity?.IsAuthenticated == false) return NoContent();

        var user = await GetCurrentUserAsync();

        if (user == null) return Unauthorized();
        return Ok(new
        {
            user.Email,
            user.FirstName,
            user.LastName,
            user.Address
        });
    }

    [Authorize]
    [HttpGet("address")]
    public async Task<ActionResult<AddressDto>> GetAddress()
    {
        var user = await GetCurrentUserAsync();

        if (user?.Address == null) return NotFound();

        return Ok(user.Address.ToDto());
    }

    [Authorize]
    [HttpPut("address")]
    public async Task<ActionResult<AddressDto>> UpdateAddress([FromBody] AddressDto dto)
    {
        var user = await GetCurrentUserAsync();

        if (user == null) return Unauthorized();

        if (user.Address == null)
        {
            user.Address = dto.ToEntity();
        }
        else
        {
            user.Address.UpdateFromDto(dto);
        }

        var result = await signInManager.UserManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }

            return ValidationProblem();
        }

        return Ok(user.Address.ToDto());
    }

    private async Task<AppUser?> GetCurrentUserAsync()
    {
        var email = User.GetEmailAddress();
        if (string.IsNullOrWhiteSpace(email)) return null;

        return await signInManager.UserManager.Users
            .Include(u => u.Address)
            .FirstOrDefaultAsync(u => u.Email == email);
    }
}
