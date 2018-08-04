const socket = io.connect('localhost:8080'); //Put your local IP here

let currentView = 'login';
let logged = false;

var users = []; //Users data, filled only for an admin account

changeView(currentView);

function changeView(target) {
    $('.pannel').hide();
    $('#' + target).show();

    currentView = target;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


//HEADER EVENTS
$(".toDashboard").on('click', () => {
    if(customerId)
        leaveOrdering();
    if (logged)
        changeView('dashboard');
});

$(".toOrder").on('click', () => {
    if(customerId)
        leaveOrdering();
    if (!logged) {
        changeView('login');
    } else {
        changeView(currentUser.isAdmin ? 'userSelection' : 'order');
    }
});

$(".toAutre").on('click', () => {
    if(customerId)
        leaveOrdering();
    if (logged)
        changeView('dashboard');
});

$(".toLogin").on('click', () => {
    if(customerId)
        leaveOrdering();
    if (!logged)
        changeView('login');
});

$("#loginNav").on('click', () => {
    if(customerId)
        leaveOrdering();
    if (currentView != "login")
        $("#loginPopup").toggle();
})

$("#toAdminProducts").on('click', ()=>{
        if (logged)
            changeView('adminProducts');
})

$("#toAdminUsers").on('click', ()=>{
        if (logged)
            changeView('adminUsers');
})


//KEY BINDING

$("*").on('keypress', (e) => {
  let keycode = e.keyCode || e.which;
    switch (keycode) {
        case 27: //ESC
          $('#adminUsers div.blur').removeClass('blur');
          $("#userAdministrationPopup").hide();
          $("#loginPopup").hide();
          break;
        case 115: //ESC
          changeView('adminUsers')
          break;
        default:
    }
})
