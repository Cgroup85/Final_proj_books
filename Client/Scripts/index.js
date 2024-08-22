const allData = [];
const allBooksDisplay = [];
const allBooks = [];
const allAuthors = [];
const allCategories = [];
const allBooksAuthors = [];
const allBooksCategories = [];
const maxBooks = 50;
const maxEbooks = 50;
const booksApiURL = "https://proj.ruppin.ac.il/cgroup85/test2/tar1/api/Books";
const authorsApiUrl = "https://proj.ruppin.ac.il/cgroup85/test2/tar1/Authors";
const categoriesApiUrl = "https://proj.ruppin.ac.il/cgroup85/test2/tar1/Categories";                    
const usersApiUrl = "https://proj.ruppin.ac.il/cgroup85/test2/tar1/api/Users";
const userBooksApiUrl = "https://proj.ruppin.ac.il/cgroup85/test2/tar1/api/UserBooks";
var modal = $('#booksModal');
var span = $('.close');
var user = JSON.parse(sessionStorage.getItem('user'));

$(document).ready(function () {

    if (!user) {
        $('#quizBtn').hide();
    }

    const currentTheme = localStorage.getItem('theme');

    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('toggle-mode').checked = true; // Set checkbox to checked if dark mode
    } else if (currentTheme === 'light') {
        document.body.classList.remove('dark-mode');
        document.getElementById('toggle-mode').checked = false; // Set checkbox to unchecked if light mode
    }

    var userWelcome = document.getElementById("userWelcome");
    if (user) {
        userWelcome.innerText = `Welcome ${user.userName}!`;
    }
    else {
        userWelcome.innerText = "Welcome guest!";
    }

    var quizBtn = document.getElementById("quizBtn");
    quizBtn.addEventListener('click', event => {
        window.location.href = "quiz.html";
    });


    async function getBooksDisplayDataFromDB() {
        await ajaxCall("GET", `${booksApiURL}/GetBooksDisplay`, "", getBooksDisplayDataFromDBSCB, getBooksDisplayDataFromDBECB);
    }

    function getBooksDisplayDataFromDBSCB(result) {
        allBooksDisplay.push(result);
        console.log(allBooksDisplay);
        renderAllBooksDisplay(result);
    }

    function getBooksDisplayDataFromDBECB(err) {
        console.log(err);
    }

    var carouselContainer = $('#books-container .carousel');

    function renderAllBooksDisplay(books) {
        // Clear any existing content in the carousel container
        carouselContainer.empty();

        // Create a row to hold the books
        var row = $('<div id="carouselRow" class="carousel-row">');

        const itemsPerPage = 5; // Number of items to display at once
        const totalItems = books.length;

        // Calculate the width of each item based on itemsPerPage
        const itemWidthPercentage = 100 / itemsPerPage;
        console.log(itemWidthPercentage);

        books.forEach(book => {
            var bookElement = $('<div class="carousel-item">').css('width', `${itemWidthPercentage}%`);
            bookElement.append('<img src="' + book.image + '" alt="book image" />');
            bookElement.append('<h3>' + book.title + '</h3>');
            bookElement.append('<p>' + 'By: ' + book.authorNames + '</p>');
            bookElement.append('<p>' + 'Price: ' + book.price + ' ILS' + '</p>');

            // "Add to Wishlist" button
            var addToWishlistBtn = $('<button class="wishlistButton" data-book-id="' + book.id + '">🤍</button>');
            bookElement.append(addToWishlistBtn);

            // Add "Add Book" button
            var addBookBtn = $('<button id="' + book.id + '" class="add-book">Buy Book</button>');
            bookElement.append(addBookBtn);

            var moreDetails = $('<p class="more-details">More Details</p>');
            bookElement.append(moreDetails);

            row.append(bookElement);

            // Call the appropriate functions for the buttons
            addBookClick(addBookBtn);
            addWishlistClick(addToWishlistBtn);
            showMoreDetails(moreDetails, book);
        });

        carouselContainer.append(row);

        // Carousel functionality
        var currentIndex = 0;

        // Calculate the total width of the row based on the number of items
        const rowWidthPercentage = totalItems * itemWidthPercentage;
        row.css('width', `${rowWidthPercentage}%`);

        // Update the carousel view
        function updateCarousel() {
            const offset = currentIndex * -itemWidthPercentage / (totalItems/itemsPerPage);
            console.log(offset);
            $('#carouselRow').css('transform', `translateX(${offset}%)`);
        }

        $('#carouselPrev').on('click', function () {
            if (currentIndex > 0) {
                currentIndex -= itemsPerPage;
                if (currentIndex < 0) currentIndex = 0; // Ensure it doesn't go negative
                updateCarousel();
            }
        });

        $('#carouselNext').on('click', function () {
            if (currentIndex < totalItems - itemsPerPage) {
                currentIndex += itemsPerPage;
                if (currentIndex > totalItems - itemsPerPage) currentIndex = totalItems - itemsPerPage; // Ensure it doesn't exceed the max
                updateCarousel();
            }
        });

        updateCarousel(); // Initial display
    }

    async function getEBooksDisplayDataFromDB() {
        await ajaxCall("GET", `${booksApiURL}/GetEBooksDisplay`, "", getEBooksDisplayDataFromDBSCB, getEBooksDisplayDataFromDBECB);
    }
    function getEBooksDisplayDataFromDBSCB(result) {
        allBooksDisplay.push(result);
        console.log(allBooksDisplay);
        renderAllEBooksDisplay(result);
    }
    function getEBooksDisplayDataFromDBECB(err) {
        console.log(err);
    }

    var eBookCarouselContainer = $('#ebooks-container .eBookCarousel');

    function renderAllEBooksDisplay(ebooks) {
        // Clear any existing content in the carousel container
        eBookCarouselContainer.empty();

        // Create a row to hold the eBooks
        var row = $('<div id="eBookCarouselRow" class="eBook-carousel-row">');

        const itemsPerPage = 5; // Number of items to display at once
        const totalItems = ebooks.length;

        // Calculate the width of each item based on itemsPerPage
        const itemWidthPercentage = 100 / itemsPerPage;

        ebooks.forEach(ebook => {
            var ebookElement = $('<div class="eBookCarousel-item">').css('width', `${itemWidthPercentage}%`);
            ebookElement.append('<img src="' + ebook.image + '" alt="book image" />');
            ebookElement.append('<h3>' + ebook.title + '</h3>');
            ebookElement.append('<p>' + 'By: ' + ebook.authorNames + '</p>');
            ebookElement.append('<p>' + 'Price: ' + ebook.price + ' ILS' + '</p>');

            // Add "Add to Wishlist" button
            var addToWishlistBtn = $('<button class="wishlistButton" data-book-id="' + ebook.id + '">🤍</button>');
            ebookElement.append(addToWishlistBtn);

            // Add "Buy Book" button
            var addBookBtn = $('<button id="' + ebook.id + '" class="add-book">Buy Book</button>');
            ebookElement.append(addBookBtn);

            var moreDetails = $('<p class="more-details">More Details</p>');
            ebookElement.append(moreDetails);

            row.append(ebookElement);

            // Call the appropriate functions for the buttons
            addBookClick(addBookBtn);
            addWishlistClick(addToWishlistBtn);
            showMoreDetails(moreDetails, ebook);
        });

        eBookCarouselContainer.append(row);

        // Carousel functionality
        var currentIndex = 0;

        // Calculate the total width of the row based on the number of items
        const rowWidthPercentage = totalItems * itemWidthPercentage;
        row.css('width', `${rowWidthPercentage}%`);

        // Update the carousel view
        function updateCarousel() {
            const offset = currentIndex * -itemWidthPercentage / (totalItems / itemsPerPage);
            $('#eBookCarouselRow').css('transform', `translateX(${offset}%)`);
        }

        $('#eBookCarouselPrev').on('click', function () {
            if (currentIndex > 0) {
                currentIndex -= itemsPerPage;
                if (currentIndex < 0) currentIndex = 0; // Ensure it doesn't go negative
                updateCarousel();
            }
        });

        $('#eBookCarouselNext').on('click', function () {
            if (currentIndex < totalItems - itemsPerPage) {
                currentIndex += itemsPerPage;
                if (currentIndex > totalItems - itemsPerPage) currentIndex = totalItems - itemsPerPage; // Ensure it doesn't exceed the max
                updateCarousel();
            }
        });

        updateCarousel(); // Initial display
    }

    
    function isLoggedIn() {
        return sessionStorage.getItem('user') !== null;
    }
    //Top 5 Most purchased books

    $(document).ready(function () {

        // Fetch the top 5 most purchased books
        async function getTop5MostPurchasedBooks() {
            await ajaxCall("GET", `${booksApiURL}/GetTop5MostPurchasedBooks`, "", getTop5MostPurchasedBooksSCB, getTop5MostPurchasedBooksECB);
        }

        function getTop5MostPurchasedBooksSCB(result) {
            console.log("Top 5 Most Purchased Books:", result);
            renderTop5MostPurchasedBooks(result);
        }

        function getTop5MostPurchasedBooksECB(err) {
            console.error("Error fetching top 5 most purchased books:", err);
        }

        function renderTop5MostPurchasedBooks(books) {
            var topBooksContainer = $('#top-books-container');
            topBooksContainer.empty(); // Clear existing content

            if (books.length === 0) {
                topBooksContainer.append('<p>No top books available at the moment.</p>');
                return;
            }

            var table = $('<table>');
            var tableHeader = $('<tr>');

            books.forEach(book => {
                var bookElement = $('<td>');
                bookElement.append(`<img src="${book.smallThumbnail}" alt="book image" />`);
                bookElement.append('<h3>' + book.title + '</h3>');
                bookElement.append('<p>' + 'By: ' + book.authorName + '</p>');
                bookElement.append('<p>' + 'Price: ' + book.price + ' ILS' + '</p>');
                var addToWishlistBtn = $('<button class="wishlistButton" data-book-id="' + book.id + '">🤍</button>');
                bookElement.append(addToWishlistBtn);

                // Add "Add Book" button
                var addBookBtn = $('<button id="' + book.id + '" class="add-book">Buy Book</button>');
                bookElement.append(addBookBtn);

                var moreDetails = $('<p class="more-details">More Details</p>');
                bookElement.append(moreDetails);

                tableHeader.append(bookElement);

                addBookClick(addBookBtn);
                addWishlistClick(addToWishlistBtn); 
                showMoreDetails(moreDetails, book);

            });

            table.append(tableHeader);
            topBooksContainer.append(table);
        }

        // Call function to load top 5 most purchased books when document is ready
        getTop5MostPurchasedBooks();

        //Fetch recommended books by top categories for the user
        async function getRecommendedBooksByCategory(userId) {
            await ajaxCall("GET", `${categoriesApiUrl}/recommend/${userId}`, "", getRecommendedBooksByCategorySCB, getRecommendedBooksByCategoryECB);
        }

        function getRecommendedBooksByCategorySCB(result) {
            console.log("Recommended Books:", result);
            renderRecommendedBooks(result);
        }

        function getRecommendedBooksByCategoryECB(err) {
            console.error("Error fetching recommended books:", err);
            alert("An error occurred while fetching recommended books.");
        }

        function renderRecommendedBooks(books) {
            var recommendedBooksContainer = $('#recommended-books-container');
            recommendedBooksContainer.empty(); // Clear existing content

            if (books.length === 0) {
                recommendedBooksContainer.append('<p>No recommended books available at the moment.</p>');
                return;
            }

            var table = $('<table>');
            var tableHeader = $('<tr>');
            console.log(books);
            books.forEach(book => {
                var bookElement = $('<td>');
                bookElement.append(`<img src="${book.smallThumbnail}" alt="book image" />`);
                bookElement.append('<h3>' + book.title + '</h3>');
                bookElement.append('<p>' + 'By: ' + book.authorName + '</p>');
                bookElement.append('<p>' + 'Price: ' + book.price + ' ILS' + '</p>');
                var addToWishlistBtn = $('<button class="wishlistButton" data-book-id="' + book.bookId + '">🤍</button>');
                bookElement.append(addToWishlistBtn);

                // Add "Add Book" button
                var addBookBtn = $('<button id="' + book.bookId + '" class="add-book">Buy Book</button>');
                bookElement.append(addBookBtn);
                tableHeader.append(bookElement);
                addBookClick(addBookBtn);
                addWishlistClick(addToWishlistBtn);

            });

            table.append(tableHeader);
            recommendedBooksContainer.append(table);
        }
        getRecommendedBooksByCategory(user.id);
    });
   
     //Function to add a book to the wishlist
    function addBookToWishlist(userId, bookId) {
        const api = `${userBooksApiUrl}/addBookToWishlist/${userId}`;
        const data = getBookById(bookId); // Retrieve book details by its ID
        ajaxCall(
            'POST',
            api,
            JSON.stringify(data),
            function (response) {
                console.log("Success:", response);
                alert("Added to wishlist");
                $(`button[data-book-id="${bookId}"]`).addClass('filled').text('❤️'); // Update button state on success
            },
            function (error) {
                console.error("Error:", error);
                alert("Book was already added!");
            }
        );
    }

    // Function to handle wishlist button click
    function addWishlistClick(wishlistBtn) {
        wishlistBtn.on('click', function () {
            const bookId = $(this).data('book-id');
            const user = JSON.parse(sessionStorage.getItem('user')); // Fetch the current user

            if (user && user.id && isLoggedIn()) {
                // Add book to wishlist
                addBookToWishlist(user.id, bookId);
            } else {
                console.log("User not logged in. Redirecting to login.");
                alert("Please login or register to add book.");
                window.location.href = "login.html";
            }
        });
    }


    // Mock function to retrieve book details by its ID
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
                alert("The book added  to purchased list");
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
                    const book = getBookById(buttonId); 
                    addBookToPurchased(user.id, book);
                } else {
                    console.log("User not logged in. Redirecting to login.");
                    alert("Please login or register to add book.");
                    window.location.href = "login.html";
                }
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
        allBooks.forEach(function (books) {
            books.forEach(function (b) {
                if(b.id === book.id){
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

    async function getAllBooksDataFromDB() {
        await ajaxCall("GET", `${booksApiURL}/GetAllBooks`, "", getAllBooksDataFromDBSCB, getAllBooksDataFromDBECB);
    }

    function getAllBooksDataFromDBSCB(result) {
        allBooks.push(result);
    }

    function getAllBooksDataFromDBECB(err) {
        console.log(err);
    }

    async function getAllEBooksDataFromDB() {
        await ajaxCall("GET", `${booksApiURL}/GetAllEBooks`, "", getAllEBooksDataFromDBSCB, getAllEBooksDataFromDBECB);
    }

    function getAllEBooksDataFromDBSCB(result) {
        allBooks.push(result);
        console.log(allBooks);
    }

    function getAllEBooksDataFromDBECB(err) {
        console.log(err);
    }

    function renderFilterdBooks(filterdBooks) {
        const mainContent = $('#main-content');
        mainContent.empty();
        mainContent.css({
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
        });


        console.log(filterdBooks);
        if (filterdBooks.length === 0) {
            var bookElement = $('<div>');
            bookElement.addClass('didnt-find');
            bookElement.append('<h2>' + 'We are sorry, we could not find any books that match your search.' + '<h2/>');
            bookElement.append('<h3>' + 'Please try again with a different search...' + '</h3>');
            mainContent.append(bookElement);
        }
        else {

            filterdBooks.forEach(function (book) {
                var bookElement = $('<div>');
                bookElement.addClass('book');
                bookElement.append('<img src="' + book.image + '" alt="book image" />');
                bookElement.append('<h3>' + book.title + '</h3>');
                bookElement.append('<p>' + 'By: ' + book.authorNames + '</p>');
                //bookElement.append('<p>' + 'Description: ' + book.description + '</p>')
                bookElement.append('<p>' + 'Price: ' + book.price + ' ILS' + '</p>');
                var addToWishlistBtn = $('<button class="wishlistButton" data-book-id="' + book.id + '">🤍</button>');
                bookElement.append(addToWishlistBtn);

                // Add "Add Book" button
                var addBookBtn = $('<button id="' + book.id + '" class="add-book">Add Book</button>');
                bookElement.append(addBookBtn);

                var moreDetails = $('<p class="more-details">More Details</p>');
                bookElement.append(moreDetails);

                mainContent.append(bookElement);

                addBookClick(addBookBtn);
                addWishlistClick(addToWishlistBtn);
                showMoreDetails(moreDetails, book);


            });
        }
    }

    function searchBooks() {

         const query = $('#search-input').val();
         const filterdBooks = []  
         allBooks.forEach(function (books) {
             books.forEach( function (book) {

                 // check if the query is in the title of the book with no case sensitivity
                 if (
                     book.title.toLowerCase().includes(query.toLowerCase()) ||
                     book.authorNames.toLowerCase().includes(query.toLowerCase()) ||
                     book.description.toLowerCase().includes(query.toLowerCase())) 
                 {
                     filterdBooks.push(book);
                 }
                
             });
    
         });
        renderFilterdBooks(filterdBooks);

    }

    getBooksDisplayDataFromDB();
    getEBooksDisplayDataFromDB();
    getAllBooksDataFromDB();
    getAllEBooksDataFromDB();

    const searchBtn = document.getElementById("searchBtn");

    $(searchBtn).click(function () {
        searchBooks();

    });


    const allBooksBtn = document.getElementById("allBooksBtn");
    $(allBooksBtn).click(function () {
        window.location.href = "booksCatalog.html";
    });

    const allEBooksBtn = document.getElementById("allEBooksBtn");
    $(allEBooksBtn).click(function () {

        window.location.href = "ebooksCatalog.html";
    });

    const authorsBtn = document.getElementById("authorsBtn");
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
        window.location.reload();
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

    const additionsBtn = document.getElementById("additionsBtn");
    $(additionsBtn).click(function () {
        window.location.href = "additions.html";
    });


    //$('#quizBtn').click(function () {
    //    window.location.href = "quiz.html";
    //});
    // Check user status and display appropriate buttons
    if (user && !user.isAdmin) {
        $('#logoutBtn').show();
        $('#loginBtn').hide();
        $('#registerBtn').hide();
        $('#purchaseBooksBtn').show();
        $('#myBooksBtn').show();
        $('#adminBtn').hide();
        $('#wishlistBtn').show(); // Show wishlist button for regular users
        $('#mypurchaserequestsBtn').show();
        $('#quizBtn').show();
        $('#recommendedBooksHeader')
        
    } else if (user && user.isAdmin) {
        $('#logoutBtn').show();
        $('#loginBtn').hide();
        $('#registerBtn').hide()
        $('#purchaseBooksBtn').hide();            ;
        $('#myBooksBtn').hide();
        $('#adminBtn').show();
        $('#wishlistBtn').hide(); // Hide wishlist button for admins
        $('#mypurchaserequestsBtn').hide();
        $('#quizBtn').hide();
        $('#recommendedBooksHeader').hide();


    } else {
        $('#logoutBtn').hide();
        $('#loginBtn').show();
        $('#purchaseBooksBtn').hide();
        $('#registerBtn').show();
        $('#myBooksBtn').hide();
        $('#adminBtn').hide();
        $('#wishlistBtn').hide(); // Hide wishlist button for not logged-in users
        $('#mypurchaserequestsBtn').hide();
        $('#quizBtn').hide();
        $('#recommendedBooksHeader').hide();

    }

    // Event listener to toggle the theme and save it in localStorage
    document.getElementById('toggle-mode').addEventListener('change', function () {
        if (this.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    });

  
    //const currentTheme = localStorage.getItem('theme');
    const toggleButton = document.getElementById('toggle-mode');
    toggleButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');

        let theme = 'light';
        if (document.body.classList.contains('dark-mode')) {
            theme = 'dark';
        }
        localStorage.setItem('theme', theme);
    });

});








////All the insert data from API to DB functions
//function getRandomQuery(queries) {
//    const randomIndex = Math.floor(Math.random() * queries.length);
//    return queries[randomIndex];
//}

//async function fetchBooks(query, startIndex = 0, maxResults = 40) {
//    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${startIndex}&maxResults=${maxResults}`;
//    try {
//        const response = await fetch(url);
//        const data = await response.json();
//        return data.items || [];
//    } catch (error) {
//        console.error('Error fetching data from Google Books API:', error);
//        return [];
//    }
//}

//async function fetchEBooks(query, startIndex = 0, maxResults = 40) {
//    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&filter=ebooks&startIndex=${startIndex}&maxResults=${maxResults}`;
//    try {
//        const response = await fetch(url);
//        const data = await response.json();
//        return data.items || [];
//    } catch (error) {
//        console.error('Error fetching data from Google Books API:', error);
//        return [];
//    }
//}

//async function fetchBooksAndEbooks(totalBooks, totalEbooks) {
//    const maxResultsPerRequest = 40;
//    const queries = [
//        'subject:fiction',
//        'subject:nonfiction',
//        'subject:science',
//        'subject:history',
//        'subject:technology',
//        'subject:fantasy',
//        'subject:mystery',
//        'subject:romance',
//        'subject:thriller',
//        'subject:biography'
//    ];

//    const books = [];
//    const ebooks = [];
//    let startIndex = 0;

//    // Fetching books
//    while (books.length < totalBooks) {
//        const randomQuery = await getRandomQuery(queries);
//        const booksBatch = await fetchBooks(randomQuery, startIndex, maxResultsPerRequest);
//        for (const book of booksBatch) {
//            if (books.length < totalBooks && !book.saleInfo.isEbook) {
//                books.push(book);
//            }
//        }

//        startIndex += maxResultsPerRequest;

//    }

//    // Fetching ebooks
//    startIndex = 0;

//    while (ebooks.length < totalEbooks) {
//        const randomQuery = await getRandomQuery(queries);
//        const ebooksBatch = await fetchEBooks(randomQuery, startIndex, maxResultsPerRequest);
//        for (const ebook of ebooksBatch) {
//            if (ebooks.length < totalEbooks && ebook.saleInfo.isEbook) {
//                ebooks.push(ebook);
//            }
//        }

//        startIndex += maxResultsPerRequest;

//    }

//    const combinedArray = [...books.slice(0, totalBooks), ...ebooks.slice(0, totalEbooks)];
//    allData.push(combinedArray);

//}


//async function fetchAuthors(query) {
//    const url = `https://openlibrary.org/search/authors.json?q=${query}`;
//    try {
//        const response = await fetch(url);
//        const data = await response.json();
//        return data.docs[0];
//    } catch (error) {
//        console.error('Error fetching data from API:', error);
//        return [];
//    }

//}

//async function fetchImageDescriptionAuthors(query) {
//    const url = `https://api.wikimedia.org/core/v1/wikipedia/en/search/title?q=${query}&limit=1`;
//    try {
//        const response = await fetch(url);
//        const data = await response.json();
//        return data.pages[0];
//    } catch (error) {
//        console.error('Error fetching data from API:', error);
//        return [];
//    }

//}

//async function insertAllDataToDB() {
//    await fetchBooksAndEbooks(maxBooks, maxEbooks);
//    const allAuthorsSet = new Set();
//    const allCategoriesSet = new Set();
//    let authorID = 100;
//    let categoryID = 1;

//    for (const item of allData[0]) {
//        const authors = item.volumeInfo && item.volumeInfo.authors ? item.volumeInfo.authors : "Unknown";
//        const categories = item.volumeInfo && item.volumeInfo.categories ? item.volumeInfo.categories : [];

//        // Create the book object
//        const book = {
//            id: item.id,
//            title: item.volumeInfo.title,
//            subtitle: item.volumeInfo.subtitle ? item.volumeInfo.subtitle : "",
//            language: item.volumeInfo.language ? item.volumeInfo.language : "",
//            publisher: item.volumeInfo.publisher ? item.volumeInfo.publisher : "",
//            publishedDate: item.volumeInfo.publishedDate ? item.volumeInfo.publishedDate : "",
//            description: item.volumeInfo.description ? item.volumeInfo.description : "",
//            pageCount: item.volumeInfo.pageCount ? item.volumeInfo.pageCount : 0,
//            printType: item.volumeInfo.printType ? item.volumeInfo.printType : "",
//            smallThumbnail: item.volumeInfo.imageLinks && item.volumeInfo.imageLinks.smallThumbnail ? item.volumeInfo.imageLinks.smallThumbnail : "",
//            thumbnail: item.volumeInfo.imageLinks && item.volumeInfo.imageLinks.thumbnail ? item.volumeInfo.imageLinks.thumbnail : "",
//            saleCountry: item.saleInfo.country ? item.saleInfo.country : "",
//            saleability: item.saleInfo.saleability ? item.saleInfo.country : "",
//            isEbook: item.saleInfo.isEbook ? item.saleInfo.isEbook : false,
//            accessCountry: item.accessInfo.country ? item.accessInfo.country : "",
//            viewability: item.accessInfo.viewability ? item.accessInfo.viewability : "",
//            publicDomain: item.accessInfo.publicDomain ? item.accessInfo.publicDomain : false,
//            textToSpeechPermission: item.accessInfo.textToSpeechPermission ? item.accessInfo.textToSpeechPermission : "",
//            epubIsAvailable: item.accessInfo.epub.isAvailable ? item.accessInfo.epub.isAvailable : false,
//            epubDownloadLink: item.accessInfo.epub && item.accessInfo.epub.downloadLink ? item.accessInfo.epub.downloadLink : "",
//            epubAcsTokenLink: item.accessInfo.epub.acsTokenLink ? item.accessInfo.epub.acsTokenLink : "",
//            pdfIsAvailable: item.accessInfo.pdf.isAvailable ? item.accessInfo.pdf.isAvailable : false,
//            pdfDownloadLink: item.accessInfo.pdf && item.accessInfo.pdf.downloadLink ? item.accessInfo.pdf.downloadLink : "",
//            pdfAcsTokenLink: item.accessInfo.pdf.acsTokenLink ? item.accessInfo.pdf.acsTokenLink : "",
//            webReaderLink: item.webReaderLink ? item.webReaderLink : "",
//            accessViewStatus: item.accessInfo.accessViewStatus ? item.accessInfo.accessViewStatus : "",
//            quoteSharingAllowed: item.quoteSharingAllowed ? item.quoteSharingAllowed : false,
//            textSnippet: item.searchInfo ? item.searchInfo.textSnippet : "",
//            price: item.volumeInfo.pageCount ? item.volumeInfo.pageCount / 5 : 0.0
//        };


//        allBooks.push(book);
//        console.log("Starting to post all books");
//        await ajaxCall("POST", `${booksApiURL}/PostAllBooks`, JSON.stringify(book), postBooksSCB, postBooksECB);
//        console.log("Finished posting all books");

//        // Create all Authors Objects
//        for (const authorsName of authors) {
//            if (!allAuthorsSet.has(authorsName)) {
//                const authorsData1 = await fetchAuthors(authorsName);
//                const authorsData2 = await fetchImageDescriptionAuthors(authorsName);
//                if (authorsData1 && authorsData2) {
//                    allAuthorsSet.add(authorsName);
//                    const a = {
//                        id: authorID,
//                        name: authorsName,
//                        birthDate: authorsData1.birth_date ? authorsData1.birth_date : "",
//                        deathDate: authorsData1.death_date ? authorsData1.death_date : "",
//                        topWork: authorsData1.top_work ? authorsData1.top_work : "",
//                        description: authorsData2.description ? authorsData2.description : "",
//                        image: authorsData2.thumbnail && authorsData2.thumbnail.url ? authorsData2.thumbnail.url : ""

//                    };
//                    allAuthors.push(a);
//                    console.log("Starting to post all authors");
//                    await ajaxCall("POST", authorsApiUrl, JSON.stringify(a), postAuthorsSCB, postAuthorsECB);
//                    console.log("Finished posting all authors");
//                    authorID++;
//                }
//            }
//        }



//        // Create all Categories Objects
//        for (const categoryName of categories) {
//            if (!allCategoriesSet.has(categoryName)) {
//                allCategoriesSet.add(categoryName);
//                const c = { id: categoryID, name: categoryName };
//                allCategories.push(c);
//                console.log("Starting to post all categories");
//                await ajaxCall("POST", categoriesApiUrl, JSON.stringify(c), postCategoriesSCB, postCategoriesECB);
//                console.log("Finished posting all categories");
//                categoryID++;
//            }

//        }
//        // Create all BooksAuthors Objects
//        for (const authorsName of authors) {
//            let author = allAuthors.find(author => author.name === authorsName);
//            if (author) {
//                allBooksAuthors.push({ bookId: book.id, authorId: author.id });
//            }

//        }

//        // Create all BooksCategories Objects
//        for (const categoryName of categories) {
//            let category = allCategories.find(category => category.name === categoryName);
//            if (category) {
//                allBooksCategories.push({ bookId: book.id, categoryId: category.id });

//            }
//        }
//    }


//}

//async function insertAllConecctionTables() {

//    for (const bookAuthor of allBooksAuthors) {
//        console.log(`Starting to post book author: ${bookAuthor.authorId}`);
//        await ajaxCall("POST", `${booksApiURL}/PostAllBooksAuthors/${bookAuthor.authorId}`, JSON.stringify(bookAuthor.bookId), postAllBooksAuthorsSCB, postAllBooksAuthorsECB);
//        console.log(`Finished posting book author: ${bookAuthor.authorId}`);
//    }

//    for (const bookCategory of allBooksCategories) {
//        console.log(`Starting to post book category: ${bookCategory.categoryId}`);
//        await ajaxCall("POST", `${booksApiURL}/PostAllBooksCategories/${bookCategory.categoryId}`, JSON.stringify(bookCategory.bookId), postAllBooksCategoriesSCB, postAllBooksCategoriesECB);
//        console.log(`Finished posting book category: ${bookCategory.categoryId}`);
//    }
//}

//function postBooksSCB(result) {
//    console.log(result);
//}

//function postBooksECB(err) {
//    console.log(err);
//}

//function postAuthorsSCB(result) {
//    console.log(result);
//}

//function postAuthorsECB(err) {
//    console.log(err);
//}

//function postCategoriesSCB(result) {
//    console.log(result);
//}

//function postCategoriesECB(err) {
//    console.log(err);
//}

//function postAllBooksAuthorsSCB(result) {
//    console.log(result);
//}

//function postAllBooksAuthorsECB(err) {
//    console.log(err);
//}

//function postAllBooksCategoriesSCB(result) {
//    console.log(result);
//}

//function postAllBooksCategoriesECB(err) {
//    console.log(err);
//}

//async function updateExtractText() {
//    for (const books of allBooks) {
//        for (const book of books) {
//            try {
//                const pdfUrl = book.pdfLink;

//                // Check if pdfDownloadLink is a valid non-empty string
//                if (pdfUrl == "") {
//                    console.warn(`Skipping book "${book.title}" due to invalid PDF URL.`);
//                    continue; // Skip this book and move to the next one
//                }
//                console.log(`Processing book: ${book.title}, PDF URL: ${pdfUrl}`);

//                // Load the PDF document from the URL
//                const loadingTask = pdfjsLib.getDocument(pdfUrl);
//                const pdf = await loadingTask.promise;

//                let extractedText = "";

//                // Loop through all the pages
//                for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
//                    const page = await pdf.getPage(pageNum);
//                    const textContent = await page.getTextContent();
//                    const pageText = textContent.items.map(item => item.str).join(' ');
//                    extractedText += pageText + "\n";
//                }

//                extractedText = extractedText.trim();

//                // Log extracted text
//                console.log(`Extracted text for book "${book.title}": `, extractedText);

//                // Update the database with the extracted text
//                // Uncomment and implement the function call if needed
//                // await updateDatabaseWithExtractedText(book.id, extractedText);

//            } catch (error) {
//                console.error(`Failed to process PDF for book "${book.title}": `, error);
//            }
//        }
//    }

//    insertDataToDbBtn.disabled = false; // Re-enable the button after processing
//}

//async function getContent(src) {
//    const doc = await pdfjsLib.getDocument(src).promise;
//    const page = await doc.getPage(1);
//    return await page.getTextContent();
//}

//async function getItems(src) {
//    const content = await getContent(src);
//    const textItems = content.items.map((item)=>{
//        console.log(item.str);
//    })
//    return textItems;
//}

//const insertDataToDbBtn = document.getElementById("insertDataToDbBtn");
//$(insertDataToDbBtn).click(async function () {
//    insertDataToDbBtn.disabled = true;
//    //await insertAllDataToDB();
//    //await insertAllConecctionTables();
//    await getContent("../Files/ChenAhrak_CV.pdf");

//});








    
