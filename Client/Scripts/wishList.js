const userBooksApiUrl = 'https://proj.ruppin.ac.il/cgroup85/test2/tar1/api/UserBooks';

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

$('#homeBtn').on('click', function () {
    window.location.href = "../Pages/index.html";
});

function fetchBooks() {
    const status = 'want to read'; // הגדרת הסטטוס

    const api = `${userBooksApiUrl}/get?userID=${user.id}&status=${encodeURIComponent(status)}`;
    // שלח בקשה לשרת
    ajaxCall('GET', api, null,
        getBooksDisplayDataFromDBSCB,  // פונקציית הצלחה
        getBooksDisplayDataFromDBECB  // פונקציית שגיאה
    );
}

// פונקציית הצלחה בבקשה לשרת
function getBooksDisplayDataFromDBSCB(result) {
    // הצג את הספרים
    renderAllBooksDisplay(result);
}

// פונקציית שגיאה בבקשה לשרת
function getBooksDisplayDataFromDBECB(err) {
    console.log("Error fetching books:", err);
    if (err.readyState === 0) {
        console.log("Request was not sent or aborted.");
    }
    if (err.status === 0) {
        console.log("Network error or CORS issue.");
    } else {
        console.log("Status Code:", err.status);
        console.log("Status Text:", err.statusText);
    }
}
// הצגת הספרים בטבלה
function renderAllBooksDisplay(books) {
    var booksContainer = $('#books-container');
    booksContainer.empty(); // נקה את התוכן הקיים לפני הוספת ספרים חדשים

    if (books.length === 0) {
        booksContainer.append('<h2>No books available in the "want to read" status.</h2>');
        return;
    }

    console.log(books);
    var booksContainer = $('#books-container');
    booksContainer.empty();
    books.forEach(book => {
        var bookElement = $('<div>');
        bookElement.addClass('book');
        bookElement.append('<img src="' + book.thumbnail + '" alt="book image" />');
        bookElement.append('<h3>' + book.title + '</h3>');
        bookElement.append('<p>' + 'By: ' + book.authors + '</p>');
        bookElement.append('<p>' + 'Price: ' + book.price + ' ILS' + '</p>');
        var addBookBtn = $('<button class="addBookButton" data-book-id="' + book.id + '">Buy Book</button>');
        bookElement.append(addBookBtn);

        // קרא לפונקציות המתאימות עבור הכפתור
        addpurchasedClick(addBookBtn);
        booksContainer.append(bookElement);
    });

   
}

// פונקציה להוספת ספר לרשימת הקריאה //Update status from "want to read" to "purchased"
function addBookToPurchased(userID, bookId) {
    const status = "purchased";
    const api = `${userBooksApiUrl}/update-status?userID=${userID}&bookID=${bookId}&newStatus=${status}`;
    const data = JSON.stringify(bookId);
    ajaxCall(
        'PUT',
        api,
        data,
        function (response) {
            console.log("Success:", response);
            alert("Book added to purchased list.");
            
            $(`button[data-book-id="${bookId}"]`).addClass('added').text('Added'); // Update button state on success
            setTimeout(function () {
                location.reload();
            }, 500);
        },
        function (error) {
            console.error("Error:", error);
            alert("Error adding book to purchased list.");
        }
    );
}

// הוסף מאזין לאירוע ללחיצה על כפתור "purchased"
function addpurchasedClick(addBookBtn) {
    addBookBtn.on('click', function () {
        const bookId = $(this).attr('data-book-id');
        if (user.id) {
            console.log(bookId);
            addBookToPurchased(user.id, bookId);

            // עדכן את מצב הכפתור בהתאם להצלחה
            $(this).toggleClass('added');
        } else {
            alert("User not logged in.");
        }
    });
}

// קריאה לפונקציה לשליפת ספרים
fetchBooks();

const allBooksBtn = document.getElementById("allBooksBtn");
$(allBooksBtn).click(function () {
    window.location.href = "booksCatalog.html";
});

const allEBooksBtn = document.getElementById("allEBooksBtn");
$(allEBooksBtn).click(function () {

    window.location.href = "ebooksCatalog.html";
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
    window.location.href = ("index.html");
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

