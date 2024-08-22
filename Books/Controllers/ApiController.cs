using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Books.Server.Controllers
{
    public class ApiController : Controller
    {
        private readonly IConfiguration _configuration;

        public ApiController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("GetApiKey")]
        public IActionResult GetApiKey()
        {
            // Fetch the API key from appsettings.json
            var apiKey = _configuration["ApiKey"];

            // Return the API key (use caution: ensure it's not a sensitive key)
            return Ok(new { ApiKey = apiKey });
        }
    }
}
