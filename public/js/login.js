
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

  socket.on('login', (res)=>{
    if (res) {
      new Notification('success', "Connecté en tant que <b>"+connected.login+"</b>")
      logged = true;
      changeView(gotoOrder ? 'userSelection' : 'dashboard');
      $('.username').val('');
      $("#loginNav").removeClass('is-loading').html('Connecté: <b> &nbsp; '+connected.login+'</b>');
      $('#loginPopup').hide();
    } else {
      let a= new Notification('danger', 'Nope')
    }

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

    let clear = $((currentView == 'login') ? '#password' : '#passwordPopup').val()

    login('ESSAIM', clear);
  }
});


$("input.password, input.username").on('keypress', (e)=>{
  if (e.charCode == 0)
    $("#loginPopup").hide();
})
