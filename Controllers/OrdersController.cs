using Microsoft.AspNetCore.Mvc;
using QuickRectify.Models;
using QuickRectify.Models.DTO;
using QuickRectify.Models.Input;
using QuickRectify.Service;

namespace QuickRectify.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly RequestService _requestService;

        public OrdersController(RequestService requestService) {
            _requestService = requestService;
        }

        [HttpGet]
        public async Task<ActionResult> GetAllOrdersOfThisYearAsync()
        {
            List<OrderDTO> ordersDTO = await _requestService.GetAllOrdersOfThisYearAsync();

            if (ordersDTO != null)
            {
                if (ordersDTO.Count > 0) return Ok(ordersDTO);
                else return NotFound("No orders of current year found!");
            }

            return null;
            
        }

        [HttpPost("fromDate")]
        public async Task<ActionResult> GetAllOrdersOfThatYearAsync([FromBody] DateFilterInputString dateFilterString)
        {

            DateFilterInput dateFilterInput = dateFilterString.ToDateFilterInput();

            if (dateFilterInput.Initial == null && dateFilterInput.Final == null)
            {
                return BadRequest("Invalid date filter parameters.");
            }

            List<OrderDTO> ordersDTO = await _requestService.GetAllOrdersOfDateAsync(dateFilterInput);
            if (ordersDTO != null)
            {
                if (ordersDTO.Count > 0) return Ok(ordersDTO);
                else  return NotFound("No orders with this filter found!");
            } 
            

           return null;
        }

        [HttpGet("{id}", Name = "GetOrderByIdAsync")]
        public async Task<ActionResult> GetOrderByIdAsync(int id)
        {
            OrderDTO orderDTO = await _requestService.GetOrderByIdAsync(id);

            if (orderDTO != null) return Ok(orderDTO);
            else return NotFound($"Error order with {id} not found!");
        }

        [HttpPost]
        public async Task<ActionResult> SaveOrderAsync([FromBody] OrderInput order)
        { 

            int savedOrderId = await _requestService.SaveOrderAsyncAndReturnId(order);
                    
            if (savedOrderId > 0)
            {
                var id = new { id = savedOrderId };
                return CreatedAtRoute("GetOrderByIdAsync", id, id);

            } else return StatusCode(500, "Error order not created!");

        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateOrderAsync(int id, [FromBody] OrderInput orderToUpdate)
        {
            bool orderExists = await _requestService.OrderExistsAsync(id);

            if (!orderExists) return NotFound($"Order with ID {id} not found.");

            bool updateSuccessful = await _requestService.UpdateOrderAsync(id, orderToUpdate);

            if (updateSuccessful) return NoContent();
            else return StatusCode(500, "Error updating the order. Please try again.");

        }


        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteOrderAsync(int id)
        {
            bool orderExists = await _requestService.OrderExistsAsync(id);

            if (!orderExists) return NotFound($"Order with ID {id} not found.");

            bool deletedSuccessful = await _requestService.DeleteOrderAsync(id);

            if (deletedSuccessful) return NoContent();
            else return StatusCode(500, "Error deleting the consumer. Please try again.");

        }


    }
}
