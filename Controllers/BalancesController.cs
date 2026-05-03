using Microsoft.AspNetCore.Mvc;
using QuickRectify.Models;
using QuickRectify.Models.DTO;
using QuickRectify.Models.Input;
using QuickRectify.Service;

namespace QuickRectify.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BalancesController : ControllerBase
    {
        private readonly RequestService _requestService;

        public BalancesController(RequestService requestService)
        {
            _requestService = requestService;
        }

        [HttpGet("{id}", Name = "GetBalanceByIdAsync")]
        public async Task<ActionResult> GetBalanceByIdAsync(int id)
        {
            BalanceDTO balanceDTO = await _requestService.GetBalanceByIdAsync(id);

            if (balanceDTO != null) return Ok(balanceDTO);
            else return NotFound($"Balance with {id} not found!");
        }

        [HttpGet("orders/{id}", Name = "GetBalanceOrders")]
        public async Task<ActionResult> GetBalanceOrders(int id)
        {
            List<OrderDTO> ordersDTOs = await _requestService.GetBalanceOrders(id);

            if (ordersDTOs != null) return Ok(ordersDTOs);
            else return NotFound($"Balance with {id} not found!");
        }

        [HttpGet("fromYear/{year}", Name = "GetBalancesByYear")]
        public async Task<ActionResult> GetBalancesByYear(int year)
        {
            if (year <= 0)
                year = DateTime.Now.Year;

            var balancesDTO = await _requestService.GetBalancesOfYearAsync(year);

            if (balancesDTO == null || !balancesDTO.Any())
                return NotFound($"Balances of year {year} not found!");

            return Ok(balancesDTO);
        }

        [HttpPost]
        public async Task<ActionResult> PostBalance([FromBody] BalanceInput balanceInput)
        {
            int savedBalanceId = await _requestService.SaveBalanceAsyncAndReturnId(balanceInput);

            if (savedBalanceId > 0)
            {
                var id = new { id = savedBalanceId };
                return CreatedAtRoute("GetBalanceByIdAsync", id, id);

            }
            else return StatusCode(500, "Error Balance not created!");
        }

        [HttpPut]
        public async Task<ActionResult> PutBalance([FromBody] BalanceInput balanceInput)
        {
            bool balanceExists = await _requestService.BalanceExistsAsync(balanceInput.Id);

            if (!balanceExists) return NotFound($"Balance with ID {balanceInput.Id} not found.");

            bool updateSuccessful = await _requestService.UpdateBalanceAsync(balanceInput);
            if (updateSuccessful) return Ok(true);
            else return StatusCode(500, "Error updating the Balance. Please try again.");
        }

        [HttpPut("paid", Name = "PutBalanceToPaid")]
        public async Task<ActionResult> PutBalanceToPaid([FromBody] BalanceInput balanceInput)
        {
            bool balanceExists = await _requestService.BalanceExistsAsync(balanceInput.Id);

            if (!balanceExists) return NotFound($"Balance with ID {balanceInput.Id} not found.");

            bool updateSuccessful = await _requestService.UpdateBalanceToPaid(balanceInput);

            if (updateSuccessful) return Ok(true);
            else return StatusCode(500, "Error updating the Balance. Please try again.");
        }

        [HttpPut("simplePaid", Name = "SimplePutOrdersToPaid")]
        public async Task<ActionResult> GetBalanceByIdAsync([FromBody] SimpleBalanceInput simpleBalanceInput )
        {
            bool consumerExists = await _requestService.ConsumerExistsAsync(simpleBalanceInput.ConsumerId);

            if (!consumerExists) return NotFound($"Consumer with ID {simpleBalanceInput.ConsumerId} not found.");

            bool updateSuccessful = await _requestService.UpdateSimpleBalanceToPaid(simpleBalanceInput);
            if (updateSuccessful) return Ok(true);
            else return StatusCode(500, "Error updating the Balance. Please try again.");
        }

    }
}
