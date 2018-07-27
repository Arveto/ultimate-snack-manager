
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

$(".adminUserAction").on('click', function(e){
    //get Id of the user selected

    let edition = {};
    let el = e.target.closest(".adminUserAction"); //Do not remove ! It works like that, its 6:36am and i dont wanna think too much
    let userId = getIdFromClassName( el );

    edition = usersList[userId];

    switch (el.className.match(/action_[^ ]*/g)[0]){
      case 'action_toggleSetAdminUser':
        edition.admin = !edition.admin
        sendEdition(edition);
        break;
      case 'action_editUser':
        sendEdition(edition);
        break;
      case 'action_removeUser':
        edition.remove = true;
        sendEdition(edition);
        break;
      default:
        alert("Impossible, une erreur dans mon code ??")
    }

});

function sendEdition(edition){
    socket.emit('editUser', {'admin': currentUser, 'edition': edition});
}


socket.on('editUser', (edition)=>{  // TODO: Finish that shit, its too much for me. 7:43am. Hands up. Goona leave thoses awesome lines. Kiss ya.
  console.log(edition);
})
