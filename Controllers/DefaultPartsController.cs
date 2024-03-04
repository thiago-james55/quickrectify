using Microsoft.AspNetCore.Mvc;
using QuickRectify.Models;
using QuickRectify.Models.DTO;
using QuickRectify.Service;

namespace QuickRectify.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DefaultPartsController : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult> GetDefaultPartsAsync() { return Ok(DefaultParts.GetDefaultParts()); }
    }
}
