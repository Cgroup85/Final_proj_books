const booksApiURL = "https://proj.ruppin.ac.il/cgroup85/test2/tar1/api/Books";
const userBooksApiUrl = "https://proj.ruppin.ac.il/cgroup85/test2/tar1/api/UserBooks";

const allEBooks = [];
var user = JSON.parse(sessionStorage.getItem('user'));
var modal = $('#booksModal');
var span = $('.close');

$(document).ready(function () {

    const toggleModeCheckbox = document.getElementById('toggle-mode');
    const currentTheme = localStorage.getItem('theme');

    // Apply the saved theme on load
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        toggleModeCheckbox.checked = true;
    } else {
        document.body.classList.remove('dark-mode');
    }

    // Toggle dark mode and save the theme
    toggleModeCheckbox.addEventListener('change', function () {
        if (this.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    });

    $('#homeBtn').on('click', function () {
        window.location.href = "../Pages/index.html";
    });
   
    async function getEBooksDataFromDB() {
        await ajaxCall("GET", `${booksApiURL}/GetAllEBooks`, "", getEBooksDataFromDBSCB, getEBooksDataFromDBECB);
    }

    function getEBooksDataFromDBSCB(result) {
        console.log(result);
        allEBooks.push(result);
        renderAllEBooksDisplay(result);
    }

    function getEBooksDataFromDBECB(err) {
        console.log(err);
    }

    function renderAllEBooksDisplay(ebooks) {
        var ebooksContainer = $('#ebooks-container');
        ebooksContainer.empty();
        if (ebooks.length === 0) {
            var ebookElement = $('<div>');
            ebookElement.addClass("didnt-find");
            ebookElement.append('<h2>' + 'We are sorry, we could not find any books that match your search.' + '<h2/>');
            ebookElement.append('<h3>' + 'Please try again with a different search...' + '</h3>');
            ebooksContainer.append(ebookElement);

        }
        else {

            ebooksContainer.empty();
            ebooks.forEach(ebook => {
                var ebookElement = $('<div>');
                ebookElement.addClass('ebook');
                ebookElement.append('<img src="' + ebook.image + '" alt="book image" />');
                ebookElement.append('<h3>' + ebook.title + '</h3>');
                ebookElement.append('<p>' + 'By: ' + ebook.authorNames + '</p>');
                ebookElement.append('<p>' + 'Price: ' + ebook.price + ' ILS' + '</p>');

                var addToWishlistBtn = $('<button class="wishlistButton" data-book-id="' + ebook.id + '">🤍</button>');
                ebookElement.append(addToWishlistBtn);
                addWishlistClick(addToWishlistBtn); // הפעלה של הפונקציה

                var addBookBtn = $('<p><button id="' + ebook.id + '" class="add-book">Buy Book</button></p>');
                ebookElement.append(addBookBtn);

                var moreDetails = $('<p id="' + ebook.id + '" class="more-details">More Details</button></p>');
                ebookElement.append(moreDetails);

                ebooksContainer.append(ebookElement);
                addBookClick(addBookBtn);
                showMoreDetails(moreDetails, ebook);
            });
        }
    }


    modal.css('display', 'none');
    span.on('click', function () {
        modal.css('display', 'none');
    });

    $(window).on('click', function (event) {
        if (event.target === $('#booksModal')[0]) {
            $('#booksModal').hide();
        }
    });

   
    function showMoreDetails(moreDetails, book) {
        moreDetails.on('click', function () {
            modal.css('display', 'block');
            $('#modal-content').children().slice(1).remove();
            renderBooksModal(book);
        });
    }

    function renderBooksModal(book) {
        var modalContent = $('#modal-content');
        var bookModal = {};
        //search for the book in allBooks
        allEBooks.forEach(function (books) {
            books.forEach(function (b) {
                if (b.id === book.id) {
                    bookModal = b;
                }
            });
        });
        console.log(book.id)
        console.log(bookModal);
        var bookElement = $('<div>');
        bookElement.addClass('bookModal');
        bookElement.append('<img src="' + bookModal.image + '" alt="book image" />');
        bookElement.append('<h3>' + bookModal.title + '</h3>');
        bookElement.append('<h5>' + bookModal.subtitle + '</h5>');
        bookElement.append('<p>' + 'Publisher: ' + bookModal.publisher + '</p>');
        bookElement.append('<p>' + 'Published Date: ' + bookModal.publishedDate + '</p>');
        bookElement.append('<p>' + 'Language: ' + bookModal.language + '</p>');
        bookElement.append('<p>' + 'Page Count: ' + bookModal.pageCount + '</p>');
        bookElement.append('<p>' + 'Description: ' + bookModal.description + '</p>');
        bookElement.append('<p>' + 'By: ' + bookModal.authorNames + '</p>');
        bookElement.append('<p>' + 'Price: ' + bookModal.price + ' ILS' + '</p>');

        modalContent.append(bookElement);

    }
    function isLoggedIn() {
        return sessionStorage.getItem('user') !== null;
    }


    // Function to add a book to the wishlist
    function addBookToWishlist(userId, bookId) {
        const api = `${userBooksApiUrl}/addBookToWishlist/${userId}`;
        const data = getBookById(bookId);
        ajaxCall(
            'POST',
            api,
            JSON.stringify(data),
            function (response) {
                console.log("Success:", response);
                alert("Added");
                $(`button[data-book-id="${bookId}"]`).addClass('filled').text('❤️'); // Update button state on success
            },
            function (error) {
                console.error("Error:", error);
                alert("Book was already added");
            }
        );
    }
    // Add event listener for wishlist button click
    function addWishlistClick(wishlistBtn) {
        wishlistBtn.on('click', function () {
            const bookId = $(this).data('book-id');
            const userId = user.id; // Fetch the current user ID
            if (userId) {
                // Add book to wishlist
                addBookToWishlist(userId, bookId);

                // Optionally toggle button appearance based on success
                $(this).toggleClass('filled');
            } else {
                alert("User not logged in.");
            }
        });
    }
    //to be deleted
    function getBookById(bookId) {
        // This function should retrieve book details by its ID
        // You might need to implement an API call or a local function to fetch book details
        // For now, returning a mock book object
        return {
            Id: bookId,
            Title: "Example Book Title",
            Subtitle: "Example Subtitle",
            Language: "English",
            Publisher: "Example Publisher",
            PublishedDate: "2024-01-01",
            Description: "Example book description.",
            PageCount: 300,
            PrintType: "BOOK",
            SmallThumbnail: "http://example.com/small.jpg",
            Thumbnail: "http://example.com/large.jpg",
            SaleCountry: "US",
            Saleability: "FOR_SALE",
            IsEbook: false,
            AccessCountry: "US",
            Viewability: "PARTIAL",
            PublicDomain: false,
            TextToSpeechPermission: "ALLOWED",
            EpubIsAvailable: true,
            EpubDownloadLink: "http://example.com/epub",
            EpubAcsTokenLink: "http://example.com/epub-token",
            PdfIsAvailable: true,
            PdfDownloadLink: "http://example.com/pdf",
            PdfAcsTokenLink: "http://example.com/pdf-token",
            WebReaderLink: "http://example.com/reader",
            AccessViewStatus: "SAMPLE",
            QuoteSharingAllowed: true,
            TextSnippet: "Sample text snippet.",
            Price: 29.99,
            ExtarctedText: "Sample extracted text."
        };
    }

    // Function to add a book to the purchased list
    function addBookToPurchased(userId, book) {
        const api = `${userBooksApiUrl}/addBookToPurchased/${userId}`;
        const data = JSON.stringify(book);

        // Print the API URL and data being sent to the console
        console.log("API URL:", api);
        console.log("Request Data:", data);

        ajaxCall(
            'POST',
            api,
            data,
            function (response) {
                console.log("Success:", response);
                alert("The book added");
                // Update UI on success, e.g., change button state
            },
            function (error) {
                console.error("Error:", error);
                alert("You already added this book.");
            }
        );
    }

    // Event listener for add book button
    function addBookClick(addBookBtn) {
        addBookBtn.on('click', function (event) {
            if (event.target.tagName.toLowerCase() === 'button') {
                const buttonId = event.target.id;
                console.log("Button clicked with ID:", buttonId);

                if (isLoggedIn()) {
                    const user = JSON.parse(sessionStorage.getItem('user'));
                    // Assuming you have a way to get the book details by ID
                    const book = getBookById(buttonId); // You need to implement this function
                    addBookToPurchased(user.id, book);
                } else {
                    console.log("User not logged in. Redirecting to login.");
                    alert("Please login or register to add book.");
                    window.location.href = "login.html";
                }
            }
        });
    }

    function searchEBooks() {

        const query = $('#search-input').val();
        const filterdEBooks = []
        allEBooks.forEach(function (books) {
            books.forEach(function (book) {

                // check if the query is in the title of the book with no case sensitivity
                if (book.title.toLowerCase().includes(query.toLowerCase()) ||
                    book.authorNames.toLowerCase().includes(query.toLowerCase()) ||
                    book.description.toLowerCase().includes(query.toLowerCase())) {
                    filterdEBooks.push(book);
                }

            });

        });
        renderAllEBooksDisplay(filterdEBooks);

    }

    getEBooksDataFromDB();

    $('#searchBtn').on('click', function () {
        searchEBooks();
    });

    const authorsBtn = document.getElementById("authorsBtn");
    //jquery click event
    $(authorsBtn).click(function () {
        window.location.href = "authors.html";
    });

    const loginBtn = document.getElementById("loginBtn");
    $(loginBtn).click(function () {
        window.location.href = "login.html";
    });

    const logoutbtn = document.getElementById("logoutBtn");

    $(logoutbtn).click(function () {
        sessionStorage.clear();
        window.location.href=("index.html");
    });


    const registerbtn = document.getElementById("registerBtn");

    $(registerbtn).click(function () {
        window.location.href = "register.html";
    });

    const adminbtn = document.getElementById("adminBtn");

    $(adminBtn).click(function () {
        window.location.href = "admin.html";
    });

    const myBooks = document.getElementById("myBooksBtn");
    $(myBooks).click(function () {
        window.location.href = "myBooks.html";

    });
    const wishlistBtn = document.getElementById("wishlistBtn");
    $(wishlistBtn).click(function () {
        window.location.href = "wishList.html";
    });

    const purchaseBooksBtn = document.getElementById("purchaseBooksBtn");
    $(purchaseBooksBtn).click(function () {
        window.location.href = "transferBook.html";
    });

    const mypurchaserequestsBtn = document.getElementById("mypurchaserequestsBtn");
    $(mypurchaserequestsBtn).click(function () {
        window.location.href = "purchaseRequests.html";
    });

    const quizBtn = document.getElementById("quizBtn");
    $(quizBtn).click(function () {
        window.location.href = "quiz.html";
    });

    // Check user status and display appropriate buttons
    if (user && !user.isAdmin) {
        $('#logoutBtn').show();
        $('#loginBtn').hide();
        $('#registerBtn').hide();
        $('#myBooksBtn').show();
        $('#wishlistBtn').show();
        $('#adminBtn').hide();
        $('#purchaseBooksBtn').show();
        $('#mypurchaserequestsBtn').show();
        $('#quizBtn').show();
    } else if (user && user.isAdmin) {
        $('#logoutBtn').show();
        $('#loginBtn').hide();
        $('#registerBtn').hide();
        $('#myBooksBtn').show();
        $('#wishlistBtn').show();
        $('#adminBtn').show();
        $('#purchaseBooksBtn').hide();
        $('#mypurchaserequestsBtn').hide();
        $('#quizBtn').hide();
    } else {
        $('#logoutBtn').hide();
        $('#loginBtn').show();
        $('#registerBtn').show();
        $('#myBooksBtn').hide();
        $('#wishlistBtn').hide();
        $('#adminBtn').hide();
        $('#purchaseBooksBtn').hide();
        $('#mypurchaserequestsBtn').hide();
        $('#quizBtn').hide();
    }
});