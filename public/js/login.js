let currentUser = {
    id : null,
    login : null,
    hash : null,
    isAdmin : false,
    faName : undefined,
    fiName : undefined,
    pseudo : undefined
};

/*
*   ENCRYPTION WITH https://github.com/Caligatio/jsSHA
*/
function login(email, password) {
    $("#loginNav").addClass('is-loading');
    let shaObj = new jsSHA("SHA-512", "TEXT");
    shaObj.update(password);
    currentUser.login = email;
    currentUser.hash = shaObj.getHash("HEX");

    socket.emit("login", {
        email: email,
        password: currentUser.hash
    });
}

socket.on('login', (res) => {
    if (res.ok) {
        notif('success', "Connecté en tant que <b>" + currentUser.login + "</b>");
        currentUser.id = res.id;

        products = res.itemsList;

        if (res.isAdmin){
            currentUser.isAdmin = true;


            //Add current preoders
            for(let i=0; i<res.preorders.length; i++){
                addPreorder(res.preorders[i]);
            }

            notif('success', 'You are <b>ADMIN</b>')
            $(".admin").css('display', 'flex').css('visibility', 'visible');
            $('.moldu').hide().css('visibility', 'collapse');


            //Add users to HTML
            let usersOrderDiv = $('#userSelectionOrder');
            let usersAdminDiv = $('#userSelectionEdit');   //Wtf...
            res.users.forEach( user =>{
                insertUserOrder(usersOrderDiv, user);
                insertUserAdmin(usersAdminDiv, user);

                bindUserOrder();
                bindUserAdmin();
            });


        } else {
            currentUser.isAdmin = false;
        }
        logged = true;

        changeView(gotoOrder ? 'userSelection' : 'dashboard');
        $("#preordersContainer").show();

        $('.login').val('');
        $("#loginNav").html('Connecté: <b> &nbsp; ' + currentUser.login + '</b>');
        $('#loginPopup').hide();
    } else {
        notif('danger', 'Wrong credancials');
    }
    $('#loginNav').removeClass('is-loading');
    $('.password').val('');

    //Assign large arrays at end of block to optimize memory consumption
    users = res.users;
});


/*
*  UI EVENTS
*/
//Main login
$('#submitLogin').on('click', (e) => {

    let email = $('#loginAdmin').val();
    let password = $('#password').val();


    login(email, password);
});

$('#submitLoginPopup').on('click', (e) => {

    let email = $('#emailPopup').val();
    let password = $('#passwordPopup').val();


    login(email, password);
});


$('.password').on('keypress', (e) => {
  let keycode = e.keyCode || e.which;
    if (keycode == 13) {

        $("#loginNav").addClass('is-loading');

        let username = $((currentView == 'login') ? '#loginAdmin' : '#loginPopup').val();
        let clear = $((currentView == 'login') ? '#password' : '#passwordPopup').val();

        login(username, clear);
    }
});

$("#emailPopup").on('keypress', (e)=>{
    let keycode = e.keyCode || e.which
    if (keycode == 9){
        e.preventDefault();
        // e.stopPropagation();
        $("#loginNav").trigger('click')
        $("#passwordPopup").focus();
    }
})

$(document).on('keypress', (e)=>{
    let keycode = e.keyCode || e.which;
    if (keycode == 46){
        $('#loginNav').trigger('click');
    }
})

//Account creation
$('#toSignUp').on('click', (e) => {
    changeView('signup');
});
