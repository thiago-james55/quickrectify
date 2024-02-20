using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using QuickRectify.Models;
using QuickRectify.Models.DTO;
using QuickRectify.Service;

namespace QuickRectify.Controllers
{
    [ApiController]
    [Route("controller")]
    public class OrdersController : ControllerBase
    {
        private readonly RequestService _requestService;

        public OrdersController(RequestService requestService) {
            _requestService = requestService;
        }

        [HttpGet]
        public async Task<ActionResult> GetAllOrders()
        {
            List<OrderDTO> ordersDTO = await _requestService.GetAllOrdersAsync();
            if (ordersDTO.Count > 0)
            {
                return Ok(ordersDTO);
            }

            return StatusCode(500, "Error fetching orders from the database. Please try again.");
            
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetOrderById(int id)
        {
            OrderDTO orderDTO = await _requestService.GetOrderByIdAsync(id);

            if (orderDTO != null)
            {
                return Ok(orderDTO);
            }

            return StatusCode(500, $"Error order with {id} not found!");
        }

        [HttpPost]
        public async Task<ActionResult> SaveOrder([FromBody] OrderInput order)
        { 

            OrderDTO orderDTO = await _requestService.SaveOrderAsync(order);

        
            if (orderDTO != null)
            {
                return CreatedAtAction(nameof(GetOrderById), new { id = orderDTO.Id }, orderDTO);

            } else
            {

                return StatusCode(500, "Error order not created!");

            }

        }


    }
}
