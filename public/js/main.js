const socket = io.connect('localhost');

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
$("#toDashboard").on('click', () => {
  if (logged)
    changeView('dashboard');
});

$("#toOrder").on('click', () => {
  if (!logged) { //XXX: change that for session system
    gotoOrder = true;
    changeView('login');
  } else {
    changeView('userSelection');
  }
});

$("#toAutre").on('click', () => {
  if (logged)
    changeView('dashboard');
});

$("#toLogin").on('click', () => {
  if (!logged)
    changeView('login');
});

$("#loginNav").on('click', () => {
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
