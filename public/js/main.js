
const socket = io.connect('192.168.1.20');

const theme = 'BLUE' // two themes : 'RED' or 'BLUE'

let pannel = 'dashboard';
let logged = false;
let gotoOrder = false;

function changeView(target) {
  $('#'+pannel).hide();
  $('#'+target).show();

  pannel = target;

  $('#to'+capitalizeFirstLetter(target)).removeClass( (theme == 'BLUE') ? 'is-active' : 'is-danger');
  $('#to'+capitalizeFirstLetter(target)).addClass( (theme == 'BLUE') ? 'is-active' : 'is-danger');
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


//HEADER EVENTS
$("#toDashboard").on('click', ()=>{
  changeView('dashboard');
});

$("#toOrder").on('click', ()=>{
  if (!logged){                      //XXX: change that for session system
    gotoOrder = true;
    changeView('login');
  } else {
    changeView('order');
  }
});

$("#toAutre").on('click', ()=>{
  changeView('dashboard');
});

$("#toLogin").on('click', ()=>{
  changeView('login');
});
