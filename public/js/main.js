const socket = io.connect('localhost:8080'); //Put your local IP here

let currentView = 'login';
let logged = false;
let gotoOrder = false;

var theme = 'BLUE';

changeView(currentView)

function changeView(target) {
    // $('#' + currentView).hide();
    $('.pannel').hide();
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
    if(customerId)
    leaveOrdering();
    gotoOrder = false;
    if (logged)
    changeView('dashboard');
});

$(".toOrder").on('click', () => {
    if(customerId)
    leaveOrdering();
    if (!logged) {
        gotoOrder = true;
        changeView('login');
    } else {
        changeView(currentUser.isAdmin ? 'userSelection' : 'order');
    }
});

$(".toAutre").on('click', () => {
    if(customerId)
    leaveOrdering();
    gotoOrder = false;
    if (logged)
    changeView('dashboard');
});

$(".toLogin").on('click', () => {
    if(customerId)
    leaveOrdering();
    gotoOrder = false;
    if (!logged)
    changeView('login');
});

$("#loginNav").on('click', () => {
    if(customerId)
    leaveOrdering();
    gotoOrder = false;
    if (currentView != "login")
    $("#loginPopup").toggle();
})


    //Data declaration

//See preorders.js
var preorders = [];

    //See order.js
let date = new Date;
let commandList = []; //IDs of selected products & amount of it
let totalPrice;



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
