const socket = io.connect('192.168.1.26:8080'); //Put your local IP here

const theme = 'BLUE' // two themes : 'RED' or 'BLUE'

let currentView = 'login';
let logged = false;
let gotoOrder = false;

function changeView(target) {
    $('#' + currentView).hide();
    $('#' + target).show();

    currentView = target;

    $('#to' + capitalizeFirstLetter(target)).removeClass((theme == 'BLUE') ? 'is-active' : 'is-danger');
    $('#to' + capitalizeFirstLetter(target)).addClass((theme == 'BLUE') ? 'is-active' : 'is-danger');
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


//HEADER EVENTS
$(".toDashboard").on('click', () => {
    if(clientId)
    leaveOrdering();
    gotoOrder = false;
    if (logged)
    changeView('dashboard');
});

$(".toOrder").on('click', () => {
    if(clientId)
    leaveOrdering();
    if (!logged) {
        gotoOrder = true;
        changeView('login');
    } else {
        changeView(connected.isAdmin ? 'userSelection' : 'order');
    }
});

$(".toAutre").on('click', () => {
    if(clientId)
    leaveOrdering();
    gotoOrder = false;
    if (logged)
    changeView('dashboard');
});

$(".toLogin").on('click', () => {
    if(clientId)
    leaveOrdering();
    gotoOrder = false;
    if (!logged)
    changeView('login');
});

$("#loginNav").on('click', () => {
    if(clientId)
    leaveOrdering();
    gotoOrder = false;
    if (currentView != "login")
    $("#loginPopup").toggle();
})

/*
//KEY BINDING
//FUCKED UP BY BROWSER, LL'FIX IT LATER
$(document).on('keypress', (e) => {
    switch (e.charCode) {
        case 113: //F2
            e.preventDefault();
            changeView('dashboard');
            break;
        case 114: //F3
            e.preventDefault();
            changeView('userSelection');
            break;
        case 115: //F4
            e.preventDefault();
            $('#loginPopup').toggle();
            break;
        default:
    }
})
*/
