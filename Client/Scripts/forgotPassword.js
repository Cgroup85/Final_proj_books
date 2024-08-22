const apiUsersUrl = "https://proj.ruppin.ac.il/cgroup85/test2/tar1/api/Users";
const apiMailUrl = "https://proj.ruppin.ac.il/cgroup85/test2/tar1/api/Mails";
var user = JSON.parse(sessionStorage.getItem('user'));

$(document).ready(function () {

    //prevent the form from submitting defaultly
    $('#loginForm').submit(function (event) {
        event.preventDefault();

        const email = $('#email').val();

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert("Invalid email format.");
            return;
        }

        const forgotPasswordData = {
            EmailToId: email,
            EmailToName: '',
            EmailSubject: 'PLC Reset Password',
            EmailBody: 'Click on the link to reset your password: https://proj.ruppin.ac.il/cgroup85/test2/tar1/Client/Pages/resetPassword.html'

        };

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
                sendEmailToUser(forgotPasswordData);
 

            }

        }

        function getcheckECBF(response) {
            console.log(response);
        }
        
        checkEmailExists(email);


        //// Need to implement this function and in SQL too and The server --------------------------------------------------
        async function sendEmailToUser(forgotPasswordData) {

            await ajaxCall('POST', apiMailUrl, JSON.stringify(forgotPasswordData), postSCBF, postECBF);
        }

        function postSCBF(response) {
            console.log(response);
            window.location.href = "afterSendingMail.html";
        }

        function postECBF(response) {
            console.log(response);

        }
    });



 
    $('#homeBtn').on('click', function () {
        window.location.href = "../Pages/index.html";
    });


});