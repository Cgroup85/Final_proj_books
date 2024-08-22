// JavaScript source code
const booksApiUrl = "https://proj.ruppin.ac.il/cgroup85/test2/tar1/api/Books";
const authorsApiUrl = "https://proj.ruppin.ac.il/cgroup85/test2/tar1/api/Authors";
const usersApiUrl = "https://proj.ruppin.ac.il/cgroup85/test2/tar1/api/Users";
const userBooksApiUrl = "https://proj.ruppin.ac.il/cgroup85/test2/tar1/api/UserBooks";

var user = JSON.parse(sessionStorage.getItem('user'));
var homeBtn = document.getElementById("homeBtn");


$(document).ready(async function () {

    if (!user || !user.isAdmin) {
        alert("ACCESS DENIED!");
        window.location.href = "login.html";
    }
    homeBtn.addEventListener('click', (event) => {
        window.location.href = "index.html";
    });

    getUsers();
    function getUsers() {
        ajaxCall('GET', usersApiUrl+"/GetAllUsers", "", getUsersSCBF, getUsersECBF);
    }

    function getUsersSCBF(response) {
        console.log(response);
        userDataTable(response);
    }

    function getUsersECBF(err){
        console.log(err);
    }
    function userDataTable(response) {
        var table = $('#usersDataTable').DataTable({
            data: response,
            pageLength: 10,
            searching: false,
            columns: [
                {
                    data: "id",
                    title: "User ID",
                    searchable: true,
                    render: function (data, type, row, meta) {
                        return '<p>' + data + '</p>';
                    }
                },
                {
                    data: "userName",
                    title: "User Name",
                    searchable: true,
                    render: function (data, type, row, meta) {
                        return '<input type="text" class="editUserName" id="editUserName' + row.id + '" value="' + data + '" data-user-name="' + row.id + '" disabled>';
                    }
                },
                {
                    data: "email",
                    title: "User Email",
                    searchable: true,
                    render: function (data, type, row, meta) {
                        return '<input type="text" class="editEmail" id="editEmail' + row.id + '" value="' + data + '" data-email="' + row.id + '" disabled>';
                    }
                },
                {
                    data: "password",
                    title: "Password",
                    render: function (data, type, row, meta) {
                        return '<input type="text" class="editPassword" id="editPassword' + row.id + '" value="' + data + '" data-password="' + row.id + '" disabled>';
                    }
                },
                {
                    data: "isAdmin",
                    title: "Admin",
                    render: function (data, type, row, meta) {
                        return '<input type="checkbox" class="isAdminCheckbox" id="isAdmin' + meta.row + '" data-isAdmin="' + row.id + '"' + '" value="' + data + '"' + (data ? ' checked="checked"' : '') + ' disabled />';
                    }
                },
                {
                    data: "isActive",
                    title: "Active",
                    render: function (data, type, row, meta) {
                        return '<input type="checkbox" class="isActiveCheckbox" id="isActive' + meta.row + '" data-isActive="' + row.id + '"' + '" value="' + data + '"' + (data ? ' checked="checked"' : '') + ' disabled />';
                    }
                },
                {
                    title: "Action",
                    render: function (data, type, row, meta) {
                        let dataUser = "data-userId='" + row.id + "'";
                        let editBtn = "<button type='button' class='editBtn btn btn-success' " + dataUser + "> Edit </button>";
                        let viewBtn = "<button type='button' class='saveBtn btn btn-info' " + dataUser + "> Save </button>";
                        return editBtn + viewBtn;
                    }
                },
            ],
            initComplete: function () {
                var api = this.api();

                // Custom search function
                $('#userSearch').on('keyup', function () {
                    var searchTerm = $(this).val().toLowerCase();

                    // Apply the search across all table columns
                    api.rows().every(function () {
                        var data = this.data();
                        var rowNode = this.node();

                        // Extract values from input fields
                        var userName = $(rowNode).find('input.editUserName').val().toLowerCase();
                        var email = $(rowNode).find('input.editEmail').val().toLowerCase();
                        var id = data.id.toString().toLowerCase();

                        // Check if any of these fields match the search term
                        var match = userName.includes(searchTerm) || email.includes(searchTerm) || id.includes(searchTerm);

                        if (match) {
                            $(rowNode).show();
                        } else {
                            $(rowNode).hide();
                        }
                    });

                    api.draw(); // Redraw the table after filtering
                });
            },
            rowCallback: function (row, data, index) {
                $(row).attr('id', 'row-' + data.id);

                $(row).on('click', function () {
                    $("#usersDataTable tr").removeClass("selected");
                    $('#userLibrary').show();
                    getUserLibrary(data.id);
                    row.classList.add('selected');
                });
            },
            destroy: true // Allow reinitialization of the table
        });

        buttonEvents();
    }
    function buttonEvents() {

        $(document).on("click", ".editBtn", function () {
            disableInputs();
            //mode = "edit";
            markSelected(this);
            $(".selected :input").prop("disabled", false); // edit mode: enable all controls in the form
        });

        $(document).on("click", ".saveBtn", function () {
            //mode = "view";
            markSelected(this);
            row.className = 'selected';
            
            //var child = row.childNodes[4].childNodes[0].getAttribute("value");

            console.log(row.childNodes[0].childNodes[0].textContent);
            var data = {
                id: row.childNodes[0].childNodes[0].textContent.trim(),
                userName: row.childNodes[1].childNodes[0].value,
                email: row.childNodes[2].childNodes[0].value,
                password: row.childNodes[3].childNodes[0].value,
                isAdmin: row.childNodes[4].childNodes[0].checked,
                isActive: row.childNodes[5].childNodes[0].checked,
            };
            updateUser(data);
            $(".selected :input").attr("disabled", "disabled");
            $(".selected :button").attr("disabled", false);
            $('#userSearch').attr("disabled", false);
            $("#usersDataTable tr").removeClass("selected");

        });
    }
    $('#userLibrary').hide();
    getAllLibraryInfo();

});


const toggleModeCheckbox = document.getElementById('toggle-mode');
const currentTheme = localStorage.getItem('theme');

function showAllLibraryInfo(response) {
    $('#bookCountTable').DataTable({
        data: response,
        searching: false,
        pageLength: 10,
        order: [[0, 'desc']],
        columns: [

            {
                data: "timesInLibrary",
                title: "In library",
                render: function (data, type, row, meta) {
                    return '<span>' + data + '</span>';
                }
            },

            {
                data: "title",
                title: "Title",
                render: function (data, type, row, meta) {
                    return '<span>' + data + '</span>';
                }
            },

            {
                data: "description",
                title: "Description",

                render: function (data, type, row, meta) {
                    return '<span>' + truncateText(data,50) + '</span>';
                }
            },

            {
                data: "thumbNail",
                title: "Book cover",
                render: function (data, type, row, meta) {
                    return '<img src="' + data + '" alt="book image" />';       
                }
            },

            {
                data: "isEbook",
                title: "Ebook?",
                render: function (data, type, row, meta) {
                    return '<span>' + data + '</span>';
                }
            },
        ],
        destroy: true // Allow reinitialization of the table
    });

    function truncateText(text, maxLength) {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

}

function getAllLibraryInfo() {
    ajaxCall('GET', userBooksApiUrl + "/getBooksNumInLibraries", "", getAllLibraryInfoSCBF, getAllLibraryInfoECBF);
}

function getAllLibraryInfoSCBF(response) {
    showAllLibraryInfo(response);
    console.log(response);
}

function getAllLibraryInfoECBF(err) {
    console.log(err);
}

getAllLibraryInfo();

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

function renderUserBooks(response) {
    $('#userBooks').empty();
    if (response != null && response.length > 0) {
        $('#userBooks').DataTable({
            data: response,
            searching: false,
            pageLength: 10,
            columns: [
                {
                    data: "id",
                    title: "Id",
                    render: function (data, type, row, meta) {
                        return '<span>' + data + '</span>';
                    }
                },

                {
                    data: "title",
                    title: "Title",
                    render: function (data, type, row, meta) {
                        return '<span>' + data + '</span>';
                    }
                },

                {
                    data: "subtitle",
                    title: "Subtitle",

                    render: function (data, type, row, meta) {
                        return '<span>' + data + '</span>';
                    }
                },

                {
                    data: "language",
                    title: "Language",

                    render: function (data, type, row, meta) {
                        return '<span>' + data + '</span>';
                    }
                },

                {
                    data: "publisher",
                    title: "Publisher",

                    render: function (data, type, row, meta) {
                        return '<span>' + data + '</span>';
                    }
                },

                {
                    data: "publishedDate",
                    title: "Publishing Year",

                    render: function (data, type, row, meta) {
                        return '<span>' + new Date(data).getFullYear() + '</span>';
                    }
                },

                {
                    data: "pageCount",
                    title: "Page count",

                    render: function (data, type, row, meta) {
                        return '<span>' + data + '</span>';
                    }
                },

                {
                    data: "printType",
                    title: "Print type",

                    render: function (data, type, row, meta) {
                        return '<span>' + data + '</span>';
                    }
                },

                {
                    data: "price",
                    title: "Price",

                    render: function (data, type, row, meta) {
                        return '<span>' + data + '</span>';
                    }
                },

                {
                    data: "status",
                    title: "Status",

                    render: function (data, type, row, meta) {
                        return '<span>' + data + '</span>';
                    }
                },

                {
                    data: "thumbnail",
                    title: "Book cover",
                    render: function (data, type, row, meta) {
                        return '<img src="' + data + '" alt="book image" />';
                    }
                },

                {
                    data: "authors",
                    title: "Authors",
                    render: function (data, type, row, meta) {
                        return '<span>' + data + '</span>';
                    }
                },

                {
                    data: "isEbook",
                    title: "Ebook?",
                    render: function (data, type, row, meta) {
                        return '<span>' + data + '</span>';
                    }
                },
            ],
            destroy: true // Allow reinitialization of the table
        });
    }
    else {
        $('#userBooks').empty().not('thead', 'tbody');
        $('#userBooks').append("<h3>No books in selected user's library</h3>");
    }
}

function getUserLibrary(userId) {
    ajaxCall('GET', userBooksApiUrl + `/getUserLibrary?userId=${userId}`, "", getUserLibrarySCBF, getUserLibraryECBF);
}

function getUserLibrarySCBF(response) {
    renderUserBooks(response);
    console.log(response);
}

function getUserLibraryECBF(err) {
    console.log(err);
}

function disableInputs() {
    $("input").attr("disabled", "disabled");
}

///////////// need to check if need to add control for each save button  ///////////////////////////
function updateUser(data) {

    ajaxCall('PUT', usersApiUrl + `/UpdateUserData/${data.id}`, JSON.stringify(data), updateUserSCBF, updateUserECBF);
}

function updateUserSCBF(response) {
    console.log(response);
}

function updateUserECBF(err) {
    console.log(err);
}

function deleteUser(id) {
    ajaxCall('DELETE', usersApiUrl +"/"+ id, "", deleteUserSCBF, deleteUserECBF);
}

function deleteUserSCBF(response) {
    console.log(response);
}

function deleteUserECBF(err) {
    console.log(err);
}


// not sure if needed - selects and highlights the row
function markSelected(btn) {
    $("#usersDataTable tr").removeClass("selected"); // remove seleced class from rows that were selected before
    row = (btn.parentNode).parentNode; // button is in TD which is in Row
    row.className = 'selected'; // mark as selected
}

function getAuthorsLibraryInfo() {
    ajaxCall('GET', authorsApiUrl + "/getAuthorsNumberInLibraries", "", getAuthorsLibraryInfoSCBF, getAuthorsLibraryInfoECBF);
}

function getAuthorsLibraryInfoSCBF(response) {
    showAuthorsInLibraryInfo(response);
    console.log(response);
}

function getAuthorsLibraryInfoECBF(err) {
    console.log(err);
}

getAuthorsLibraryInfo();

function showAuthorsInLibraryInfo(response) {
    $('#authorsCountTable').DataTable({
        data: response,
        searching: false,
        pageLength: 10,
        order: [[0, 'desc']],
        columns: [

            {
                data: "authorsInLibrary",
                title: "In library",
                render: function (data, type, row, meta) {
                    return '<span>' + data + '</span>';
                }
            },

            {
                data: "name",
                title: "Name",
                render: function (data, type, row, meta) {
                    return '<span>' + data + '</span>';
                }
            },

            {
                data: "topWork",
                title: "Top work",
                render: function (data, type, row, meta) {
                    return '<span>' + data + '</span>';
                }
            },

            {
                data: "description",
                title: "Description",

                render: function (data, type, row, meta) {
                    return '<span>' + truncateText(data, 50) + '</span>';
                }
            },

            {
                data: "image",
                title: "Image",
                render: function (data, type, row, meta) {
                    return '<img src="' + data + '" alt="book image" />';
                }
            },
        ],
        destroy: true // Allow reinitialization of the table
    });

    function truncateText(text, maxLength) {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }


    const logoutBtn = document.getElementById('logoutBtn');
    $(logoutBtn).click(function () {
        sessionStorage.clear();
        window.location.href = "index.html";
    });

    const authorsBtn = document.getElementById('authorsBtn');
    $(authorsBtn).click(function () {
        window.location.href = "authors.html";
    });
}