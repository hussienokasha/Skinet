using System.Security.Claims;
using API.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ErrorHandleController : ControllerBase
{
    
    [HttpGet("unauthorized")]
    public ActionResult<JsonResult> GetUnauthorized()
    {
        return Unauthorized();
    }
    [HttpGet("notfound")]
    public ActionResult GetNotFound()
    {
        return NotFound();
    }
    [HttpGet("badrequest")]
    public ActionResult GetBadRequest()
    {
        return BadRequest();
    }
    [HttpGet("servererror")]
    public ActionResult GetServerError()
    {
        throw new Exception("This is a server error");
    }
    [HttpGet("validationerror")]
    public ActionResult GetValidationError()
    {
        return BadRequest(new { error = "This is a validation error" });
    }

    [HttpPost("validationerror")]
    public ActionResult GetValidationError([FromBody] CreateProductDto product)
    {
     
        
        return Ok();
    }
    [Authorize]
    [HttpGet("secret")]
    public ActionResult GetSecret()
    {
        
        var name = User.FindFirst(ClaimTypes.Name)?.Value;
        var id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Ok("name is " +name+ " id is " +id);
    }

    
}

