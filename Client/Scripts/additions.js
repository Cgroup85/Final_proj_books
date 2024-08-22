
const user = JSON.parse(sessionStorage.getItem("user"));
$(document).ready(function () {

    const homeBtn = document.getElementById("homeBtn");
    $(homeBtn).click(function () {
        window.location.href = "index.html";
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
    } else if (user && user.isAdmin) {
        $('#logoutBtn').show();
        $('#loginBtn').hide();
        $('#registerBtn').hide()
        $('#purchaseBooksBtn').hide();;
        $('#myBooksBtn').hide();
        $('#adminBtn').show();
        $('#wishlistBtn').hide(); // Hide wishlist button for admins
        $('#mypurchaserequestsBtn').hide();
        $('#quizBtn').hide();
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
    }

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
});
