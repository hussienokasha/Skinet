using System.Security.Claims;
using API.Dtos;
using Core.Entities;

namespace API.Extensions;

public static class ClaimsPrincipleExtensions
{
    public static string GetEmailAddress(this ClaimsPrincipal user)
    {
        return user.FindFirstValue(ClaimTypes.Email) ?? string.Empty;
    }

    public static AddressDto ToDto(this Address address)
    {
        return new AddressDto
        {
            Line1 = address.Line1,
            Line2 = address.Line2,
            City = address.City,
            State = address.State,
            Country = address.Country,
            ZipCode = address.ZipCode
        };
    }

    public static Address ToEntity(this AddressDto dto)
    {
        return new Address
        {
            Line1 = dto.Line1,
            Line2 = dto.Line2,
            City = dto.City,
            State = dto.State,
            Country = dto.Country,
            ZipCode = dto.ZipCode
        };
    }

    public static void UpdateFromDto(this Address address, AddressDto dto)
    {
        address.Line1 = dto.Line1;
        address.Line2 = dto.Line2;
        address.City = dto.City;
        address.State = dto.State;
        address.Country = dto.Country;
        address.ZipCode = dto.ZipCode;
    }
}
