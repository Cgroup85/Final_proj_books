using Microsoft.AspNetCore.Mvc;
using Books.Server.BL;
// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Books.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthorsController : ControllerBase
    {
        Author author = new Author();
        // GET: api/<AuthorsController>
        [HttpGet]
        public IEnumerable<Author> Get()
        {
            try
            {
                return author.ReadAllAuthors();

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        // GET api/<AuthorsController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }
        // Get Books by Author
        // GET api/<AuthorsController>/5/
        [HttpGet("GetBooksByAuthor{authorId}")]
        public IActionResult GetBooksByAuthor(int authorId)
        {
            try
            {

                var books = author.getBooksByAuthor(authorId);
                return Ok(books);
            }
            catch
            {
                return NotFound(new { message = "Not Working well" });
            }
        }

        [HttpGet("getAuthorsNumberInLibraries")]
        public IActionResult GetAuthorsNumberInLibraries()
        {
            List<object> authorsList = author.GetAuthorsNumInLibraries();
            if (authorsList == null)
            {
                return NotFound("No books found for the specified user and status.");
            }
            return Ok(authorsList);
        }

        // POST api/<AuthorsController>
        [HttpPost]
        public IActionResult Post([FromBody] Author a)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                author.insertAllAuthors(a);
                return Ok(new { messasge = "Authors inserted successfully." });
            }
            catch (Exception ex)
            {
                return NotFound(new { message = "Authors erorr" });
            }
        }
        
        // PUT api/<AuthorsController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<AuthorsController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
