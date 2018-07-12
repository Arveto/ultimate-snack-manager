
/*
 *   ENCRYPTION WITH https://github.com/Caligatio/jsSHA
 */

$('#submitLogin').on('click', ()=>{

  $("#loginNav").addClass('is-loading');

  let clear = $('#password').val()
  let shaObj = new jsSHA("SHA-512", "TEXT");
  shaObj.update(clear);
  let hash = shaObj.getHash("HEX");

  socket.emit("login", {name: 'terruss', password: hash}); //TODO: dynamic name

  socket.on('login', (res)=>{
    if (res) {
        console.log("Connected")
      logged = true;
      $("#loginNav").removeClass('is-loading').html('Connecté: <b> ESSAIM</b>');
      changeView(gotoOrder ? 'order' : 'dashboard');
      $('#login').css("display", "none");
    }

    $('#password').val('');
  });
});
