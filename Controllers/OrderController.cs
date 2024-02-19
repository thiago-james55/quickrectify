using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using QuickRectify.Service;

namespace QuickRectify.Controllers
{
    [ApiController]
    [Route("orders")]
    public class OrderController
    {
        private readonly RequestService _requestService;

        public OrderController(RequestService requestService) {
            _requestService = requestService;
        }

        [HttpGet]
        public String Get()
        {

            return json;
            

        }
    }
}
