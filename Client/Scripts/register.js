const apiUsersUrl = "https://proj.ruppin.ac.il/cgroup85/test2/tar1/api/Users";
var user = JSON.parse(sessionStorage.getItem('user'));

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

    $('#registerForm').submit(function (event) {
        event.preventDefault();

        const name = $('#name').val();
        const email = $('#email').val();
        const password = $('#password').val();

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert("Invalid email format.");
            return;
        }

        if (password.length < 4) {
            alert("Password must be at least 4 characters long.");
            return;
        }

        const newUser = {
            userName: name,
            Email: email,
            Password: password
        };

        function submitToServer(newUser) {
            ajaxCall("POST", apiUsersUrl, JSON.stringify(newUser), postSCBF, postECBF);
        }

        function postSCBF(response) {
            alert("Registration successful.");
            autoLogin();

        }

        function postECBF(err) {
            alert("User with this email already exists.");
            console.log(err);
        }

        function autoLogin() {
            let api = apiUsersUrl + '/login';
            let userDetails = { Email: newUser.Email, Password: newUser.Password };
            ajaxCall("POST", api, JSON.stringify(userDetails), postLoginSCBF, postLoginECBF);
        }

        function postLoginSCBF(response) {
            if (response) {
                sessionStorage.setItem('user', JSON.stringify(response));
                console.log(response);
                if (response.isAdmin) window.location.href = "admin.html";
                else window.location.href = "index.html";
            }
        }

        function postLoginECBF(err) {
            console.log(err);
        }

        submitToServer(newUser);
    });
});

// will become redundant - to be removed later!
const loginPageBtn = document.getElementById("loginPageBtn");

loginPageBtn.addEventListener("click", function () {
    window.location.href = "../Pages/login.html";
});

$('#homeBtn').on('click', function () {
    window.location.href = "../Pages/index.html";
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


// Check user status and display appropriate buttons
if (user && !user.isAdmin) {
    $('#logoutBtn').show();
    $('#loginBtn').hide();
    $('#registerBtn').hide();
    $('#myBooksBtn').show();
    $('#adminBtn').hide();
} else if (user && user.isAdmin) {
    $('#logoutBtn').show();
    $('#loginBtn').hide();
    $('#registerBtn').hide();
    $('#myBooksBtn').show();
    $('#adminBtn').show();
} else {
    $('#logoutBtn').hide();
    $('#loginBtn').show();
    $('#registerBtn').show();
    $('#myBooksBtn').hide();
    $('#adminBtn').hide();
}

