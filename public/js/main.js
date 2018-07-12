
const socket = io.connect('localhost');

const theme = 'BLUE' // two themes : 'RED' or 'BLUE'

let currentView = 'login';
let logged = false;
let gotoOrder = false;

function changeView(target) {
  $('#'+currentView).hide();
  $('#'+target).show();

  currentView = target;

  $('#to'+capitalizeFirstLetter(target)).removeClass( (theme == 'BLUE') ? 'is-active' : 'is-danger');
  $('#to'+capitalizeFirstLetter(target)).addClass( (theme == 'BLUE') ? 'is-active' : 'is-danger');
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


//HEADER EVENTS
$("#toDashboard").on('click', ()=>{
  if(logged)
    changeView('dashboard');
});

$("#toOrder").on('click', ()=>{
  if (!logged){                      //XXX: change that for session system
    gotoOrder = true;
    changeView('login');
  } else {
    changeView('userSelection');
  }
});

$("#toAutre").on('click', ()=>{
    if(logged)
        changeView('dashboard');
});

$("#toLogin").on('click', ()=>{
  if(!logged)
    changeView('login');
});

$("#loginNav").on('click', ()=>{
  if(currentView!="login")
    $("#loginPopup").toggle();

})
