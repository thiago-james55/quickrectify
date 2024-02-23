using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using QuickRectify.Models;
using QuickRectify.Models.DTO;
using QuickRectify.Models.Input;
using QuickRectify.Service;

namespace QuickRectify.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ConsumersController : ControllerBase
    {
        private readonly RequestService _requestService;

        public ConsumersController(RequestService requestService) {
            _requestService = requestService;
        }

        [HttpGet]
        public async Task<ActionResult> GetAllConsumersAsync()
        {
            List<ConsumerDTO> consumers = await _requestService.GetAllConsumersAsync();

            if (consumers != null)
            {
                if (consumers.Count > 0) return Ok(consumers);
                else return NotFound("No Consumers found!");
            }

            return StatusCode(500, "Error fetching consumers from the database. Please try again.");
            
        }


        [HttpGet("{id}", Name = "GetConsumerByIdAsync")]
        public async Task<ActionResult> GetConsumerByIdAsync(int id)
        {
            ConsumerDTO consumer = await _requestService.GetConsumerByIdAsync(id);

            if (consumer != null)
            {
                return Ok(consumer);
            }

            return StatusCode(500, $"Error consumer with {id} not found!");
        }

        [HttpPost]
        public async Task<ActionResult> SaveConsumerAsync([FromBody] ConsumerInput consumer)
        {
            if (!await _requestService.ConsumerIsUnique(consumer))
            {
                return BadRequest($"Consumer with Name:{consumer.Name} or Document:{consumer.Document} already exits!");
            }

            int savedConsumerId = await _requestService.SaveConsumerAsync(consumer);
                    
            if (savedConsumerId > 0)
            {
                var id = new { id = savedConsumerId };
                return CreatedAtRoute("GetConsumerByIdAsync", id, id);

            } else
            {

                return StatusCode(500, "Error consumer not created!");

            }

        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateConsumerAsync(int id, [FromBody] ConsumerInput consumerToUpdate)
        {
            bool consumerExists = await _requestService.ConsumerExistsAsync(id);

            if (!consumerExists) return NotFound($"Consumer with ID {id} not found.");

            bool updateSuccessful = await _requestService.UpdateConsumerAsync(id, consumerToUpdate);

            if (updateSuccessful)
            {
                return NoContent();
            }
            else
            {
                return StatusCode(500, "Error updating the consumer. Please try again.");
            }

        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteConsumerAsync(int id)
        {
            bool consumerExists = await _requestService.ConsumerExistsAsync(id);

            if (!consumerExists) return NotFound($"Consumer with ID {id} not found.");

            bool consumerHaveOrders = await _requestService.ConsumerHaveOrdersAsync(id);

            if (consumerHaveOrders) return BadRequest($"Consumer with ID {id} have orders related to her.");

            bool deletedSuccessful = await _requestService.DeleteConsumerAsync(id);

            if (deletedSuccessful)
            {
                return NoContent();
            }
            else
            {
                return StatusCode(500, "Error deleting the consumer. Please try again.");
            }

        }


    }
}
