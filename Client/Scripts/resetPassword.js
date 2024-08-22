apiUsersUrl = "https://proj.ruppin.ac.il/cgroup85/test2/tar1/api/Users";


$(document).ready(function () {

    $('#loginForm').submit(function (event) {
        event.preventDefault();

        var email = $('#email').val();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert("Invalid email format.");
            return;
        }

        var password = $('#password').val();
        var confirmPassword = $('#confirmPassword').val();

        if (password.length < 3) {
            alert("Password must be at least 4 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        async function checkEmailExists(email) {

            ajaxCall('GET', apiUsersUrl + '/GetUserByEmail/' + email, null, getCheckSCBF, getcheckECBF);
        }

        function getCheckSCBF(response) {
            console.log(response);
            if (response.id == 0) {
                alert("Email does not exist in the system.");
                return;
            }
            else {
                updatePassword();               
              

            }

        }

        function getcheckECBF(response) {
            console.log(response);
        }

        checkEmailExists(email);


        async function updatePassword() {
         
            ajaxCall('PUT', apiUsersUrl + '/UpdateUserPassword/'+email, JSON.stringify(password), updateSCBF, updateECBF);
        }

        function updateSCBF(response) {
            console.log(response);
            alert("Password Changed");
            window.location.href = "login.html";
        }
        function updateECBF(response) {
            console.log(response);
            alert("User not Found change thr mail field");
        }





    });




});