
$('#adminUsersInput').on('keyup', (e)=>{
    let keycode = e.keyCode || e.which;

    switch (keycode) {
        case 38:  //arrow up
        e.preventDefault();
        break;
        case 40:  //arrow down
        e.preventDefault();
        break;
        case 13:  //enter key
        e.preventDefault();
        break;
        default:
        let input = $('#adminUsersInput').val();

        usersList.forEach((user)=>{
            if (user.name.toLowerCase().search(input.toLowerCase()) < 0){
                $('.user'+user.id).hide();
            } else {
                $('.user'+user.id).show();
            }
        })
    }
});

let edition = {};
$(".adminUserAction").on('click', function(e){
    //get Id of the user selected

    let el = e.target.closest(".adminUserAction"); //Do not remove ! It works like that, its 6:36am and i dont wanna think too much
    let userId = getIdFromClassName( el );

    edition = usersList[userId];

    switch (el.className.match(/action_[^ ]*/g)[0]){
      case 'action_toggleSetAdminUser':
        edition.admin = !edition.admin
        sendEdition(edition);
        break;
      case 'action_editUser':
        userAdminPopup(edition);
        break;
      case 'action_removeUser':
        edition.remove = true;
        sendEdition(edition);
        break;
      default:
        alert("Impossible, une erreur dans mon code ??")
    }

});

function sendEdition(){
    socket.emit('editUser', {'admin': currentUser, 'edition': edition});
}


function userAdminPopup(){
  console.log(edition);
  $('#adminUsers div').addClass('blur');
  $('#userAdministrationPopup').show();

  $('.title.userAdminName').html(edition.name);
   $("#userAdmin_fiName").val(edition.fiName);
   $("#userAdmin_faName").val(edition.faName);
   $("#userAdmin_pseudo").val(edition.pseudo);
   $("#userAdmin_money").val(edition.money);
   $("#userAdmin_email").val(edition.email);
}
$("#userAdmin_apply").on('click', ()=>{
  edition.fiName = $("#userAdmin_fiName").val();
  edition.faName = $("#userAdmin_faName").val();
  edition.pseudo = $("#pseudo").val();
  edition.money = $("#userAdmin_money").val();
  edition.email = $("#userAdmin_email").val();

  sendEdition();
})



  // INNER SOCKIO EVENTS

socket.on('editUser', ()=>{  // TODO: Finish that shit, its too much for me. 7:43am. Hands up. Goona leave thoses awesome lines. Kiss ya.

  $('#adminUsers div.blur').removeClass('blur');
  $("#userAdministrationPopup").hide();


  if (edition.hasOwnProperty('remove')){
    $('.user'+edition.id).remove();
  } else {
    $('.userAdmin_info'+edition.id + ' strong').html(edition.name);
    $('.userAdmin_info'+edition.id + ' small').html(edition.money);

    if (edition.admin) {
      $('.'+edition.id+'.adminUserAction .isNotCafetier').addClass('confirmedAdmin');
      $('.'+edition.id+'.adminUserAction .isCafetier').addClass('confirmedAdmin');
    } else {
      $('.'+edition.id+'.adminUserAction .isCafetier').removeClass('confirmedAdmin');
      $('.'+edition.id+'.adminUserAction .isNotCafetier').removeClass('confirmedAdmin');
    }
  }

  console.log(edition);
})
