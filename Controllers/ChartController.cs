using Microsoft.AspNetCore.Mvc;
using QuickRectify.Services;

namespace QuickRectify.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ChartController : ControllerBase
    {
        private readonly ChartService _chartService;

        public ChartController(ChartService chartService)
        {
            _chartService = chartService;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var result = await _chartService.GetDashboardAsync();

            return Ok(result);
        }
    }
}