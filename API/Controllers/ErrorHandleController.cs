using API.Dtos;
using Core.Entities;
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
    public ActionResult GetValidationError( )
    {
        return StatusCode(500);
    }

    [HttpPost("validationerror")]
    public ActionResult GetValidationError([FromBody] CreateProductDto product)
    {
     
        
        return Ok();
    }


    
}

