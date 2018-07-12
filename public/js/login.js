/*
 *   ENCRYPTION WITH https://github.com/Caligatio/jsSHA
 */
function login(username, password) {

  $("#loginNav").addClass('is-loading');
  let shaObj = new jsSHA("SHA-512", "TEXT");
  shaObj.update(password);
  let hash = shaObj.getHash("HEX");

  socket.emit("login", {
    name: username,
    password: hash
  }); //TODO: dynamic name

}




/*
 *  UI EVENTS
 */
//Main login
$('#submitLogin, #submitLoginPopup').on('click', () => {

console.log('iu');
  let clear = $('#password').val()

  login('ESSAIM', clear);
  // NIQUE SA MERE LA SECURITÉ
  /*  socket.on('login', ()=>{
    console.log('aze');

    if (res) {
      console.log("Connected")
  */
  logged = true;
  changeView(gotoOrder ? 'userSelection' : 'dashboard');


  /*    }
   */
  $('.password').val('');
  $('.username').val('');

  /*  });
   */
  $("#loginNav").removeClass('is-loading').html('Connecté: <b> ESSAIM</b>');
  $('#loginPopup').hide();
});


$('.password').on('keypress', (e) => {
  if (e.which == 13) {
    console.log("oiu");
    $("#loginNav").addClass('is-loading');

    let clear = $((currentView == 'login') ? '#password' : '#passwordPopup').val()

    login('ESSAIM', clear);
    // NIQUE SA MERE LA SECURITÉ
    /*  socket.on('login', ()=>{
      console.log('aze');

      if (res) {
        console.log("Connected")
    */
    logged = true;

    changeView(gotoOrder ? 'userSelection' : 'dashboard');

    /*    }
     */
    $('.password').val('');
    /*  });
     */
    $("#loginNav").removeClass('is-loading').html('Connecté: <b> ESSAIM</b>');
  }
});
