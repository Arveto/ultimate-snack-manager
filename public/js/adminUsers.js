
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
    e.preventDefault();

    let edition = {};
    let cache = e.target; //Do not remove ! It works like that, its 6:36am and i dont wanna think too much
    let userId = getIdFromClassName( e.target );

    edition = usersList[userId];

    switch (e.target.className.match(/action/g)){
      case 'action_toggleSetAdminUser':
        edition.admin = !edition.admin
        break;
      case 'action_editUser':

        break;
      case 'action_removeUser':
        edition.remove = true;
        break;
    }

    if (edition){
      socket.emit('editUser', {'admin': currentUser, 'edition': edition});
      delete edition;
      delete userId;
    }
});

socket.on('editUser', (edition)=>{

})
