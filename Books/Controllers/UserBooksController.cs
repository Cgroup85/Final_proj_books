using Microsoft.AspNetCore.Mvc;
using Books.Server.BL; 
using System.Collections.Generic;
using System.Data;

namespace Books.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserBooksController : ControllerBase
    {
        private UserBooks _userBooks;

        public UserBooksController()
        {
            _userBooks = new UserBooks(); 
        }

        // שליפת ספרים מספריית המשתמש לפי סטטוס
        [HttpGet("get")]
        public IActionResult GetUserLibrary([FromQuery] int userID, [FromQuery] string status)
        {
            var userBooksList = _userBooks.GetUserLibrary(userID, status);
            if (userBooksList == null)
            {
                return NotFound("No books found for the specified user and status.");
            }
            return Ok(userBooksList);
        }

        [HttpGet("getUserLibrary")]
        public IActionResult GetUserLibrary([FromQuery]int userId)
        {
            var userBooksList = _userBooks.GetUserLibrary(userId);
            if (userBooksList == null)
            {
                return NotFound("No books found for the specified user.");
            }
            return Ok(userBooksList);
        }

        [HttpGet("getBooksNumInLibraries")]
        public IActionResult GetBooksNumInLibraries()
        {
            List<object> userBooksList = _userBooks.GetBooksNumInLibrary();
            if (userBooksList == null)
            {
                return NotFound("No books found for the specified user and status.");
            }
            return Ok(userBooksList);
        }


        ///Add To Purchased
        [HttpPost("addBookToPurchased/{userId}")]
        public IActionResult AddBookToPurchased(int userId, [FromBody] Book book)
        {
            if (book == null || string.IsNullOrEmpty(book.Id))
            {
                return BadRequest("Invalid book data.");
            }
            var status = "purchased";

            try
            {
                var result = _userBooks.AddBookToLibrary(new UserBooks
                {
                    UserID = userId,
                    BookID = book.Id,
                    Status = status
                });

                if (result)
                {
                    return Ok(new { message = "added." });
                }
                else
                {
                    return StatusCode(500, "An error occurred while adding the book to the purchased.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception: {ex.Message}");
                return StatusCode(500, "An unexpected error occurred.");
            }
        }
        //ADD to wish list
        [HttpPost("addBookToWishlist/{userId}")]
        public IActionResult AddBookToWishlist(int userId, [FromBody] Book book)
        {
            if (book == null || string.IsNullOrEmpty(book.Id))
            {
                return BadRequest("Invalid book data.");
            }
            var status = "want to read";

            try
            {
                var result = _userBooks.AddBookToLibrary(new UserBooks
                {
                    UserID = userId,
                    BookID = book.Id,
                    Status = status
                });

                if (result)
                {
                    return Ok(new { message = "Book added to wish list successfully." });
                }
                else
                {
                    return StatusCode(500, "An error occurred while adding the book to the Wishlist.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception: {ex.Message}");
                return StatusCode(500, "An unexpected error occurred.");
            }
        }
        // עדכון סטטוס הספר בספריית המשתמש
        [HttpPut("update-status")]
        public IActionResult UpdateBookStatus([FromQuery] int userID, [FromQuery] string bookID, [FromQuery] string newStatus)
        {
            var result = _userBooks.UpdateBookStatus(userID, bookID, newStatus);
            if (result)
            {
                return Ok(new { message = "Book status updated successfully." });
            }
            return StatusCode(500, "An error occurred while updating the book status.");
        }

        // Adding a book purchase request
        [HttpPost("addBookPurchaseRequest")]
        public IActionResult AddBookPurchaseRequest([FromQuery] int buyerId, [FromQuery] int sellerId, [FromQuery] string bookId)
        {
            var result = _userBooks.AddBookPurchaseRequest(buyerId, sellerId, bookId);
            if (result)
            {
                return Ok(new { message = "Book purchase request added successfully." });
            }
            return StatusCode(500, "An error occurred while adding the book purchase request.");
        }
        // שליפת בקשות רכישת ספר עבור המוכר
        [HttpGet("getPurchaseRequestsForUser/{sellerId}")]
        public IActionResult GetPurchaseRequestsForUser(int sellerId)
        {
            var purchaseRequests = _userBooks.GetPurchaseRequestsForUser(sellerId);
            if (purchaseRequests != null && purchaseRequests.Count > 0)
            {
                return Ok(purchaseRequests);
            }
            return NotFound("No purchase requests found for the specified seller.");
        }

        // עדכון סטטוס של בקשת רכישת ספר
        [HttpPut("updatePurchaseRequestStatus")]
        public IActionResult UpdatePurchaseRequestStatus([FromQuery] int requestId, [FromQuery] string approvalStatus, [FromQuery] DateTime approvalDate)
        {
            var result = _userBooks.UpdateBookPurchaseRequestStatus(requestId, approvalStatus, approvalDate);
            if (result)
            {
                return Ok(new { message = "Book purchase request status updated successfully." });
            }
            return StatusCode(500, "An error occurred while updating the book purchase request status.");
        }
        // ניהול רכישת ספר
        [HttpPost("Transfer-Book")]
        public IActionResult ManagePurchase([FromQuery] int buyerId, [FromQuery] int sellerId, [FromQuery] string bookId)
        {
            var result = _userBooks.TransferBook(buyerId, sellerId, bookId);
            if (result)
            {
                return Ok(new { message = "Purchase processed successfully." });
            }
            return StatusCode(500, "Already have this book.");
        }
    }
}
