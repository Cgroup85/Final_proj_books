const apiMailUrl = "https://proj.ruppin.ac.il/cgroup85/test2/tar1/api/Mails";

var userMail = JSON.parse(sessionStorage.getItem('mail'));

$(document).ready(function () {
    $('#loginForm').submit(function (event) {
        event.preventDefault();

        const forgotPasswordData = {
            EmailToId: userMail,
            EmailToName: '',
            EmailSubject: 'PLC Reset Password',
            EmailBody: 'Click on the link to reset your password: https://proj.ruppin.ac.il/cgroup85/test2/tar1/Client/Pages/resetPassword.html'

        };

        async function sendEmailToUser(forgotPasswordData) {

            await ajaxCall('POST', apiMailUrl, JSON.stringify(forgotPasswordData), postSCBF, postECBF);
        }

        function postSCBF(response) {
    
            console.log(response);
            alert("Mail Sent");
        }

        function postECBF(response) {
            console.log(response);
        }

        sendEmailToUser(forgotPasswordData);

    });

    $('#login').click(function () {

        window.location.href = "login.html";
    });
});
