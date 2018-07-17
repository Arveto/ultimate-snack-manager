let connected = {
  login: 'ESSAIM',
  hash: null
};

/*
 *   ENCRYPTION WITH https://github.com/Caligatio/jsSHA
 */
function login(username, password) {
  $("#loginNav").addClass('is-loading');
  let shaObj = new jsSHA("SHA-512", "TEXT");
  shaObj.update(password);
  connected.login = username;
  connected.hash = shaObj.getHash("HEX");

  socket.emit("login", {
    name: username,
    password: connected.hash
  });

  socket.on('login', (res) => {
    if (res) {
      notif('success', "Connecté en tant que <b>" + connected.login + "</b>");
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
}


/*
 *  UI EVENTS
 */
//Main login
$('#submitLogin, #submitLoginPopup').on('click', (e) => {
  let clear = $('#password').val()

  login('ESSAIM', clear);
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

$("#usernamePopup").on('keypress', (e)=>{
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
