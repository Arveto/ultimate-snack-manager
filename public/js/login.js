let connected = {
    id: null,
    login: null,
    hash: null,
    isAdmin: false
};

/*
*   ENCRYPTION WITH https://github.com/Caligatio/jsSHA
*/
function login(email, password) {
    $("#loginNav").addClass('is-loading');
    let shaObj = new jsSHA("SHA-512", "TEXT");
    shaObj.update(password);
    connected.login = email;
    connected.hash = shaObj.getHash("HEX");

    socket.emit("login", {
        email: email,
        password: connected.hash
    });
}

socket.on('login', (res) => {
    if (res.ok) {
        notif('success', "Connecté en tant que <b>" + connected.login + "</b>");
        connected.id = res.id;
        if (res.isAdmin){
            notif('success', 'You are <b>ADMIN</b>')
            connected.isAdmin = true;
            $(".admin").css('display', 'flex').css('visibility', 'visible');
            $('.moldu').hide().css('visibility', 'collapse');
        }
        logged = true;

        changeView(gotoOrder ? 'userSelection' : 'dashboard');
        $("#preordersContainer").show();

        $('.login').val('');
        $("#loginNav").html('Connecté: <b> &nbsp; ' + connected.login + '</b>');
        $('#loginPopup').hide();
    } else {
        notif('danger', 'Wrong credancials');
    }
    $('#loginNav').removeClass('is-loading');
    $('.password').val('');
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
    if (e.which == 13) {

        $("#loginNav").addClass('is-loading');

        let username = $((currentView == 'login') ? '#loginAdmin' : '#loginPopup').val();
        let clear = $((currentView == 'login') ? '#password' : '#passwordPopup').val();

        login(username, clear);
    }
});


$("input.password, input.login").on('keypress', (e) => {
    if (e.charCode == 0)
    $("#loginPopup").hide();
});

$("#emailPopup").on('keypress', (e)=>{
    let keycode = e.keyCode || e.which
    if (keycode == 9){
        console.log("oiu");
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
