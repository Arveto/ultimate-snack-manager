const socket = io.connect('localhost:8080'); //Put your local IP here

let currentView = 'login';
let logged = false;

var users = []; //Users data, filled only for an admin account
let personalOrder = false;

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
        if(currentUser.admin)
            $('#preordersContainer').show();
});

$(".toOrder").on('click', () => {
    if(customerId)
        leaveOrdering();
    if (!logged) {
        changeView('login');
    } else if(currentUser.admin){
        changeView('userSelection');
        personalOrder = false;
    }
});
$(".toOrderPers").on('click', () => {
    if(customerId)
        leaveOrdering();
    if (!logged) {
        changeView('login');
    } else {
        $(".moldu").css('display', 'flex').css('visibility', 'visible').show();
        $('h1.title.admin, h2.subtitle.admin')/*.css('visibility', 'collapse')*/.hide();    //Works this way ¯\_(ツ)_/¯
        changeView('order');
        personalOrder = true;
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
    // if(customerId)
    //     leaveOrdering();
    // if (currentView != "login")
    //     $("#loginPopup").toggle();
    
    location.reload();  //Simpler than managing in popup
})

$("#toAdminProducts").on('click', ()=>{
        if (logged && currentUser.admin)
            changeView('adminProducts');
})

$("#toAdminUsers").on('click', ()=>{
        if (logged && currentUser.admin)
            changeView('adminUsers');
})

$("#toAccountManagement").on('click', ()=>{
        if (logged){
            fillEditForm(currentUser);
            changeView('accountManagement');
        }
})

$("#toSold").on('click', ()=>{
        if (logged){
            changeView('sold');
        }
})
