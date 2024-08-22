const userBooksApiUrl = "https://proj.ruppin.ac.il/cgroup85/test2/tar1/api/UserBooks";

var user = JSON.parse(sessionStorage.getItem('user'));

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

// Fetch and display purchased books
function fetchBooks() {
    const status = 'purchased'; // Define the status
    const apiEndpoint = `${userBooksApiUrl}/get?userID=${user.id}&status=${status}`;

    // Send request to server
    ajaxCall('GET', apiEndpoint, null,
        getBooksDisplayDataFromDBSCB,  // Success callback
        getBooksDisplayDataFromDBECB  // Error callback
    );
}

// Success callback for fetching books
function getBooksDisplayDataFromDBSCB(result) {
    // Display the books
    renderAllBooksDisplay(result, 'books-container');
}

// Error callback for fetching books
function getBooksDisplayDataFromDBECB(err) {
    console.log("Error fetching books:", err);
}

// Display books in a container
function renderAllBooksDisplay(books, containerId) {
    var booksContainer = $('#' + containerId);
    booksContainer.empty(); // Clear existing content

    if (books.length === 0) {
        booksContainer.append('<h3>No books available in the selected status.</h3>');
        return;
    }

    books.forEach(book => {
        var bookElement = $('<div>').addClass('book');
        bookElement.append('<img src="' + book.thumbnail + '" alt="book image" />');
        bookElement.append('<h3>' + book.title + '</h3>');
        bookElement.append('<p>' + 'By: ' + book.authors + '</p>');
        bookElement.append('<p>' + 'Price: ' + book.price + ' ILS' + '</p>');

        // Add "Add to Read List" button only for physical books with "purchased" status
        if (containerId === 'books-container' && book.isEbook === 'False') {
            var addToReadListBtn = $('<button class="addToReadListButton" data-book-id="' + book.id + '">Add to Read List</button>');
            bookElement.append(addToReadListBtn);
            addReadClick(addToReadListBtn);
        }

        booksContainer.append(bookElement);
    });
}

// Function to add a book to the read list
function addBookToRead(userID, bookId) {
    const status = "read";
    const api = `${userBooksApiUrl}/update-status?userID=${userID}&bookID=${bookId}&newStatus=${status}`;
    const data = JSON.stringify(bookId);

    ajaxCall(
        'PUT',
        api,
        data,
        function (response) {
            console.log("Success:", response);
            alert("Book added to read list.");
            // Update UI to reflect the book was added
            $(`button[data-book-id="${bookId}"]`).addClass('added').text('Added'); // Update button state on success
            // רענון העמוד לאחר עדכון מצב הכפתור
            setTimeout(function () {
                location.reload();
            }, 500); // 
        },
        function (error) {
            console.error("Error:", error);
            alert("Error adding book to read list.");
        }
    );
}

// Add event listener to "Add to Read List" button
function addReadClick(readBtn) {
    readBtn.on('click', function () {
        const bookId = this.getAttribute('data-book-id');
        if (user.id) {
            console.log(bookId);
            addBookToRead(user.id, bookId);

            // Update button state on success
            $(this).toggleClass('added');
        } else {
            alert("User not logged in.");
        }
    });
}

// Fetch and display books with status "read" in a separate container
function fetchReadBooks() {
    const status = 'read'; // Define the status
    const apiEndpoint = `${userBooksApiUrl}/get?userID=${user.id}&status=${status}`;

    // Send request to server
    ajaxCall('GET', apiEndpoint, null,
        function (result) {
            renderAllBooksDisplay(result, 'read-books-container');
        },
        getBooksDisplayDataFromDBECB
    );
}

// Fetch books on load
fetchBooks();
fetchReadBooks();

// Navigation button events
$('#homeBtn').on('click', function () {
    window.location.href = "../Pages/index.html";
});

$('#allBooksBtn').click(function () {
    window.location.href = "booksCatalog.html";
});

$('#allEBooksBtn').click(function () {
    window.location.href = "ebooksCatalog.html";
});

$('#authorsBtn').click(function () {
    window.location.href = "authors.html";
});

$('#loginBtn').click(function () {
    window.location.href = "login.html";
});

$('#logoutBtn').click(function () {
    sessionStorage.clear();
    window.location.href = "index.html";
});

$('#registerBtn').click(function () {
    window.location.href = "register.html";
});

$('#adminBtn').click(function () {
    window.location.href = "admin.html";
});

$('#myBooksBtn').click(function () {
    window.location.href = "myBooks.html";
});

$('#wishlistBtn').click(function () {
    window.location.href = "wishList.html";
});

$('#purchaseBooksBtn').click(function () {
    window.location.href = "transferBook.html";
});

$('#mypurchaserequestsBtn').click(function () {
    window.location.href = "purchaseRequests.html";
});

var quizBtn = document.getElementById("quizBtn");
quizBtn.addEventListener('click', event => {
    window.location.href = "quiz.html";
});

// Check user status and display appropriate buttons
if (user && !user.isAdmin) {
    $('#logoutBtn').show();
    $('#loginBtn').hide();
    $('#purchaseBooksBtn').show();
    $('#registerBtn').hide();
    $('#myBooksBtn').show();
    $('#adminBtn').hide();
    $('#wishlistBtn').show();
} else if (user && user.isAdmin) {
    $('#logoutBtn').show();
    $('#loginBtn').hide();
    $('#purchaseBooksBtn').show();
    $('#registerBtn').hide();
    $('#myBooksBtn').hide();
    $('#adminBtn').show();
    $('#wishlistBtn').hide();
} else {
    $('#logoutBtn').hide();
    $('#loginBtn').show();
    $('#purchaseBooksBtn').hide();
    $('#registerBtn').show();
    $('#myBooksBtn').hide();
    $('#adminBtn').hide();
    $('#wishlistBtn').hide();
}
