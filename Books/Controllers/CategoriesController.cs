using Books.Server.BL;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Books.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        Category category = new Category();

        // GET: api/<CategoriesController>
        [HttpGet]
        public IEnumerable<Category> Get()
        {
            try
            {
                return category.ReadAllCategories();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        // GET api/<CategoriesController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<CategoriesController>
        [HttpPost]
        public IActionResult Post([FromBody] Category c)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                category.insertAllCategories(c);
                return Ok(new { message = "Categories inserted successfully" });
            }
            catch (Exception ex)
            {
                return NotFound(new { message = "Categories error" });
            }
        }

        // פונקציה חדשה לשאיבת ספרים מומלצים למשתמש
        [HttpGet("recommend/{userId}")]
        public IActionResult GetRecommendedBooksByCategory(int userId)
        {
            try
            {
                var recommendedBooks = category.GetRecommendedBooksByCategory(userId);
                if (recommendedBooks == null)
                {
                    return NotFound(new { message = "No recommendations found for this user." });
                }
                return Ok(recommendedBooks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching recommended books.", error = ex.Message });
            }
        }

        // PUT api/<CategoriesController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<CategoriesController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
